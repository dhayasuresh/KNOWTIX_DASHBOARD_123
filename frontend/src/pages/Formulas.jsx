import React, { useRef, useState } from "react";
import "../styles/formulas.css"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 50 formulas across 3 subjects
const formulasData = {
  Math: [
  { name: "Area of Circle", formula: "A = πr²", explanation: "Calculates the area of a circle using its radius.", derivation: "From integral of circumference", expansion: "Used in geometry and engineering" },
  { name: "Perimeter of Rectangle", formula: "P = 2(l + w)", explanation: "Adds all sides of rectangle.", derivation: "Sum of all sides", expansion: "Used in architecture and layouts" },
  { name: "Pythagoras Theorem", formula: "a² + b² = c²", explanation: "Relation between sides of right triangle.", derivation: "Geometric proof", expansion: "Distance calculation" },
  { name: "Quadratic Formula", formula: "x = [-b ± √(b²-4ac)] / 2a", explanation: "Solves quadratic equations.", derivation: "Completing the square", expansion: "Used in algebra" },
  { name: "Sum of AP", formula: "S_n = n/2(2a + (n-1)d)", explanation: "Sum of first n terms of arithmetic progression.", derivation: "Using pairwise addition", expansion: "N/A" },
  { name: "Sum of GP", formula: "S_n = a(1-r^n)/(1-r)", explanation: "Sum of first n terms of geometric progression.", derivation: "Using series expansion", expansion: "N/A" },
  { name: "Area of Triangle", formula: "A = 1/2 × b × h", explanation: "Area using base and height.", derivation: "1/2 × base × height", expansion: "Geometry" },
  { name: "Circumference of Circle", formula: "C = 2πr", explanation: "Distance around circle.", derivation: "Derivative of area formula", expansion: "Used in circular measurements" },
  { name: "Slope of Line", formula: "m = (y2-y1)/(x2-x1)", explanation: "Measures steepness of line.", derivation: "Rise over run", expansion: "Coordinate geometry" },
  { name: "Distance Formula", formula: "d = √[(x2-x1)² + (y2-y1)²]", explanation: "Distance between two points.", derivation: "Pythagoras Theorem", expansion: "Used in plane geometry" },
  { name: "Midpoint Formula", formula: "M = ((x1+x2)/2, (y1+y2)/2)", explanation: "Finds center point between two points.", derivation: "Average of coordinates", expansion: "Used in coordinate geometry" },
  { name: "Factorial", formula: "n! = n × (n-1) × ... ×1", explanation: "Product of first n natural numbers.", derivation: "Definition", expansion: "Used in combinatorics" },
  { name: "Binomial Theorem", formula: "(a+b)^n = Σ C(n,k)a^(n-k)b^k", explanation: "Expands powers of sum.", derivation: "Combinatorial", expansion: "Algebra" },
  { name: "Logarithm", formula: "log_a(xy) = log_a x + log_a y", explanation: "Property of logarithms.", derivation: "Log rules", expansion: "Algebra" },
  { name: "Area of Square", formula: "A = a²", explanation: "Square of side gives area.", derivation: "Definition", expansion: "Geometry" },
  { name: "Volume of Cube", formula: "V = a³", explanation: "Cube of side gives volume.", derivation: "Definition", expansion: "3D Geometry" },
  { name: "Surface Area of Sphere", formula: "A = 4πr²", explanation: "Area of sphere surface.", derivation: "Integral of radius", expansion: "Used in physics and geometry" },
  { name: "Volume of Sphere", formula: "V = 4/3 πr³", explanation: "Volume enclosed by sphere.", derivation: "Integral of circular cross-section", expansion: "Physics applications" },
  { name: "Simple Interest", formula: "SI = (P×R×T)/100", explanation: "Calculates interest on principal.", derivation: "Definition", expansion: "Finance" },
  { name: "Compound Interest", formula: "A = P(1+R/100)^T", explanation: "Interest compounded annually.", derivation: "Geometric progression", expansion: "Finance" },
],
  Physics: [
  { name: "Newton's 2nd Law", formula: "F = ma", explanation: "Force equals mass times acceleration.", derivation: "Definition of force", expansion: "Motion equations" },
  { name: "Gravitational Force", formula: "F = Gm₁m₂/r²", explanation: "Attraction between two masses.", derivation: "Universal law", expansion: "Orbital mechanics" },
  { name: "Kinetic Energy", formula: "KE = 1/2 mv²", explanation: "Energy of moving object.", derivation: "From work done", expansion: "Dynamics" },
  { name: "Potential Energy", formula: "PE = mgh", explanation: "Energy due to height.", derivation: "Work against gravity", expansion: "Mechanical energy" },
  { name: "Ohm's Law", formula: "V = IR", explanation: "Voltage across resistor proportional to current.", derivation: "Experimental", expansion: "Electric circuits" },
  { name: "Work", formula: "W = F × d × cosθ", explanation: "Work done by force along displacement.", derivation: "Dot product", expansion: "Mechanics" },
  { name: "Power", formula: "P = W/t", explanation: "Rate of doing work.", derivation: "Definition", expansion: "Energy transfer" },
  { name: "Momentum", formula: "p = mv", explanation: "Product of mass and velocity.", derivation: "Definition", expansion: "Collisions" },
  { name: "Impulse", formula: "J = F × Δt", explanation: "Change in momentum.", derivation: "From Newton's 2nd Law", expansion: "Mechanics" },
  { name: "Density", formula: "ρ = m/V", explanation: "Mass per unit volume.", derivation: "Definition", expansion: "Material properties" },
  { name: "Pressure", formula: "P = F/A", explanation: "Force per unit area.", derivation: "Definition", expansion: "Fluid mechanics" },
  { name: "Hooke's Law", formula: "F = kx", explanation: "Force to stretch spring.", derivation: "Experimental", expansion: "Elasticity" },
  { name: "Wave Speed", formula: "v = fλ", explanation: "Velocity of wave.", derivation: "Frequency × wavelength", expansion: "Waves" },
  { name: "Snell's Law", formula: "n₁sinθ₁ = n₂sinθ₂", explanation: "Refraction at interface.", derivation: "From geometry of wavefront", expansion: "Optics" },
  { name: "Capacitance", formula: "C = Q/V", explanation: "Charge stored per volt.", derivation: "Definition", expansion: "Electronics" },
],
 Chemistry: [
  { name: "Ideal Gas Law", formula: "PV = nRT", explanation: "Relates P, V, T of gas.", derivation: "Combination of Boyle & Charles Law", expansion: "Thermodynamics" },
  { name: "Molarity", formula: "M = moles/L", explanation: "Concentration of solution.", derivation: "Definition", expansion: "Reactions" },
  { name: "Density", formula: "ρ = m/V", explanation: "Mass per unit volume.", derivation: "Definition", expansion: "Materials" },
  { name: "Rate of Reaction", formula: "Rate = Δ[product]/Δt", explanation: "Speed of chemical reaction.", derivation: "Experimental", expansion: "Kinetics" },
  { name: "pH", formula: "pH = -log[H⁺]", explanation: "Measure acidity.", derivation: "From H⁺ concentration", expansion: "Solutions" },
  { name: "Dilution", formula: "C1V1 = C2V2", explanation: "Concentration-volume relation.", derivation: "Definition", expansion: "Lab calculations" },
  { name: "Mole Concept", formula: "n = m/M", explanation: "Moles = mass / molar mass.", derivation: "Definition", expansion: "Stoichiometry" },
  { name: "Avogadro's Number", formula: "N = 6.022×10²³", explanation: "Particles per mole.", derivation: "Definition", expansion: "Chemical calculations" },
  { name: "Empirical Formula", formula: "Simplest ratio of elements", explanation: "Determines ratio of atoms.", derivation: "Experimental", expansion: "Stoichiometry" },
  { name: "Equilibrium Constant", formula: "Kc = [products]/[reactants]", explanation: "Ratio of concentrations.", derivation: "From law of mass action", expansion: "Chemical equilibrium" },
  { name: "Gibbs Free Energy", formula: "ΔG = ΔH - TΔS", explanation: "Spontaneity of reaction.", derivation: "Thermodynamics", expansion: "Chemistry" },
  { name: "Boiling Point Elevation", formula: "ΔTb = Kb × m", explanation: "Increase in boiling point.", derivation: "Colligative properties", expansion: "Solutions" },
  { name: "Freezing Point Depression", formula: "ΔTf = Kf × m", explanation: "Decrease in freezing point.", derivation: "Colligative properties", expansion: "Solutions" },
  { name: "Electrolysis", formula: "m = Q/F × M", explanation: "Mass of substance deposited.", derivation: "Faraday’s Law", expansion: "Electrochemistry" },
  { name: "Energy of Photon", formula: "E = hν", explanation: "Energy of light quantum.", derivation: "Planck's relation", expansion: "Photoelectric effect" },
],
};
const Formulas = () => {
  const formulasRef = useRef();
  const [subject, setSubject] = useState("Math");

  const downloadPDF = () => {
    html2canvas(formulasRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${subject}_Formulas.pdf`);
    });
  };

  const printSheet = () => {
    const newWin = window.open("", "_blank");
    newWin.document.write(`<html><head><title>${subject} Formulas</title>`);
    newWin.document.write('<link rel="stylesheet" href="Formulas.css" />');
    newWin.document.write("</head><body>");
    newWin.document.write(`<h1 class="subject-title">${subject}</h1>`);
    newWin.document.write(formulasRef.current.innerHTML);
    newWin.document.write("</body></html>");
    newWin.document.close();
    newWin.print();
  };

  return (
    <div className="page">
      <h1 className="subject-title">{subject}</h1>

      <div className="subject-buttons">
        {Object.keys(formulasData).map((sub) => (
          <button
            key={sub}
            className={`subject-btn ${subject === sub ? "active" : ""}`}
            onClick={() => setSubject(sub)}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="action-buttons">
        <button onClick={downloadPDF}>Download PDF</button>
        <button onClick={printSheet}>Print</button>
      </div>

      <div ref={formulasRef} className="formula-grid">
        {formulasData[subject].map((f, i) => (
          <div key={i} className="formula-card">
            <div className="card-header">{f.name}</div>
            <div className="card-body">
              <p><strong>Formula:</strong> {f.formula}</p>
              <p><strong>Explanation:</strong> {f.explanation}</p>
              {f.derivation && <p><strong>Derivation:</strong> {f.derivation}</p>}
              {f.expansion && <p><strong>Expansion:</strong> {f.expansion}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formulas;
