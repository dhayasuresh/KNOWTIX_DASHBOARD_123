import React, { useState } from 'react';
import axios from 'axios';
import "../styles/pages.css"

const LETTERS = ['A', 'B', 'C', 'D'];
const subjects = ["Math", "Science", "English", "GK", "CS"];
const difficulties = ["Easy", "Medium", "Hard"];

function stripOptionPrefix(opt = '') {
  return opt.toString().replace(/^[A-Za-z]\)?\.?\s*/, '').trim();
}

function getCorrectIndex(q) {
  if (!q || !Array.isArray(q.options)) return -1;
  const ans = q.answer?.toString().trim();
  if (!ans) return -1;

  const letter = LETTERS.indexOf(ans[0].toUpperCase());
  if (letter >= 0 && letter < q.options.length) return letter;

  // fallback match by text
  const normalized = ans.toLowerCase();
  for (let i = 0; i < q.options.length; i++) {
    if (stripOptionPrefix(q.options[i]).toLowerCase() === normalized) return i;
  }
  return -1;
}

export default function Assessments() {
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const fetchQuestions = async () => {
    if (!subject || !difficulty) return alert("Select subject & difficulty");
    setLoading(true); setError(''); setShowResult(false); setCurrent(0); setSelected([]);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/generate-questions', {
        subject, difficulty, numQuestions: 10
      });

      const qs = Array.isArray(res.data.questions) ? res.data.questions : [];
      if (!qs.length) throw new Error('No questions returned');

      setQuestions(qs.map(q => ({
        question: q.question ?? 'No text',
        options: Array.isArray(q.options) ? q.options.map(o => o.toString()) : [],
        answer: q.answer ?? '',
        explanation: q.explanation ?? ''
      })));

    } catch (err) {
      console.error(err);
      setError('Failed to fetch questions');
    } finally { setLoading(false); }
  };

  const handleSelect = idx => {
    if (selected[current] !== undefined) return;
    const copy = [...selected];
    copy[current] = idx;
    setSelected(copy);
  };

  const handleNext = () => current < questions.length - 1 ? setCurrent(current + 1) : setShowResult(true);
  const handlePrev = () => current > 0 && setCurrent(current - 1);

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selected[i] === getCorrectIndex(q)) correct++;
    });
    const total = questions.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;
    let performance = 'Needs Improvement';
    if (percent >= 80) performance = 'Excellent';
    else if (percent >= 50) performance = 'Good';
    return { correct, total, percent, performance };
  };

  const { correct, total, percent, performance } = calculateScore();
  const displayOption = (opt, i) => `${LETTERS[i]}. ${stripOptionPrefix(opt)}`;

  return (
    <div className="page">
       <h1 className="title"> Assessments </h1>

      <div className="filters">
        <select value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="">Select Difficulty</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={fetchQuestions} disabled={loading}>
          {loading ? 'Loading...' : 'Generate Questions'}
        </button>
      </div>

      {error && <p className="error-box">{error}</p>}

      {!showResult && questions.length > 0 && (
        <div className="question-card">
         <div className="progress-container">
  <div
    className="progress-fill"
    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
  ></div>
  <span className="progress-text">
    Question {current + 1} / {questions.length}
  </span>
</div>


          <p className="question-text"><b>Q{current + 1}:</b> {questions[current].question}</p>

          <ul className="options-list">
            {questions[current].options.map((opt, i) => {
              const correctIdx = getCorrectIndex(questions[current]);
              const selectedIdx = selected[current];
              let bgColor = '';
              if (selectedIdx !== undefined) {
                if (i === correctIdx) bgColor = '#c8f7c5';
                else if (i === selectedIdx && i !== correctIdx) bgColor = '#f7c5c5';
              }
              return (
                <li key={i}>
                  <button
                    className={selectedIdx === i ? 'selected' : ''}
                    disabled={selectedIdx !== undefined}
                    onClick={() => handleSelect(i)}
                    style={{ backgroundColor: bgColor }}
                  >
                    <strong style={{width:30}}>{LETTERS[i]}</strong> {stripOptionPrefix(opt)}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="navigation">
            <button onClick={handlePrev} disabled={current === 0}>Previous</button>
            <button onClick={handleNext} disabled={selected[current] === undefined}>
              {current === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {showResult && (
        <div className="result-card">
          <h2>Quiz Completed!</h2>
          <p>Score: <b>{correct} / {total} ({percent}%)</b></p>
          <p>Performance: <b>{performance}</b></p>

          <h3>Review Answers</h3>
          {questions.map((q, idx) => {
            const correctIdx = getCorrectIndex(q);
            const userIdx = selected[idx] ?? -1;
            return (
              <div key={idx} className={`review-question ${userIdx === correctIdx ? 'correct' : 'incorrect'}`}>
                <p><b>Q{idx + 1}:</b> {q.question}</p>
                <p>Your Answer: <b>{userIdx >= 0 ? displayOption(q.options[userIdx], userIdx) : 'Not Answered'}</b></p>
                <p>Correct Answer: <b>{displayOption(q.options[correctIdx], correctIdx)}</b></p>
                {q.explanation && <p className="explanation">Explanation: {q.explanation}</p>}
                <hr />
              </div>
            );
          })}

          <button onClick={() => {
            setShowResult(false); setQuestions([]); setSelected([]); setCurrent(0); setError('');
          }}>Retake Quiz</button>
        </div>
      )}
    </div>
  );
}
