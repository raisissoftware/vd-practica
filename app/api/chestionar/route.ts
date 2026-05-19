import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch the digital maturity questionnaire (auto-seeds if not present)
export async function GET() {
    try {
        const slug = "evaluare-maturitate-digitala";

        // 1. Search for existing questionnaire
        let questionnaire = await prisma.questionnaire.findUnique({
            where: { slug },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                },
            },
        });

        // 2. If it does not exist, seed it automatically
        if (!questionnaire) {
            questionnaire = await prisma.$transaction(async (tx) => {
                // Create the questionnaire
                const newQuestionnaire = await tx.questionnaire.create({
                    data: {
                        slug,
                        title: "Evaluare Maturitate Digitală",
                        description: "Află în doar 3 minute care este nivelul actual de digitalizare al companiei tale și primește recomandări personalizate pentru eficientizarea proceselor.",
                        status: "PUBLISHED",
                    },
                });

                // Define questions to seed
                const questionsToCreate = [
                    {
                        type: "SINGLE_CHOICE",
                        text: "Care este principalul domeniu de activitate al companiei tale?",
                        options: ["Servicii", "Comerț / Retail", "Producție", "Construcții", "Horeca", "Altul"],
                        required: true,
                        order: 1,
                    },
                    {
                        type: "RATING",
                        text: "Pe o scară de la 1 la 5, cât de digitalizate sunt procesele interne ale companiei în prezent? (1 = complet manual/hârtie, 5 = complet automatizat)",
                        options: null,
                        required: true,
                        order: 2,
                    },
                    {
                        type: "MULTIPLE_CHOICE",
                        text: "Ce instrumente folosiți în prezent pentru managementul clienților (CRM) și vânzări? (Alegeți toate opțiunile aplicabile)",
                        options: ["Excel / Spreadsheet", "CRM dedicat (ex: HubSpot, Salesforce, Pipedrive)", "Agendă fizică / Notițe pe hârtie", "Email / WhatsApp", "Niciunul / Nu avem un flux organizat"],
                        required: true,
                        order: 3,
                    },
                    {
                        type: "SINGLE_CHOICE",
                        text: "Cum gestionați în prezent documentele, contractele și facturile companiei?",
                        options: [
                            "Fizic (pe hârtie, în dosare și bibliorafturi)",
                            "Stocare în Cloud (Google Drive, Dropbox, OneDrive)",
                            "Server local partajat în rețea (Shared Folder / NAS)",
                            "Sistem dedicat de Document Management (DMS / ERP)",
                        ],
                        required: true,
                        order: 4,
                    },
                    {
                        type: "TEXT",
                        text: "Care este principalul blocaj sau provocare în implementarea noilor tehnologii în compania ta?",
                        options: null,
                        required: false,
                        order: 5,
                    },
                    {
                        type: "SINGLE_CHOICE",
                        text: "Care este bugetul estimativ pe care compania l-ar putea aloca pentru digitalizare în următoarele 6 luni?",
                        options: ["Sub 1.000 EUR", "1.000 - 5.000 EUR", "5.000 - 15.000 EUR", "Peste 15.000 EUR"],
                        required: true,
                        order: 6,
                    },
                ];

                await Promise.all(
                    questionsToCreate.map((q) =>
                        tx.question.create({
                            data: {
                                questionnaireId: newQuestionnaire.id,
                                type: q.type,
                                text: q.text,
                                options: q.options ? (q.options as any) : undefined,
                                required: q.required,
                                order: q.order,
                            },
                        })
                    )
                );

                // Fetch again complete with questions
                return tx.questionnaire.findUniqueOrThrow({
                    where: { id: newQuestionnaire.id },
                    include: {
                        questions: {
                            orderBy: { order: "asc" },
                        },
                    },
                });
            });
        }

        // Standardize JSON options parsing for UI consumption
        const formattedQuestions = questionnaire.questions.map((q) => ({
            ...q,
            options: q.options ? (q.options as any as string[]) : null,
        }));

        return NextResponse.json({
            id: questionnaire.id,
            slug: questionnaire.slug,
            title: questionnaire.title,
            description: questionnaire.description,
            status: questionnaire.status,
            questions: formattedQuestions,
        });
    } catch (error) {
        console.error("[CHESTIONAR_GET_ERROR]", error);
        return new Response("A apărut o eroare la încărcarea chestionarului.", { status: 500 });
    }
}

// POST: Capture Lead contact info + Questionnaire answers, calculate results
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, source, questionnaireId, responses } = body;

        // 1. Validation
        if (!name || !email || !questionnaireId || !responses) {
            return new Response("Numele, emailul și răspunsurile sunt obligatorii.", { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response("Adresa de email nu este validă.", { status: 400 });
        }

        // 2. Fetch questions to match and validate answers, and compute score
        const questions = await prisma.question.findMany({
            where: { questionnaireId },
        });

        if (questions.length === 0) {
            return new Response("Chestionarul specificat nu are întrebări asociate.", { status: 404 });
        }

        // 3. Save Lead + Responses inside a Prisma Transaction
        const lead = await prisma.$transaction(async (tx) => {
            const newLead = await tx.lead.create({
                data: {
                    name,
                    email,
                    phone: phone || null,
                    source: source || "questionnaire",
                    questionnaireId,
                },
            });

            // Save each response answer
            const answerPromises = Object.entries(responses).map(([questionId, value]) => {
                // Double-check if the question exists
                const questionExists = questions.some((q) => q.id === questionId);
                if (!questionExists) return Promise.resolve();

                return tx.responseAnswer.create({
                    data: {
                        leadId: newLead.id,
                        questionId,
                        answer: JSON.stringify(value),
                    },
                });
            });

            await Promise.all(answerPromises);
            return newLead;
        });

        // 4. Calculate Scoring & Generate Personalized Recommendations
        let scoreProcesses = 0;
        let scoreCRM = 0;
        let scoreDocs = 0;

        const recommendations: string[] = [];

        // Analyze answers to calculate maturity level
        questions.forEach((q) => {
            const answerVal = responses[q.id];
            if (answerVal === undefined || answerVal === null) return;

            // Question order 2: Digital Processes Rating
            if (q.order === 2) {
                const rating = Number(answerVal);
                if (!isNaN(rating)) {
                    // Translate 1-5 rating into 0-100%
                    scoreProcesses = (rating - 1) * 25;
                }

                if (rating <= 2) {
                    recommendations.push(
                        "Automatizarea proceselor zilnice repetitive (cum ar fi trimiterea automată de confirmări prin email sau facturare automată) îți poate elibera până la 10 ore pe săptămână."
                    );
                }
            }

            // Question order 3: CRM tools (Multiple choice)
            if (q.order === 3) {
                const selected = Array.isArray(answerVal) ? answerVal : [answerVal];
                const hasDedicatedCRM = selected.some((s) => String(s).toLowerCase().includes("crm dedicat"));
                const hasExcel = selected.some((s) => String(s).toLowerCase().includes("excel"));
                const hasWhatsapp = selected.some((s) => String(s).toLowerCase().includes("email / whatsapp"));
                const hasNoneOrAgenda = selected.some(
                    (s) =>
                        String(s).toLowerCase().includes("niciunul") || String(s).toLowerCase().includes("agendă")
                );

                if (hasDedicatedCRM) {
                    scoreCRM = 100;
                } else if (hasExcel || hasWhatsapp) {
                    scoreCRM = 40;
                    recommendations.push(
                        "Centralizează-ți lead-urile într-un CRM modern (precum HubSpot sau Pipedrive). Folosirea foilor de calcul Excel sau a mesajelor WhatsApp crește riscul de a pierde clienți din cauza lipsei de urmărire structurată."
                    );
                } else if (hasNoneOrAgenda) {
                    scoreCRM = 0;
                    recommendations.push(
                        "Implementarea imediată a unui flux digital elementar de colectare a clienților potențiali este cel mai important pas pentru a-ți crește conversiile și a nu mai pierde contacte valoroase."
                    );
                } else {
                    scoreCRM = 30;
                }
            }

            // Question order 4: Document management (Single choice)
            if (q.order === 4) {
                const textAnswer = String(answerVal).toLowerCase();
                if (textAnswer.includes("sistem dedicat") || textAnswer.includes("dms") || textAnswer.includes("erp")) {
                    scoreDocs = 100;
                } else if (textAnswer.includes("cloud")) {
                    scoreDocs = 70;
                    recommendations.push(
                        "Stocarea în Cloud este un pas excelent, dar pentru eficiență maximă, stabilește șabloane standardizate de denumire a fișierelor și organizează folderele pe departamente, reducând timpul pierdut cu căutarea."
                    );
                } else if (textAnswer.includes("server local")) {
                    scoreDocs = 40;
                    recommendations.push(
                        "Mutarea pe o soluție Cloud securizată va îmbunătăți considerabil viteza de colaborare, permițând echipei tale să acceseze documentele de oriunde, inclusiv de pe mobil, fără restricțiile unui VPN sau server local."
                    );
                } else if (textAnswer.includes("fizic") || textAnswer.includes("hârtie")) {
                    scoreDocs = 0;
                    recommendations.push(
                        "Digitizarea documentelor fizice importante (ex: contracte, facturi) și arhivarea lor în Cloud va elimina riscul de pierdere a documentelor și va reduce timpul de căutare a informațiilor cu până la 85%."
                    );
                }
            }
        });

        // Weighted score: 35% processes, 35% CRM, 30% documents
        const totalScore = Math.round(scoreProcesses * 0.35 + scoreCRM * 0.35 + scoreDocs * 0.3);

        // Classification
        let level = "Digitalizare Incipientă";
        let title = "Procese în principal manuale sau analogice";
        let description =
            "Compania ta se află în primele etape ale călătoriei digitale. Multe activități zilnice sunt încă dependente de hârtie sau procese manuale descentralizate, ceea ce poate duce la pierderi accidentale de date, erori umane și timp prețios irosit din partea echipei.";

        if (totalScore > 35 && totalScore <= 70) {
            level = "Digitalizare Medie";
            title = "Procese parțial digitalizate și instrumente fragmentate";
            description =
                "Compania ta folosește cu succes instrumente digitale de bază (cum ar fi stocarea în Cloud și comunicarea prin email/WhatsApp), însă fluxurile nu sunt complet integrate sau automatizate. Există oportunități majore de automatizare pentru a elimina sarcinile administrative repetitive.";
        } else if (totalScore > 70) {
            level = "Lider Digital";
            title = "Fluxuri integrate și mentalitate orientată spre tehnologie";
            description =
                "Felicitări! Compania ta are o bază digitală solidă. Folosești softuri dedicate și ai o deschidere mare spre inovație. Următorul pas este optimizarea fină prin inteligență artificială, integrări avansate API și rafinarea continuă a rapoartelor automate pentru a maximiza scalabilitatea.";
        }

        // Default recommendation if empty
        if (recommendations.length === 0) {
            recommendations.push(
                "Fă un audit complet al proceselor interne pentru a identifica cea mai mică acțiune manuală repetitivă ce poate fi automatizată astăzi."
            );
        }

        return NextResponse.json({
            success: true,
            leadId: lead.id,
            score: totalScore,
            level,
            title,
            description,
            recommendations,
        });
    } catch (error) {
        console.error("[CHESTIONAR_POST_ERROR]", error);
        return new Response("A apărut o eroare la salvarea răspunsurilor.", { status: 500 });
    }
}