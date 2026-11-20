import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { spawn } from "child_process";
import fs from "fs";

const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const { code, language, stdin } = req.body; // receive user input

  let filename;
  let proc;

  try {
    switch (language) {
      case "javascript":
        filename = "temp.js";
        fs.writeFileSync(filename, code);
        proc = spawn("node", [filename]);
        break;

      case "python":
        filename = "temp.py";
        fs.writeFileSync(filename, code);
        proc = spawn("python", [filename]);
        break;

      case "c":
        filename = "temp.c";
        fs.writeFileSync(filename, code);
        // compile first
        const gcc = spawn("wsl", ["gcc", filename, "-o", "temp"]);
        gcc.on("close", (codeGcc) => {
          if (codeGcc !== 0) return res.json({ output: "❌ C compilation error" });
          proc = spawn("wsl", ["./temp"]);
          runProcess(proc, stdin, res);
        });
        return;

      case "cpp":
        filename = "temp.cpp";
        fs.writeFileSync(filename, code);
        const gpp = spawn("wsl", ["g++", filename, "-o", "temp"]);
        gpp.on("close", (codeGpp) => {
          if (codeGpp !== 0) return res.json({ output: "❌ C++ compilation error" });
          proc = spawn("wsl", ["./temp"]);
          runProcess(proc, stdin, res);
        });
        return;

      case "bash":
        filename = "temp.sh";
        fs.writeFileSync(filename, code);
        proc = spawn("wsl", ["bash", filename]);
        break;

      default:
        return res.json({ output: "❌ Unsupported language" });
    }

    runProcess(proc, stdin, res);

  } catch (err) {
    res.json({ output: `❌ Error: ${err.message}` });
  }
});

// Helper function to handle stdin/stdout/stderr
function runProcess(proc, stdin, res) {
  let output = "";

  proc.stdout.on("data", (data) => {
    output += data.toString();
  });

  proc.stderr.on("data", (data) => {
    output += data.toString();
  });

  proc.on("close", () => {
    if (!output) output = "✅ Program ran successfully but produced no output.";
    res.json({ output });
  });

  // send stdin if exists
  if (stdin) {
    proc.stdin.write(stdin + "\n");
  }
  proc.stdin.end();
}

app.listen(PORT, () => {
  console.log(`⚡ Code Runner running at http://localhost:${PORT}`);
});
