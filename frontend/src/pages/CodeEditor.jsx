import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/pages.css";

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [files, setFiles] = useState([{ name: "main", code: "// Write your code here...\nconsole.log('Hello World');" }]);
  const [activeFile, setActiveFile] = useState(0);
  const [input, setInput] = useState(""); // stdin
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (value) => {
    const updatedFiles = [...files];
    updatedFiles[activeFile].code = value || "";
    setFiles(updatedFiles);
  };

  const addFile = () => {
    setFiles([...files, { name: `file${files.length + 1}`, code: "" }]);
    setActiveFile(files.length);
  };

  const switchFile = (index) => setActiveFile(index);

  const requiresInput = () => {
    const numericKeywords = {
      javascript: ["prompt(", "Number(", "parseInt(", "parseFloat("],
      python: ["input(", "int(", "float("],
      c: ["scanf(", "cin >>"],
      cpp: ["cin >>", "scanf("],
      bash: [],
    };
    return numericKeywords[language]?.some((kw) => files[activeFile].code.includes(kw));
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("⏳ Running...");

    try {
      if (language === "javascript") {
        // Replace prompt() with user input for JS
        let codeToRun = files[activeFile].code;
        const inputs = input ? input.split(" ") : [];
        inputs.forEach((val) => {
          codeToRun = codeToRun.replace(/prompt\(\)/, `"${val}"`);
        });

        // Eval instantly
        try {
          // eslint-disable-next-line no-eval
          const result = eval(codeToRun);
          setOutput(result !== undefined ? result.toString() : "✅ Code ran successfully!");
        } catch (err) {
          setOutput(`❌ JS Error:\n${err}`);
        }
        setLoading(false);
        return;
      }

      // All other languages -> backend
      const response = await axios.post("http://localhost:5050/run", {
        code: files[activeFile].code,
        language,
        stdin: input,
      }, { timeout: 3000 }); // 3s timeout for fast response

      if (response.data.error) setOutput(`❌ Error:\n${response.data.error}`);
      else setOutput(response.data.output || "✅ Code ran successfully!");
    } catch (err) {
      if (err.code === "ECONNABORTED") setOutput("❌ Timeout: Your code took too long.");
      else setOutput("❌ Failed to connect to code runner backend.");
    }

    setLoading(false);
  };

  return (
    <div className="page code-editor-container">
      <h1 className="title">Online Code Compiler</h1>

      {/* Top Controls */}
      <div className="editor-controls">
        <div className="language-theme">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="bash">Linux Shell</option>
          </select>

          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <button className="add-file-btn" onClick={addFile}>+ Add File</button>
      </div>

      {/* File Tabs */}
      <div className="file-tabs">
        {files.map((f, i) => (
          <button
            key={i}
            className={`file-tab ${activeFile === i ? "active" : ""}`}
            onClick={() => switchFile(i)}
          >
            {f.name}.{language}
          </button>
        ))}
      </div>

      {/* Editor */}
      <Editor
        height="400px"
        language={language === "bash" ? "shell" : language}
        theme={theme}
        value={files[activeFile].code}
        onChange={handleCodeChange}
        options={{ fontSize: 16, minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />

      {/* Input Box */}
      {requiresInput() && (
        <input
          type="text"
          className="stdin-input"
          placeholder="Enter numbers/inputs separated by space..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}

      {/* Run Button */}
      <button className="run-btn" onClick={runCode} disabled={loading}>
        {loading ? "Running..." : "Run Code"}
      </button>

      {/* Output */}
      <div className="code-output">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
