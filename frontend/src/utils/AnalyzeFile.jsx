import React, { useState } from "react";
import "../styles/pages.css";

export async function analyzeFile(file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("contentType", options.contentType || "study");
  formData.append("detailLevel", options.detailLevel || "simple");
  formData.append("difficulty", options.difficulty || "medium");
  formData.append("quizCount", options.quizCount || 3);
  formData.append("marks", options.marks || 50);

  const res = await fetch("http://localhost:5003/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to analyze file");
  return await res.json();
}

// Helper to parse Cohere output into sections
function parseCohereOutput(text) {
  const sections = {
    summary: "",
    notes: "",
    quiz: [],
    importantQuestions: [],
    miniPaper: "",
  };

  const lines = text.split("\n");
  let currentSection = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (/notes/i.test(trimmed)) currentSection = "notes";
    else if (/quiz/i.test(trimmed)) currentSection = "quiz";
    else if (/important questions/i.test(trimmed))
      currentSection = "importantQuestions";
    else if (/mini question paper/i.test(trimmed)) currentSection = "miniPaper";
    else if (!currentSection) sections.summary += trimmed + " ";
    else {
      if (currentSection === "quiz") sections.quiz.push(trimmed);
      else if (currentSection === "importantQuestions")
        sections.importantQuestions.push(trimmed);
      else sections[currentSection] += trimmed + " ";
    }
  });

  return sections;
}

export default function AnalyzeFile() {
  const [file, setFile] = useState(null);
  const [contentType, setContentType] = useState("study");
  const [detailLevel, setDetailLevel] = useState("simple");
  const [difficulty, setDifficulty] = useState("medium");
  const [quizCount, setQuizCount] = useState(3);
  const [marks, setMarks] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please upload a file first!");
    setLoading(true);
    try {
      const data = await analyzeFile(file, {
        contentType,
        detailLevel,
        difficulty,
        quizCount,
        marks,
      });
      const parsed = parseCohereOutput(data.cohereOutput || "");
      setResult({ ...data, ...parsed });
    } catch (err) {
      alert("Analysis failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow-sm max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-3">📂 Analyze Study Material</h2>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />

      {/* Options */}
      <div className="mt-2 flex flex-wrap gap-4 items-center">
        <label>
          Content Type:
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="ml-2 border rounded px-2"
          >
            <option value="study">Study Material</option>
            <option value="quiz">Quiz</option>
            <option value="questions">Important Questions</option>
            <option value="paper">Mini Question Paper</option>
          </select>
        </label>

        {contentType === "study" && (
          <label>
            Detail Level:
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value)}
              className="ml-2 border rounded px-2"
            >
              <option value="simple">Simple (Def + Example)</option>
              <option value="detailed">
                Detailed (Def + Example + Derivation + Scenario)
              </option>
            </select>
          </label>
        )}

        {contentType === "quiz" && (
          <>
            <label>
              Number of Questions:
              <input
                type="number"
                min={1}
                max={20}
                value={quizCount}
                onChange={(e) => setQuizCount(Number(e.target.value))}
                className="ml-2 border rounded px-1 w-16"
              />
            </label>
            <label>
              Difficulty:
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="ml-2 border rounded px-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </>
        )}

        {contentType === "paper" && (
          <label>
            Marks:
            <select
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="ml-2 border rounded px-2"
            >
              <option value={30}>30 Marks</option>
              <option value={50}>50 Marks</option>
              <option value={60}>60 Marks</option>
            </select>
          </label>
        )}
      </div>

      <button
        onClick={handleUpload}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Analyzing..." : "Analyze File"}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {result.extractedPreview && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-bold">📄 Preview</h3>
              <p>{result.extractedPreview}</p>
            </div>
          )}

          {result.summary && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-bold">📝 Summary</h3>
              <p>{result.summary}</p>
            </div>
          )}

          {result.notes && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-bold">🗒 Notes</h3>
              <p>{result.notes}</p>
            </div>
          )}

          {result.importantQuestions.length > 0 && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-bold">❗ Important Questions</h3>
              <ol className="list-decimal pl-6">
                {result.importantQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {result.quiz.length > 0 && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-bold">🧪 Quiz</h3>
              <ol className="list-decimal pl-6">
                {result.quiz.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {result.miniPaper && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-bold">📑 Mini Question Paper</h3>
              <p>{result.miniPaper}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
