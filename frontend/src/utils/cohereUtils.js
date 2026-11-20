// Simulated AI helpers for file analysis
export async function analyzeFile(file) {
  await new Promise((res) => setTimeout(res, 500)); // simulate AI delay

  // Simulated text extraction (from PDF/Word/TXT)
  const extractedText = `Simulated extracted text from ${file.name}.
It covers Python Basics, OOP concepts, Data Analysis techniques, and ML overview.`;

  // Simulated topic detection (unique topics)
  const detectedTopics = Array.from(
    new Set(["Python Basics", "OOP", "Data Analysis", "ML Overview"])
  );

  // Generate study material per topic
  const aiAnalysis = {};
  detectedTopics.forEach((topic) => {
    aiAnalysis[topic] = {
      summary: `Summary of ${topic}`,
      notes: [`${topic} important point 1`, `${topic} important point 2`],
      keywords: [`${topic} Keyword1`, `${topic} Keyword2`, `${topic} Keyword3`],
      quiz: [
        {
          question: `Sample question 1 from ${topic}`,
          options: ["A", "B", "C", "D"],
          answer: "A",
          explanation: "Explanation 1",
        },
        {
          question: `Sample question 2 from ${topic}`,
          options: ["A", "B", "C", "D"],
          answer: "B",
          explanation: "Explanation 2",
        },
      ],
    };
  });

  return { filename: file.name, extractedText, topics: detectedTopics, aiAnalysis };
}
