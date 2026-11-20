import React, { useState } from "react";
import "../styles/math.css"

const formulasList = [
  { category: "Geometry", name: "Area of Circle", formula: "A = πr²" },
  { category: "Geometry", name: "Area of Rectangle", formula: "A = l × w" },
  { category: "Geometry", name: "Perimeter of Rectangle", formula: "P = 2(l + w)" },
  { category: "Algebra", name: "Quadratic Formula", formula: "x = [-b ± √(b²-4ac)] / 2a" },
  { category: "Algebra", name: "Simple Interest", formula: "SI = (P×R×T)/100" },
  { category: "Trigonometry", name: "Sine", formula: "sin θ = Opposite / Hypotenuse" },
  { category: "Trigonometry", name: "Cosine", formula: "cos θ = Adjacent / Hypotenuse" },
  { category: "Trigonometry", name: "Tangent", formula: "tan θ = Opposite / Adjacent" },
];

const MathTools = () => {
  const [numTable, setNumTable] = useState("");
  const [numSquare, setNumSquare] = useState("");
  const [numCube, setNumCube] = useState("");
  const [table, setTable] = useState([]);
  const [square, setSquare] = useState(null);
  const [cube, setCube] = useState(null);
  const [search, setSearch] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);

  const generateTable = () => {
    if (!numTable) return alert("Enter a number!");
    setTable(Array.from({ length: 10 }, (_, i) => `${numTable} × ${i + 1} = ${(i + 1) * numTable}`));
  };

  const calculateSquare = () => {
    if (!numSquare) return alert("Enter a number!");
    setSquare(numSquare * numSquare);
  };

  const calculateCube = () => {
    if (!numCube) return alert("Enter a number!");
    setCube(numCube * numCube * numCube);
  };

  const filteredFormulas = formulasList.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const saveNote = (formula) => {
    setSavedNotes(prev => [...prev, formula]);
  };

  return (
    <div className="page math-container">
      <h1 className="title">Math Tools</h1>

      <div className="cards-container">
        {/* Multiplication Table */}
        <div className="math-card">
          <h2>Multiplication Table</h2>
          <input
            type="number"
            value={numTable}
            onChange={(e) => setNumTable(Number(e.target.value))}
            placeholder="Enter number..."
          />
          <button onClick={generateTable}>Generate Table</button>
          {table.length > 0 && (
            <ul>{table.map((val, i) => <li key={i}>{val}</li>)}</ul>
          )}
        </div>

        {/* Square */}
        <div className="math-card">
          <h2>Square</h2>
          <input
            type="number"
            value={numSquare}
            onChange={(e) => setNumSquare(Number(e.target.value))}
            placeholder="Enter number..."
          />
          <button onClick={calculateSquare}>Calculate Square</button>
          {square !== null && <p>{numSquare}² = {square}</p>}
        </div>

        {/* Cube */}
        <div className="math-card">
          <h2>Cube</h2>
          <input
            type="number"
            value={numCube}
            onChange={(e) => setNumCube(Number(e.target.value))}
            placeholder="Enter number..."
          />
          <button onClick={calculateCube}>Calculate Cube</button>
          {cube !== null && <p>{numCube}³ = {cube}</p>}
        </div>
      </div>

      {/* Formula Sheet */}
      <div className="formula-sheet">
        <h2>Formulas Sheet</h2>
        <input
          type="text"
          placeholder="Search formula or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Formula Name</th>
              <th>Formula</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            {filteredFormulas.map((f, i) => (
              <tr key={i}>
                <td>{f.category}</td>
                <td>{f.name}</td>
                <td>{f.formula}</td>
                <td><button onClick={() => saveNote(f)}>Save</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {savedNotes.length > 0 && (
          <div className="saved-notes">
            <h3>Saved Notes</h3>
            <ul>
              {savedNotes.map((n, i) => (
                <li key={i}>{n.category} - {n.name}: {n.formula}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathTools;
