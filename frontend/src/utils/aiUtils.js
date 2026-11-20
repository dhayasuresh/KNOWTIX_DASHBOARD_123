// backend/aiUtils.js

export const aiSummarize = async (text) => {
  return `Summary of: ${text}`;
};

export const aiGenerateQuiz = async (text, count = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    question: `Question ${i + 1} about ${text}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: "Option A",
    explanation: "Explanation here"
  }));
};

export const aiExtractKeywords = async (text, count = 5) => {
  const words = text.split(/\s+/).filter(w => w.length > 3);
  return words.slice(0, count);
};

export const aiGenerateStudyMaterial = async (text) => {
  const summary = await aiSummarize(text);
  const topics = await aiExtractKeywords(text, 8);
  return `Study Material:\nTopics: ${topics.join(", ")}\n\nSummary:\n${summary}`;
};
