import React, { useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "../styles/pages.css";
import { useNotes } from "../context/NotesContext";

const AIContentGenerator = () => {
  const { updateFileContent, folders } = useNotes();

  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("");
  const [step, setStep] = useState(1);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(0);
  const [selectedFile, setSelectedFile] = useState(0);

  const contentRef = useRef(null);

  const contentTypes = [
    "Notes",
    "Summary",
    "Study Materials",
    "Quiz",
    "Important Questions",
  ];

  const handleTopicSubmit = () => {
    if (!topic.trim()) return alert("Please enter a topic!");
    setStep(2);
  };

  const generateContent = async (type) => {
    setContentType(type);
    setOutput("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-content",
        { topic, type }
      );
      setOutput(response.data.content || "No content returned.");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to generate content. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text) => {
    const html = marked.parse(text);
    return { __html: DOMPurify.sanitize(html) };
  };

  const downloadPDF = () => {
    if (!output) return;
    const container = document.createElement("div");
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "12pt";
    container.style.lineHeight = "1.8";
    container.style.color = "#000";
    container.innerHTML = DOMPurify.sanitize(marked.parse(output));

    html2pdf()
      .set({
        margin: 10,
        filename: `${topic}_${contentType}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save();
  };

  const printContent = () => {
    if (!output) return;
    const newWin = window.open("", "_blank");
    newWin.document.write("<html><head><title>Print Content</title></head><body>");
    newWin.document.write(
      `<div style="font-family: Arial, sans-serif; font-size:12pt; line-height:1.8; color:#000;">${DOMPurify.sanitize(
        marked.parse(output)
      )}</div>`
    );
    newWin.document.write("</body></html>");
    newWin.document.close();
    newWin.print();
  };

  const handleSaveToNotes = () => {
    const folder = folders[selectedFolder];
    const file = folder?.files[selectedFile];
    if (!file) return alert("Select a valid file to save content!");
    updateFileContent(folder.name, file.name, output);
    alert("✅ Saved to notes!");
  };

  return (
    <div className="page">
      <h1 className="title">✨ AI Content Generator</h1>

      {step === 1 && (
        <div className="step-container">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic..."
            className="input-box"
          />
          <button onClick={handleTopicSubmit} className="btn-primary">
            Next ➝ Select Content Type
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          <h3>Select Content Type for "{topic}"</h3>
          <div className="button-grid">
            {contentTypes.map((type) => (
              <button
                key={type}
                onClick={() => generateContent(type)}
                className="btn-outline"
                disabled={loading}
              >
                {loading && contentType === type ? "⏳ Generating..." : type}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="error-box">{error}</p>}
      {loading && <p className="loading-box">⏳ Generating content...</p>}

      {output && (
        <div className="content-wrapper">
          <div className="action-buttons">
            <button onClick={downloadPDF} className="btn-primary">⬇️ Download PDF</button>
            <button onClick={printContent} className="btn-secondary">🖨 Print</button>
            <button onClick={handleSaveToNotes} className="btn-primary">💾 Save to Notes</button>
          </div>

          <div style={{ margin: "10px 0" }}>
            <select
              onChange={(e) => setSelectedFolder(parseInt(e.target.value))}
              value={selectedFolder}
            >
              {folders.map((f, i) => (
                <option key={i} value={i}>{f.name}</option>
              ))}
            </select>

            <select
              onChange={(e) => setSelectedFile(parseInt(e.target.value))}
              value={selectedFile}
            >
              {folders[selectedFolder]?.files.map((file, i) => (
                <option key={i} value={i}>{file.name}</option>
              ))}
            </select>
          </div>

          <div
            ref={contentRef}
            className="ai-output"
            dangerouslySetInnerHTML={renderMarkdown(output)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;
