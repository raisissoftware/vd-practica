import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, company, email, message } = body;

        if (!name || !company || !email) {
            return new NextResponse("Lipsesc câmpuri obligatorii", { status: 400 });
        }
        console.log("Lead primit în API:", { name, company, email, message });

        return NextResponse.json({ success: true, message: "Datele au fost salvate cu succes!" }, { status: 200 });
    } catch (error) {
        return new NextResponse("Eroare internă de server", { status: 500 });
    }
}