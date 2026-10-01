/**
 * quizGenerator.ts — Generates multiple-choice educational quiz questions via Groq LLM.
 */
import {getGroqClient, getGroqModel} from './groqClient';

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface QuizGeneratorInput {
  topic: string;
  language: string;
  ageGroup: string;
  count?: number;
  excludeQuestions?: string[];
}

export async function generateQuizQuestions(input: QuizGeneratorInput): Promise<QuizQuestion[]> {
  const {topic, language, ageGroup, count = 10, excludeQuestions = []} = input;

  const client = getGroqClient();
  const model = getGroqModel();

  let excludePrompt = '';
  if (excludeQuestions && excludeQuestions.length > 0) {
    excludePrompt = `\nDO NOT repeat or generate questions similar to any of these previously asked questions:\n` +
      excludeQuestions.map((q, i) => `${i + 1}. "${q}"`).join('\n') + '\n';
  }

  const systemPrompt = `You are an expert educational quiz creator. Your task is to generate a high-quality, multiple-choice quiz based on the user's requested topic.
Target Language: ${language}
Target Audience / Explanation Depth: ${ageGroup}

REQUIREMENTS:
1. Generate exactly ${count} multiple-choice questions testing key concepts of the topic.
2. Questions and options MUST be written in ${language}.
3. Each question must have EXACTLY 4 options.
4. "correctIndex" must be an integer index (0, 1, 2, or 3) pointing to the correct option in the options array.
5. "explanation" must be a clear, concise explanation in ${language} explaining why the correct answer is right.
${excludePrompt}
OUTPUT FORMAT:
You MUST respond with a raw JSON object only (no markdown formatting, no \`\`\`json wrapper).
JSON Schema:
{
  "questions": [
    {
      "id": "1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Explanation text here."
    }
  ]
}`;

  const userPrompt = `Topic: "${topic}"\nLanguage: "${language}"\nComplexity/Depth: "${ageGroup}"\nPlease generate ${count} multiple choice questions.`;

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: userPrompt},
    ],
    temperature: 0.5,
  });

  const rawContent = completion.choices[0]?.message?.content ?? '';

  let cleanJson = rawContent.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  try {
    const parsed = JSON.parse(cleanJson);
    if (!parsed || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid JSON structure: missing "questions" array.');
    }

    const questions: QuizQuestion[] = parsed.questions.map((q: any, index: number) => {
      const options = Array.isArray(q.options) && q.options.length >= 4
        ? [String(q.options[0]), String(q.options[1]), String(q.options[2]), String(q.options[3])] as [string, string, string, string]
        : ['Option A', 'Option B', 'Option C', 'Option D'] as [string, string, string, string];

      const correctIndex = typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3
        ? q.correctIndex
        : 0;

      return {
        id: String(q.id || index + 1),
        question: String(q.question || `Question ${index + 1}`),
        options,
        correctIndex,
        explanation: String(q.explanation || 'The correct answer is highlighted above.'),
      };
    });

    return questions;
  } catch (err) {
    console.error('[quizGenerator] Failed to parse Groq response:', rawContent, err);
    throw new Error('Failed to generate valid quiz questions from AI service.');
  }
}
