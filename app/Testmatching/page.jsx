"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CRITERIA_REGISTRY,
  DEFAULT_WEIGHTS,
  PARENTS,
  SITTERS,
  runTOPSIS,
} from "@/lib/matchingData";

const LS_WEIGHTS_KEY = "lh_learned_weights";
const LS_OUTCOMES_KEY = "lh_training_outcomes";
const MAX_STORED_SAMPLES = 50;

// Saves one accept/reject outcome so LearningDemo can train on it
function persistOutcome(sitter, parent, label) {
  try {
    const existing = JSON.parse(
      localStorage.getItem(LS_OUTCOMES_KEY) || "[]"
    );
    const outcome = {
      id: Date.now(),
      source: "testmatching",
      parentId: parent.id,
      parentName: parent.name,
      sitterId: sitter.id,
      sitterName: sitter.name,
      topsisScore: sitter.score,
      features: CRITERIA_REGISTRY.map((c) => c.getValue(sitter, parent)),
      label,
    };
    localStorage.setItem(
      LS_OUTCOMES_KEY,
      JSON.stringify([...existing, outcome].slice(-MAX_STORED_SAMPLES))
    );
  } catch {}
}

export default function TOPSISDemo() {
  const [selectedParent, setSelectedParent] = useState(null);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [showConfig, setShowConfig] = useState(false);
  const [usingLearnedWeights, setUsingLearnedWeights] = useState(false);

  // Match session state
  const [rankIndex, setRankIndex] = useState(0);
  const [matchPhase, setMatchPhase] = useState("matching"); // 'matching' | 'accepted' | 'exhausted'
  const [rejectedIds, setRejectedIds] = useState(new Set());

  // Load learned weights after hydration + react when LearningDemo applies them
  useEffect(() => {
    function applyWeightsFromStorage() {
      try {
        const saved = localStorage.getItem(LS_WEIGHTS_KEY);
        if (saved) {
          setWeights(JSON.parse(saved));
          setUsingLearnedWeights(true);
        }
      } catch {}
    }

    applyWeightsFromStorage();

    // Fires when LearningDemo (another tab) writes lh_learned_weights
    function onStorageChange(e) {
      if (e.key === LS_WEIGHTS_KEY) {
        if (e.newValue) {
          try {
            setWeights(JSON.parse(e.newValue));
            setUsingLearnedWeights(true);
          } catch {}
        } else {
          // Key was removed (reset)
          setWeights(DEFAULT_WEIGHTS);
          setUsingLearnedWeights(false);
        }
      }
    }

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Reset match session whenever the parent changes
  useEffect(() => {
    setRankIndex(0);
    setMatchPhase("matching");
    setRejectedIds(new Set());
  }, [selectedParent?.id]);

  function resetMatchSession() {
    setRankIndex(0);
    setMatchPhase("matching");
    setRejectedIds(new Set());
  }

  function resetToDefaults() {
    setWeights(DEFAULT_WEIGHTS);
    setUsingLearnedWeights(false);
    try {
      localStorage.removeItem(LS_WEIGHTS_KEY);
    } catch {}
  }

  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);

  const { results, unavailable } = useMemo(() => {
    if (!selectedParent) return { results: null, unavailable: [] };
    return {
      results: runTOPSIS(
        SITTERS.filter((s) => s.available),
        selectedParent,
        weights
      ),
      unavailable: SITTERS.filter((s) => !s.available),
    };
  }, [selectedParent, weights]);

  function handleAccept() {
    if (!results || matchPhase !== "matching") return;
    persistOutcome(results[rankIndex], selectedParent, 1);
    setMatchPhase("accepted");
  }

  function handleReject() {
    if (!results || matchPhase !== "matching") return;
    const current = results[rankIndex];
    persistOutcome(current, selectedParent, 0);
    setRejectedIds((prev) => new Set([...prev, current.id]));
    if (rankIndex + 1 < results.length) {
      setRankIndex((i) => i + 1);
    } else {
      setMatchPhase("exhausted");
    }
  }

  const currentSitter = results?.[rankIndex];

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
            Little Halo · {CRITERIA_REGISTRY.length} active criteria ·{" "}
            <a
              href="/LearningDemo"
              style={{ color: "#1a1a2e", textDecoration: "underline" }}
            >
              🧠 Weight Learning →
            </a>
          </p>
        </div>

        {/* Learned weights banner */}
        {usingLearnedWeights && (
          <div
            style={{
              background: "#f0fdf4",
              border: "2px solid #16a34a",
              borderRadius: 10,
              padding: "0.85rem 1.25rem",
              marginBottom: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                color: "#15803d",
                fontWeight: "bold",
              }}
            >
              🧠 Using learned weights from Logistic Regression training
            </span>
            <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
              <a
                href="/LearningDemo"
                style={{
                  fontSize: "0.75rem",
                  color: "#15803d",
                  textDecoration: "underline",
                }}
              >
                → Training page
              </a>
              <button
                onClick={resetToDefaults}
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  background: "none",
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  padding: "2px 10px",
                  cursor: "pointer",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Reset to defaults
              </button>
            </div>
          </div>
        )}

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
                    fontFamily: "'Georgia', serif",
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
              {usingLearnedWeights && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: "#16a34a",
                    color: "white",
                    padding: "2px 7px",
                    borderRadius: 999,
                    marginLeft: 8,
                    verticalAlign: "middle",
                  }}
                >
                  🧠 learned
                </span>
              )}
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
                {usingLearnedWeights
                  ? "These weights were learned by logistic regression. You can still adjust them manually."
                  : "Drag sliders to adjust. Weights auto-normalise and don't need to sum to 100."}
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
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  onClick={resetToDefaults}
                  style={{
                    padding: "0.4rem 1rem",
                    fontSize: "0.8rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    background: "white",
                    cursor: "pointer",
                    color: "#555",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  Reset to defaults
                </button>
                {(rankIndex > 0 || matchPhase !== "matching") && (
                  <button
                    onClick={resetMatchSession}
                    style={{
                      padding: "0.4rem 1rem",
                      fontSize: "0.8rem",
                      border: "1px solid #1a1a2e",
                      borderRadius: 6,
                      background: "#1a1a2e",
                      cursor: "pointer",
                      color: "white",
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    New search with these weights
                  </button>
                )}
              </div>
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
                flexWrap: "wrap",
                gap: "0.5rem",
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
                  preferred language: {selectedParent.language}
                </span>
                {(rankIndex > 0 || matchPhase !== "matching") && (
                  <button
                    onClick={resetMatchSession}
                    style={{
                      fontSize: "0.75rem",
                      color: "#1a1a2e",
                      background: "none",
                      border: "1px solid #1a1a2e",
                      borderRadius: 4,
                      padding: "2px 10px",
                      cursor: "pointer",
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    ↺ New search
                  </button>
                )}
              </div>
            </div>

            {/* Outcome banners */}
            {matchPhase === "accepted" && currentSitter && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "2px solid #16a34a",
                  borderRadius: 8,
                  padding: "0.85rem 1.1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.88rem", color: "#15803d", fontWeight: "bold" }}>
                  ✓ Match confirmed — <strong>{currentSitter.name}</strong> was accepted
                </span>
                <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                  Outcome saved · LearningDemo will retrain
                </span>
              </div>
            )}
            {matchPhase === "exhausted" && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "2px solid #dc2626",
                  borderRadius: 8,
                  padding: "0.85rem 1.1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.88rem", color: "#b91c1c", fontWeight: "bold" }}>
                  ✗ All {results.length} available sitters were rejected
                </span>
                <button
                  onClick={resetMatchSession}
                  style={{
                    fontSize: "0.75rem",
                    color: "white",
                    background: "#dc2626",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 12px",
                    cursor: "pointer",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  Try new weights
                </button>
              </div>
            )}

            {/* Ranked result cards */}
            {results.map((r, i) => {
              const isRejected = rejectedIds.has(r.id);
              const isCurrent = i === rankIndex && matchPhase === "matching";
              const isAccepted = i === rankIndex && matchPhase === "accepted";
              const isPending = i > rankIndex && matchPhase === "matching";
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
                    borderColor: isAccepted
                      ? "#16a34a"
                      : isCurrent
                        ? "#1a1a2e"
                        : isRejected
                          ? "#fca5a5"
                          : "#e5e7eb",
                    background: isAccepted
                      ? "#f0fdf4"
                      : isCurrent
                        ? "#f8f8ff"
                        : isRejected
                          ? "#fff5f5"
                          : "#fafafa",
                    opacity: isPending ? 0.45 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    {/* Left: rank + info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: isAccepted
                            ? "#16a34a"
                            : isRejected
                              ? "#dc2626"
                              : isCurrent
                                ? "#1a1a2e"
                                : "#9ca3af",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {isAccepted ? "✓" : isRejected ? "✗" : i + 1}
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
                          <span style={{ fontWeight: "bold", color: "#1a1a2e" }}>
                            {r.name}
                          </span>
                          {isCurrent && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                background: "#1a1a2e",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: 999,
                              }}
                            >
                              Presenting now
                            </span>
                          )}
                          {isAccepted && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                background: "#16a34a",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: 999,
                              }}
                            >
                              ✓ Accepted
                            </span>
                          )}
                          {isRejected && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                background: "#fca5a5",
                                color: "#7f1d1d",
                                padding: "2px 8px",
                                borderRadius: 999,
                              }}
                            >
                              ✗ Rejected
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

                    {/* Right: score + accept/reject (only on current) */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "bold",
                          color: scoreColor,
                          lineHeight: 1,
                        }}
                      >
                        {r.score.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#aaa", marginBottom: isCurrent ? "0.5rem" : 0 }}>
                        TOPSIS score
                      </div>

                      {isCurrent && (
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                          <button
                            onClick={handleAccept}
                            style={{
                              padding: "0.4rem 0.85rem",
                              borderRadius: 6,
                              border: "none",
                              background: "#16a34a",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.82rem",
                              cursor: "pointer",
                              fontFamily: "'Georgia', serif",
                            }}
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={handleReject}
                            style={{
                              padding: "0.4rem 0.85rem",
                              borderRadius: 6,
                              border: "none",
                              background: "#dc2626",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.82rem",
                              cursor: "pointer",
                              fontFamily: "'Georgia', serif",
                            }}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score bar */}
                  <div
                    style={{
                      marginTop: "0.65rem",
                      background: "#e5e7eb",
                      borderRadius: 999,
                      height: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${r.score * 100}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: isAccepted
                          ? "#16a34a"
                          : isRejected
                            ? "#fca5a5"
                            : isCurrent
                              ? "#1a1a2e"
                              : "#9ca3af",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>

                  {!isPending && (
                    <div
                      style={{
                        display: "flex",
                        gap: "2rem",
                        marginTop: "0.4rem",
                        fontSize: "0.72rem",
                        color: "#999",
                      }}
                    >
                      <span>S⁺ {r.dPlus}</span>
                      <span>S⁻ {r.dMinus}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Input matrix (collapsed by default) */}
            <details style={{ marginTop: "1rem" }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#1a1a2e",
                  fontSize: "0.9rem",
                }}
              >
                Show input matrix
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
                      <th style={{ padding: "0.4rem 0.75rem", textAlign: "left" }}>
                        Sitter
                      </th>
                      {CRITERIA_REGISTRY.map((c) => (
                        <th
                          key={c.key}
                          style={{ padding: "0.4rem 0.75rem", textAlign: "center" }}
                        >
                          {c.icon} {c.label}
                          <div style={{ fontSize: "0.65rem", color: "#888", fontWeight: "normal" }}>
                            {Math.round((weights[c.key] / totalWeight) * 100)}% · {c.type}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((s) => (
                      <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "0.4rem 0.75rem", fontWeight: "bold", color: "#1a1a2e" }}>
                          {s.name}
                        </td>
                        {s.rawValues.map((v, j) => (
                          <td key={j} style={{ padding: "0.4rem 0.75rem", textAlign: "center" }}>
                            {CRITERIA_REGISTRY[j].key === "language" ? (
                              v === 1 ? (
                                <span style={{ color: "#16a34a", fontWeight: "bold" }}>1 ✓</span>
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
            </details>

            {/* Weighted matrix (collapsed) */}
            <details style={{ marginTop: "0.5rem" }}>
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
                  style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}
                >
                  <thead>
                    <tr style={{ background: "#f0f0f0" }}>
                      <th style={{ padding: "0.4rem 0.75rem", textAlign: "left" }}>Sitter</th>
                      {CRITERIA_REGISTRY.map((c) => (
                        <th key={c.key} style={{ padding: "0.4rem 0.75rem", textAlign: "center" }}>
                          {c.icon} {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const normW = CRITERIA_REGISTRY.map(
                        (c) => (weights[c.key] || 0) / totalWeight
                      );
                      const matrix = results.map((s) =>
                        CRITERIA_REGISTRY.map((c) => c.getValue(s, selectedParent))
                      );
                      const divisors = CRITERIA_REGISTRY.map(
                        (_, col) =>
                          Math.sqrt(matrix.reduce((sum, row) => sum + row[col] ** 2, 0)) || 1
                      );
                      return results.map((r, ri) => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "0.4rem 0.75rem", fontWeight: "bold" }}>
                            {r.name}
                          </td>
                          {CRITERIA_REGISTRY.map((_, ci) => (
                            <td key={ci} style={{ padding: "0.4rem 0.75rem", textAlign: "center" }}>
                              {((matrix[ri][ci] / divisors[ci]) * normW[ci]).toFixed(4)}
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

        {/* Unavailable sitters */}
        {unavailable.length > 0 && selectedParent && (
          <div
            style={{
              background: "white",
              borderRadius: 10,
              padding: "1.25rem 1.5rem",
              marginTop: "1.25rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              opacity: 0.6,
            }}
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#6b7280",
                margin: "0 0 0.75rem",
              }}
            >
              🚫 Not Available
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {unavailable.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    background: "#f9f9f9",
                    fontSize: "0.78rem",
                    color: "#6b7280",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{s.name}</span>
                  <span style={{ marginLeft: 6, opacity: 0.7 }}>
                    ⭐ {s.rating} · ${s.price}/hr
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
