import React, { useState } from "react";
import axios from "axios";

export default function StudyMaterials() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5003/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing file");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: 1000,
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    lineHeight: 1.6,
  };

  const inputStyle = {
    padding: "0.6rem 1rem",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
    cursor: "pointer",
  };

  const buttonStyle = {
    padding: "0.7rem 1.5rem",
    marginLeft: 12,
    borderRadius: 6,
    border: "none",
    background: "#4A90E2",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.3s",
  };

  const buttonHover = {
    background: "#357ABD",
  };

  const sectionStyle = {
    background: "#fff",
    borderRadius: 10,
    padding: "1.5rem",
    margin: "1.5rem 0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const sectionHover = {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  };

  const listStyle = {
    marginTop: 10,
    paddingLeft: 20,
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", color: "#4A90E2" }}>Knowtix — Study Material Analyzer</h1>

      <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
        <input type="file" style={inputStyle} onChange={e => setFile(e.target.files[0])} />
        <button
          style={buttonStyle}
          onClick={handleUpload}
          disabled={loading}
          onMouseOver={e => e.currentTarget.style.background = buttonHover.background}
          onMouseOut={e => e.currentTarget.style.background = buttonStyle.background}
        >
          {loading ? "Analyzing..." : "Analyze File"}
        </button>
      </div>

      {data && (
        <div>
          {["summary", "notes", "keywords", "topics", "quiz", "important_questions"].map((section, idx) => (
            <div
              key={idx}
              style={sectionStyle}
              onMouseOver={e => Object.assign(e.currentTarget.style, sectionHover)}
              onMouseOut={e => Object.assign(e.currentTarget.style, sectionStyle)}
            >
              <h2 style={{ color: "#4A90E2" }}>
                {section.charAt(0).toUpperCase() + section.slice(1).replace("_", " ")}
              </h2>

              {section === "notes" && <ul style={listStyle}>{data.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
              {section === "keywords" && <p>{data.keywords.join(", ")}</p>}
              {section === "topics" && <ul style={listStyle}>{data.topics.map((t, i) => <li key={i}>{t}</li>)}</ul>}
              {section === "quiz" && data.quiz.map((q, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <b>Q{i + 1}: {q.question}</b>
                  <p>Answer: {q.answer}</p>
                </div>
              ))}
              {section === "important_questions" && data.important_questions.map((q, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <b>Q{i + 1} ({q.marks}): {q.question}</b>
                  <p>Answer: {q.answer}</p>
                </div>
              ))}
              {section === "summary" && <p>{data.summary}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
