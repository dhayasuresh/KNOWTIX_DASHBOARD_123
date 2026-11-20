import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // Make sure your .env has this set
});

// Generate study content (Notes, Summary, Study Materials, Quiz, etc.)
export async function generateContent(topic, type) {
  try {
    const prompt = `Generate ${type} for the topic: "${topic}". 
Make it detailed, well-structured, and easy for students.`;

    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [{ role: "user", content: prompt }],
    });

    return response.message.content[0].text;
  } catch (err) {
    console.error("❌ Cohere content error:", err);
    return "Error generating content.";
  }
}

// Generate quiz questions
export async function generateQuestions(subject, difficulty, numQuestions = 10) {
  try {
    const prompt = `Generate ${numQuestions} multiple-choice questions in ${subject} at ${difficulty} difficulty.
Each question should include:
- A question text
- 4 options (A, B, C, D)
- The correct answer (as A/B/C/D or exact text)
- A short explanation. 

Return in JSON format with "question", "options", "answer", "explanation".`;

    const response = await cohere.chat({
      model: "command-r-plus",
      messages: [{ role: "user", content: prompt }],
    });

    // Extract text safely
    const text = response.message?.content?.[0]?.text || "[]";

    // Try parsing JSON
    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      console.warn("⚠️ Cohere returned non-JSON, wrapping manually.");
      questions = [{ question: text, options: [], answer: "", explanation: "" }];
    }

    return questions;
  } catch (err) {
    console.error("❌ Cohere questions error:", err);
    return [];
  }
}
