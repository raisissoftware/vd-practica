import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AiRequestOptions {
  userId: string;
  actionType: 'QUESTIONNAIRE' | 'BLOG' | 'SEO';
  promptTemplate: string;
  variables: Record<string, string>;
}

// 1. Cost Tracking Config (Criteriu din Linear)
const COST_PER_INPUT_TOKEN = 0.005 / 1000;
const COST_PER_OUTPUT_TOKEN = 0.015 / 1000;

export async function generateAiContent({
  userId,
  actionType,
  promptTemplate,
  variables,
}: AiRequestOptions) {
  // Configurare șabloane de prompt-uri
  let finalPrompt = promptTemplate;
  Object.entries(variables).forEach(([key, value]) => {
    finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY lipseste din .env');

  // 2. Moderation Layer (Criteriu obligatoriu)
  const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ input: finalPrompt }),
  });
  const moderationData = await moderationResponse.json();
  if (moderationData.results?.[0]?.flagged) {
    throw new Error('Promptul a picat stratul de moderare AI.');
  }

  // 3. Retry Mechanisms (Maximum 3 încercări dacă pică rețeaua)
  let attempts = 0;
  let responseData: any = null;
  while (attempts < 3) {
    try {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: finalPrompt }],
        }),
      });
      if (!aiResponse.ok) throw new Error('OpenAI API Error');
      responseData = await aiResponse.json();
      break; // Succes!
    } catch (error) {
      attempts++;
      if (attempts >= 3) throw error;
      await new Promise((res) => setTimeout(res, 2000)); // Așteaptă 2 secunde înainte de retry
    }
  }

  const generatedText = responseData.choices[0].message.content;
  const promptTokens = responseData.usage.prompt_tokens;
  const completionTokens = responseData.usage.completion_tokens;
  const totalTokens = responseData.usage.total_tokens;

  // Calculare cost estimat
  const estimatedCost = (promptTokens * COST_PER_INPUT_TOKEN) + (completionTokens * COST_PER_OUTPUT_TOKEN);

  // 4. AI History Persistence (Salvare directă în modelul Prisma pe care l-ai creat)
  const historyLog = await prisma.aiGenerationHistory.create({
    data: {
      userId,
      actionType,
      prompt: finalPrompt,
      result: generatedText,
      promptTokens,
      completionTokens,
      totalTokens,
      cost: estimatedCost,
    },
  });

  return { 
    success: true, 
    data: generatedText, 
    historyId: historyLog.id,
    cost: estimatedCost,
    tokens: totalTokens
  };
}