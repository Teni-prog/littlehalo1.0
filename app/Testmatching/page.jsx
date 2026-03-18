"use client";

import { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CRITERIA REGISTRY
// To add a new criterion: add one entry here + add the field to sitter data.
// The TOPSIS algorithm below is fully generic — zero changes needed.
// ─────────────────────────────────────────────────────────────────────────────
const CRITERIA_REGISTRY = [
  {
    key: "language",
    label: "Language Match",
    icon: "🗣️",
    type: "benefit",
    defaultWeight: 35,
    getValue: (sitter, parent) =>
      sitter.languages.includes(parent.language) ? 1 : 0,
  },
  {
    key: "price",
    label: "Price",
    icon: "💰",
    type: "cost",
    defaultWeight: 35,
    getValue: (sitter) => sitter.price,
  },
  {
    key: "rating",
    label: "Rating",
    icon: "⭐",
    type: "benefit",
    defaultWeight: 20,
    getValue: (sitter) => sitter.rating,
  },
  {
    key: "experience",
    label: "Experience",
    icon: "🎓",
    type: "benefit",
    defaultWeight: 10,
    getValue: (sitter) => sitter.experience,
  },

  // {
  //   key: "backgroundCheck",
  //   label: "Background Check",
  //   icon: "✅",
  //   type: "benefit",
  //   defaultWeight: 0,
  //   getValue: (sitter) => sitter.backgroundCheck ? 1 : 0,
  // },
];

// ─────────────────────────────────────────────────────────────────────────────
// TOPSIS — fully generic, reads from CRITERIA_REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
function runTOPSIS(sitters, parent, weights) {
  const total =
    CRITERIA_REGISTRY.reduce((s, c) => s + (weights[c.key] || 0), 0) || 1;
  const normWeights = CRITERIA_REGISTRY.map(
    (c) => (weights[c.key] || 0) / total,
  );
  // by doing this normalization step, we allow users to input weights that don't sum to 100 — the algorithm will auto-normalize them

  // Build raw matrix
  const matrix = sitters.map((s) =>
    CRITERIA_REGISTRY.map((c) => c.getValue(s, parent)),
  );

  // Normalize columns
  const divisors = CRITERIA_REGISTRY.map(
    (_, col) =>
      Math.sqrt(matrix.reduce((sum, row) => sum + row[col] ** 2, 0)) || 1,
  );
  const weighted = matrix.map((row) =>
    row.map((v, col) => (v / divisors[col]) * normWeights[col]),
  );
  // matrix and the aleady weighted values are computed in one step here .

  // Ideal & worst per criterion type
  const ideal = CRITERIA_REGISTRY.map((c, col) => {
    const vals = weighted.map((r) => r[col]);
    return c.type === "benefit" ? Math.max(...vals) : Math.min(...vals);
  });
  const worst = CRITERIA_REGISTRY.map((c, col) => {
    const vals = weighted.map((r) => r[col]);
    return c.type === "benefit" ? Math.min(...vals) : Math.max(...vals);
  });

  // Score each sitter
  return sitters
    .map((sitter, i) => {
      const dPlus = Math.sqrt(
        weighted[i].reduce((s, v, c) => s + (v - ideal[c]) ** 2, 0),
      );
      const dMinus = Math.sqrt(
        weighted[i].reduce((s, v, c) => s + (v - worst[c]) ** 2, 0),
      );
      // "reduce" is used here to loop through each criterion and sum up the squared distances from ideal and worst points
      return {
        ...sitter,
        score: parseFloat((dMinus / (dMinus + dPlus)).toFixed(3)),
        dPlus: parseFloat(dPlus.toFixed(4)),
        dMinus: parseFloat(dMinus.toFixed(4)),
        rawValues: CRITERIA_REGISTRY.map((c) => c.getValue(sitter, parent)),
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PARENTS = [
  {
    id: 1,
    name: "Sarah Johnson",
    language: "French",
    budget: 25,
    city: "Fredericton, NB",
  },
  {
    id: 2,
    name: "Li Wei",
    language: "Mandarin",
    budget: 30,
    city: "Moncton, NB",
  },
  {
    id: 3,
    name: "Maria Gonzalez",
    language: "Spanish",
    budget: 20,
    city: "Halifax, NS",
  },
];

const SITTERS = [
  {
    id: 1,
    name: "Sophie Martin",
    price: 24,
    rating: 4.8,
    experience: 10,
    languages: ["English", "French"],
  },
  {
    id: 2,
    name: "Amara Diallo",
    price: 22,
    rating: 4.6,
    experience: 7,
    languages: ["English", "French"],
  },
  {
    id: 3,
    name: "Rosa Rivera",
    price: 25,
    rating: 4.9,
    experience: 1,
    languages: ["English"],
  },
  {
    id: 4,
    name: "Li Na",
    price: 20,
    rating: 4.7,
    experience: 5,
    languages: ["English", "Mandarin"],
  },
  {
    id: 5,
    name: "James Lee",
    price: 18,
    rating: 4.5,
    experience: 3,
    languages: ["English"],
  },
  {
    id: 6,
    name: "Isabella Torres",
    price: 19,
    rating: 4.6,
    experience: 6,
    languages: ["English", "Spanish"],
  },
  {
    id: 7,
    name: "Olivia Chen",
    price: 23,
    rating: 4.7,
    experience: 8,
    languages: ["English", "Mandarin"],
  },
  {
    id: 8,
    name: "Carlos Ruiz",
    price: 21,
    rating: 4.4,
    experience: 4,
    languages: ["English", "Spanish"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const defaultWeights = Object.fromEntries(
  CRITERIA_REGISTRY.map((c) => [c.key, c.defaultWeight]),
);

export default function TOPSISDemo() {
  const [selectedParent, setSelectedParent] = useState(null);
  const [weights, setWeights] = useState(defaultWeights);
  const [showConfig, setShowConfig] = useState(false);

  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);

  const results = useMemo(() => {
    if (!selectedParent) return null;
    return runTOPSIS(SITTERS, selectedParent, weights);
  }, [selectedParent, weights]);

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: "#f9f7f4",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1a1a2e",
              margin: 0,
            }}
          >
            TOPSIS Matching
          </h1>
          <p
            style={{ color: "#666", fontSize: "0.88rem", marginTop: "0.4rem" }}
          >
            Little Halo · Extensible matching engine —{" "}
            {CRITERIA_REGISTRY.length} active criteria
          </p>
        </div>

        {/* Parent selector */}
        <div
          style={{
            background: "white",
            borderRadius: 10,
            padding: "1.5rem",
            marginBottom: "1.25rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: "bold",
              color: "#1a1a2e",
              marginBottom: "1rem",
            }}
          >
            Select a Parent
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {PARENTS.map((p) => {
              const isActive = selectedParent?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedParent(p)}
                  style={{
                    flex: 1,
                    minWidth: 180,
                    textAlign: "left",
                    padding: "0.9rem 1.1rem",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: isActive ? "#1a1a2e" : "#e5e7eb",
                    background: isActive ? "#1a1a2e" : "#fafafa",
                    color: isActive ? "white" : "#1a1a2e",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "0.93rem" }}>
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      marginTop: "0.25rem",
                      opacity: 0.7,
                    }}
                  >
                    🗣 {p.language} · 💰 ${p.budget}/hr · 📍 {p.city}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weight config */}
        <div
          style={{
            background: "white",
            borderRadius: 10,
            marginBottom: "1.25rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Georgia', serif",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                color: "#1a1a2e",
                fontSize: "1.05rem",
              }}
            >
              ⚙️ Weight Configuration
            </span>
            <span style={{ fontSize: "0.8rem", color: "#888" }}>
              total: {totalWeight}%{" "}
              {totalWeight !== 100 && (
                <span style={{ color: "#ca8a04" }}>⚠ auto-normalised</span>
              )}{" "}
              {showConfig ? "▲" : "▼"}
            </span>
          </button>

          {showConfig && (
            <div
              style={{
                padding: "0 1.5rem 1.5rem",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#888",
                  margin: "0.75rem 0 1rem",
                }}
              >
                Drag sliders to change how much each criterion influences the
                final score. Weights auto-normalise so they don't need to sum to
                100.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem 2rem",
                }}
              >
                {CRITERIA_REGISTRY.map((c) => (
                  <div key={c.key}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <label style={{ fontSize: "0.85rem", color: "#333" }}>
                        {c.icon} {c.label}
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "#aaa",
                            marginLeft: 6,
                          }}
                        >
                          ({c.type})
                        </span>
                      </label>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          color: "#1a1a2e",
                          minWidth: 36,
                          textAlign: "right",
                        }}
                      >
                        {weights[c.key]}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={weights[c.key]}
                      onChange={(e) =>
                        setWeights((prev) => ({
                          ...prev,
                          [c.key]: Number(e.target.value),
                        }))
                      }
                      style={{
                        width: "100%",
                        accentColor: "#1a1a2e",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setWeights(defaultWeights)}
                style={{
                  marginTop: "1rem",
                  padding: "0.4rem 1rem",
                  fontSize: "0.8rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  background: "white",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                Reset to defaults
              </button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {!selectedParent && (
          <div
            style={{
              background: "white",
              border: "2px dashed #e5e7eb",
              borderRadius: 10,
              padding: "3rem",
              textAlign: "center",
              color: "#bbb",
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>👆</div>
            <div style={{ fontSize: "0.9rem" }}>
              Select a parent above to run TOPSIS
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div
            style={{
              background: "white",
              borderRadius: 10,
              padding: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  color: "#1a1a2e",
                  margin: 0,
                }}
              >
                Results — {selectedParent.name}
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
                preferred language: {selectedParent.language}
              </span>
            </div>

            {/* Input matrix */}
            <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.82rem",
                }}
              >
                <thead>
                  <tr style={{ background: "#f0f0f0" }}>
                    <th
                      style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}
                    >
                      Sitter
                    </th>
                    {CRITERIA_REGISTRY.map((c) => (
                      <th
                        key={c.key}
                        style={{
                          padding: "0.5rem 0.75rem",
                          textAlign: "center",
                        }}
                      >
                        {c.icon} {c.label}
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: "#888",
                            fontWeight: "normal",
                          }}
                        >
                          {Math.round((weights[c.key] / totalWeight) * 100)}% ·{" "}
                          {c.type}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((s) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td
                        style={{
                          padding: "0.5rem 0.75rem",
                          fontWeight: "bold",
                          color: "#1a1a2e",
                        }}
                      >
                        {s.name}
                      </td>
                      {s.rawValues.map((v, j) => (
                        <td
                          key={j}
                          style={{
                            padding: "0.5rem 0.75rem",
                            textAlign: "center",
                          }}
                        >
                          {CRITERIA_REGISTRY[j].key === "language" ? (
                            v === 1 ? (
                              <span
                                style={{ color: "#16a34a", fontWeight: "bold" }}
                              >
                                1 ✓
                              </span>
                            ) : (
                              <span style={{ color: "#aaa" }}>0</span>
                            )
                          ) : CRITERIA_REGISTRY[j].key === "price" ? (
                            `$${v}/hr`
                          ) : (
                            v
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ranked results */}
            {results.map((r, i) => {
              const scoreColor =
                r.score >= 0.7
                  ? "#16a34a"
                  : r.score >= 0.5
                    ? "#d97706"
                    : "#dc2626";
              return (
                <div
                  key={r.id}
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: 8,
                    marginBottom: "0.65rem",
                    border: "2px solid",
                    borderColor: i === 0 ? "#16a34a" : "#e5e7eb",
                    background: i === 0 ? "#f0fdf4" : "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: i === 0 ? "#16a34a" : "#6b7280",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{ fontWeight: "bold", color: "#1a1a2e" }}
                          >
                            {r.name}
                          </span>
                          {i === 0 && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                background: "#16a34a",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: 999,
                              }}
                            >
                              Best Match
                            </span>
                          )}
                          {r.languages.includes(selectedParent.language) && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                background: "#dcfce7",
                                color: "#15803d",
                                padding: "2px 8px",
                                borderRadius: 999,
                              }}
                            >
                              🗣 {selectedParent.language} ✓
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            marginTop: "0.3rem",
                            fontSize: "0.76rem",
                            color: "#777",
                          }}
                        >
                          <span>💰 ${r.price}/hr</span>
                          <span>⭐ {r.rating}</span>
                          <span>🎓 {r.experience} yrs</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        flexShrink: 0,
                        marginLeft: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: scoreColor,
                          lineHeight: 1,
                        }}
                      >
                        {r.score.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#aaa" }}>
                        TOPSIS score
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "0.65rem",
                      background: "#e5e7eb",
                      borderRadius: 999,
                      height: 7,
                    }}
                  >
                    <div
                      style={{
                        width: `${r.score * 100}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: i === 0 ? "#16a34a" : "#6b7280",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "2rem",
                      marginTop: "0.5rem",
                      fontSize: "0.78rem",
                      color: "#666",
                    }}
                  >
                    <span>
                      S⁺ (dist from ideal): <strong>{r.dPlus}</strong>
                    </span>
                    <span>
                      S⁻ (dist from worst): <strong>{r.dMinus}</strong>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Expandable weighted matrix */}
            <details style={{ marginTop: "1rem" }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#1a1a2e",
                  fontSize: "0.9rem",
                }}
              >
                Show weighted normalised matrix
              </summary>
              <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.8rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f0f0f0" }}>
                      <th
                        style={{ padding: "0.4rem 0.75rem", textAlign: "left" }}
                      >
                        Sitter
                      </th>
                      {CRITERIA_REGISTRY.map((c) => (
                        <th
                          key={c.key}
                          style={{
                            padding: "0.4rem 0.75rem",
                            textAlign: "center",
                          }}
                        >
                          {c.icon} {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Recompute weighted rows for display
                      const normW = CRITERIA_REGISTRY.map(
                        (c) => (weights[c.key] || 0) / totalWeight,
                      );
                      const matrix = results.map((s) =>
                        CRITERIA_REGISTRY.map((c) =>
                          c.getValue(s, selectedParent),
                        ),
                      );
                      const divisors = CRITERIA_REGISTRY.map(
                        (_, col) =>
                          Math.sqrt(
                            matrix.reduce((sum, row) => sum + row[col] ** 2, 0),
                          ) || 1,
                      );
                      return results.map((r, ri) => (
                        <tr
                          key={r.id}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <td
                            style={{
                              padding: "0.4rem 0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            {r.name}
                          </td>
                          {CRITERIA_REGISTRY.map((_, ci) => (
                            <td
                              key={ci}
                              style={{
                                padding: "0.4rem 0.75rem",
                                textAlign: "center",
                              }}
                            >
                              {(
                                (matrix[ri][ci] / divisors[ci]) *
                                normW[ci]
                              ).toFixed(4)}
                            </td>
                          ))}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}

        {/* Extensibility note */}
        {/* <div
          style={{
            marginTop: "1.25rem",
            padding: "1rem 1.25rem",
            background: "white",
            borderRadius: 10,
            border: "1px dashed #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              color: "#888",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#1a1a2e" }}>
              🏗 Extensible by design.
            </strong>{" "}
            To add a new criterion (e.g. background check, availability,
            certifications), add one entry to <code>CRITERIA_REGISTRY</code> —
            the TOPSIS algorithm is fully generic and requires zero changes.
          </p>
        </div> */}
      </div>
    </div>
  );
}
