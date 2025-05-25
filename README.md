import React, { useState } from "react";

const operations = [
  { symbol: "+", label: "Add" },
  { symbol: "-", label: "Subtract" },
  { symbol: "×", label: "Multiply" },
  { symbol: "÷", label: "Divide" },
];

export default function Calculator() {
  const [num1, setNum1] = useState("7");
  const [num2, setNum2] = useState("6");
  const [operation, setOperation] = useState("+");

  function compute(a, b, op) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return "";
    switch (op) {
      case "+": return x + y;
      case "-": return x - y;
      case "×": return x * y;
      case "÷": return y !== 0 ? x / y : "∞";
      default: return "";
    }
  }

  const result = compute(num1, num2, operation);

  return (
    <div style={{
      fontFamily: "sans-serif",
      background: "#fff",
      minHeight: "100vh",
      padding: 0,
      margin: 0,
    }}>
      <div style={{
        background: "linear-gradient(90deg, #2baaff, #1e90ff)",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 28,
        padding: "14px 0 10px 20px",
        display: "flex",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 30, marginRight: 8, fontWeight: "bold" }}>✚</span>
        Basic Calculator
      </div>
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          marginTop: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
          <input
            type="number"
            value={num1}
            onChange={e => setNum1(e.target.value)}
            style={{
              width: 280,
              height: 60,
              fontSize: 38,
              textAlign: "center",
              borderRadius: 10,
              border: "2px solid #222",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <input
            type="number"
            value={num2}
            onChange={e => setNum2(e.target.value)}
            style={{
              width: 280,
              height: 60,
              fontSize: 38,
              textAlign: "center",
              borderRadius: 10,
              border: "2px solid #222",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 28,
            marginTop: 10,
            color: "#222",
            textAlign: "center",
          }}
        >
          Click an operation to calculate
        </div>
        <div style={{ display: "flex", gap: 32, marginBottom: 42 }}>
          {operations.map(op => (
            <button
              key={op.symbol}
              onClick={() => setOperation(op.symbol)}
              style={{
                width: 65,
                height: 65,
                background: "#2baaff",
                color: "#fff",
                fontSize: 36,
                fontWeight: "bold",
                border: "none",
                borderRadius: 10,
                boxShadow:
                  operation === op.symbol
                    ? "0 0 0 4px #1e90ff"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              aria-label={op.label}
            >
              {op.symbol}
            </button>
          ))}
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 400,
            color: "#111",
            marginTop: 12,
          }}
        >
          Result: {result}
        </div>
      </div>
    </div>
  );
}
