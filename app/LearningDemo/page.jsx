"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  CRITERIA_REGISTRY,
  DEFAULT_WEIGHTS,
  PARENTS,
  SITTERS,
  runTOPSIS,
} from "@/lib/matchingData";

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTIC REGRESSION ENGINE
// Weights = absolute magnitudes of LR coefficients, normalised to 100%.
// TOPSIS already handles cost/benefit direction via criterion.type.
// ─────────────────────────────────────────────────────────────────────────────

function sigmoid(z) {
  return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
}

function trainLR(trainingData, epochs = 800, learningRate = 0.05) {
  const featureMatrix = trainingData.map((d) => d.features);
  const labels = trainingData.map((d) => d.label);
  const n = featureMatrix.length; // how many training samples
  const p = featureMatrix[0].length; // how many criteria per sample

  const means = Array.from(
    { length: p },
    (_, j) => featureMatrix.reduce((s, f) => s + f[j], 0) / n,
  );
  const stds = Array.from({ length: p }, (_, j) => {
    const variance =
      featureMatrix.reduce((s, f) => s + (f[j] - means[j]) ** 2, 0) / n;
    return Math.sqrt(variance) || 1;
  });
  const X = featureMatrix.map((f) => f.map((v, j) => (v - means[j]) / stds[j]));

  let w = Array(p).fill(0);
  let bias = 0; //weights and bias set to zero

  for (let epoch = 0; epoch < epochs; epoch++) {
    let dw = Array(p).fill(0);
    let db = 0;

    for (let i = 0; i < n; i++) {
      const z = X[i].reduce((s, x, j) => s + x * w[j], bias);
      const pred = sigmoid(z);
      const err = pred - labels[i];
      dw = dw.map((g, j) => g + err * X[i][j]);
      db += err;
    }

    w = w.map((wj, j) => wj - (learningRate * dw[j]) / n);
    bias -= (learningRate * db) / n;
  }

  return { coefficients: w, bias };
}

function coefficientsToWeights(coefficients) {
  const magnitudes = coefficients.map(Math.abs);
  const total = magnitudes.reduce((s, v) => s + v, 0) || 1;
  return Object.fromEntries(
    CRITERIA_REGISTRY.map((c, i) => [
      c.key,
      Math.max(1, Math.round((magnitudes[i] / total) * 100)),
    ]),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const LS_OUTCOMES_KEY = "lh_training_outcomes";
const LS_WEIGHTS_KEY = "lh_learned_weights";
const MIN_SAMPLES = 3;
const MAX_STORED_SAMPLES = 50;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LearningDemo() {
  const [trainingData, setTrainingData] = useState([]);
  const [lrResult, setLrResult] = useState(null);

  const [simParent, setSimParent] = useState(null);
  const [simLastAction, setSimLastAction] = useState(null);

  const simWeights = lrResult?.learnedWeights ?? DEFAULT_WEIGHTS;

  // ── helpers ───────────────────────────────────────────────────────────────

  function attemptTrain(data) {
    const hasAccepts = data.some((d) => d.label === 1);
    const hasRejects = data.some((d) => d.label === 0);
    if (data.length < MIN_SAMPLES || !hasAccepts || !hasRejects) return null;
    const result = trainLR(data);
    return {
      ...result,
      learnedWeights: coefficientsToWeights(result.coefficients),
    };
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(LS_OUTCOMES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function syncData(data) {
    setTrainingData(data);
    const result = attemptTrain(data);
    if (result) {
      setLrResult(result);
    } else {
      setLrResult(null);
    }
  }

  // ── init + cross-tab sync ─────────────────────────────────────────────────

  useEffect(() => {
    syncData(loadFromStorage());

    function onStorageChange(e) {
      if (e.key === LS_OUTCOMES_KEY) {
        syncData(e.newValue ? JSON.parse(e.newValue) : []);
      }
    }
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // ── simulation top match ──────────────────────────────────────────────────

  const simTopMatch = useMemo(() => {
    if (!simParent) return null;
    const ranked = runTOPSIS(
      SITTERS.filter((s) => s.available),
      simParent,
      simWeights,
    );
    return ranked[0] ?? null;
  }, [simParent, simWeights]);

  // ── simulation feedback ───────────────────────────────────────────────────

  function handleSimFeedback(accepted) {
    if (!simParent || !simTopMatch) return;
    const features = CRITERIA_REGISTRY.map((c) =>
      c.getValue(simTopMatch, simParent),
    );
    const outcome = {
      id: Date.now(),
      source: "simulation",
      parentId: simParent.id,
      parentName: simParent.name,
      sitterId: simTopMatch.id,
      sitterName: simTopMatch.name,
      topsisScore: simTopMatch.score,
      features,
      label: accepted ? 1 : 0,
    };
    setSimLastAction({ sitterName: simTopMatch.name, accepted });

    const existing = loadFromStorage();
    const updated = [...existing, outcome].slice(-MAX_STORED_SAMPLES);
    try {
      localStorage.setItem(LS_OUTCOMES_KEY, JSON.stringify(updated));
    } catch {}
    syncData(updated);
  }

  // ── apply learned weights to TOPSIS page ─────────────────────────────────

  function applyLearnedWeights() {
    const weights = lrResult?.learnedWeights;
    if (!weights) return;
    try {
      localStorage.setItem(LS_WEIGHTS_KEY, JSON.stringify(weights));
    } catch {}
  }

  // ── reset ─────────────────────────────────────────────────────────────────

  function handleReset() {
    try {
      localStorage.removeItem(LS_OUTCOMES_KEY);
      localStorage.removeItem(LS_WEIGHTS_KEY);
    } catch {}
    setTrainingData([]);
    setLrResult(null);
    setSimLastAction(null);
  }

  // ── derived counts ────────────────────────────────────────────────────────

  const fromTestMatching = trainingData.filter(
    (d) => d.source === "testmatching",
  );
  const fromSimulation = trainingData.filter((d) => d.source === "simulation");
  const accepts = trainingData.filter((d) => d.label === 1).length;
  const rejects = trainingData.filter((d) => d.label === 0).length;
  const hasMixedLabels = accepts > 0 && rejects > 0;
  const canTrain = trainingData.length >= MIN_SAMPLES && hasMixedLabels;

  const trainingStatusMsg = !canTrain
    ? trainingData.length < MIN_SAMPLES
      ? `Need ${MIN_SAMPLES - trainingData.length} more sample${MIN_SAMPLES - trainingData.length !== 1 ? "s" : ""}`
      : "Need at least one accept AND one reject to train"
    : null;


  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: "#f9f7f4",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1a1a2e",
              margin: 0,
            }}
          >
            🧠 LR Weight Learning
          </h1>
          <p
            style={{ color: "#666", fontSize: "0.88rem", marginTop: "0.4rem" }}
          >
            Logistic Regression learns optimal TOPSIS weights from match
            outcomes ·{" "}
            <a
              href="/Testmatching"
              style={{ color: "#1a1a2e", textDecoration: "underline" }}
            >
              ← TOPSIS Matching
            </a>
          </p>
        </div>

        {/* Flow steps */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            marginBottom: "1.75rem",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            "Accept/Reject in TOPSIS page",
            "Outcomes saved here",
            "LR trains on outcomes",
            "Learned weights →",
            "Update TOPSIS defaults",
          ].map((step, i, arr) => (
            <span
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span
                style={{
                  background: "#1a1a2e",
                  color: "white",
                  padding: "0.28rem 0.75rem",
                  borderRadius: 999,
                  fontSize: "0.73rem",
                  whiteSpace: "nowrap",
                }}
              >
                {step}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: "#bbb", fontSize: "0.8rem" }}>→</span>
              )}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
          }}
        >
          {/* ── LEFT: Simulation panel ─────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Simulation intro */}
            <div
              style={{
                background: "white",
                borderRadius: 10,
                padding: "1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              <h2
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  color: "#1a1a2e",
                  margin: "0 0 0.4rem",
                }}
              >
                Simulation Panel
              </h2>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#888",
                  margin: "0 0 0.85rem",
                  lineHeight: 1.55,
                }}
              >
                Use this to quickly generate training data without switching to
                the TOPSIS page. Outcomes from both pages feed into the same LR
                model. The simulation also uses the current learned weights once
                trained.
              </p>

              {/* Parent selector */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                }}
              >
                {PARENTS.map((p) => {
                  const isActive = simParent?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSimParent(p)}
                      style={{
                        textAlign: "left",
                        padding: "0.6rem 0.9rem",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: "2px solid",
                        borderColor: isActive ? "#1a1a2e" : "#e5e7eb",
                        background: isActive ? "#1a1a2e" : "#fafafa",
                        color: isActive ? "white" : "#1a1a2e",
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      <strong style={{ fontSize: "0.88rem" }}>{p.name}</strong>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          opacity: 0.7,
                          marginLeft: 8,
                        }}
                      >
                        🗣 {p.language} · 💰 ${p.budget}/hr
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top match + feedback */}
            <div
              style={{
                background: "white",
                borderRadius: 10,
                padding: "1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              <h2
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  color: "#1a1a2e",
                  margin: "0 0 0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Top Match
                <span
                  style={{
                    fontSize: "0.68rem",
                    background: lrResult ? "#1a1a2e" : "#6b7280",
                    color: "white",
                    padding: "2px 7px",
                    borderRadius: 999,
                    fontWeight: "normal",
                  }}
                >
                  {lrResult ? "🧠 learned weights" : "⚙️ default weights"}
                </span>
              </h2>

              {!simParent ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#bbb",
                    padding: "1.25rem 0",
                    fontSize: "0.82rem",
                  }}
                >
                  Select a parent above
                </div>
              ) : (
                <>
                  <div
                    style={{
                      border: "2px solid #16a34a",
                      borderRadius: 8,
                      padding: "0.85rem 1rem",
                      background: "#f0fdf4",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#1a1a2e",
                        fontSize: "0.95rem",
                      }}
                    >
                      {simTopMatch?.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "#555",
                        marginTop: "0.3rem",
                        display: "flex",
                        gap: "0.85rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>💰 ${simTopMatch?.price}/hr</span>
                      <span>⭐ {simTopMatch?.rating}</span>
                      <span>🎓 {simTopMatch?.experience} yrs</span>
                      {simTopMatch?.languages.includes(simParent.language) && (
                        <span style={{ color: "#16a34a" }}>
                          🗣 {simParent.language} ✓
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#888",
                        marginTop: "0.3rem",
                      }}
                    >
                      TOPSIS score:{" "}
                      <strong style={{ color: "#1a1a2e" }}>
                        {simTopMatch?.score}
                      </strong>
                    </div>
                  </div>

                  {simLastAction && (
                    <div
                      style={{
                        fontSize: "0.73rem",
                        color: simLastAction.accepted ? "#16a34a" : "#dc2626",
                        marginBottom: "0.6rem",
                        padding: "0.3rem 0.7rem",
                        background: simLastAction.accepted
                          ? "#f0fdf4"
                          : "#fef2f2",
                        borderRadius: 6,
                      }}
                    >
                      {simLastAction.accepted ? "✓ Accepted" : "✗ Rejected"}{" "}
                      <strong>{simLastAction.sitterName}</strong>
                      {lrResult
                        ? " — weights updated"
                        : " — collecting more data…"}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.65rem" }}>
                    <button
                      onClick={() => handleSimFeedback(true)}
                      style={{
                        flex: 1,
                        padding: "0.65rem",
                        borderRadius: 8,
                        border: "none",
                        background: "#16a34a",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleSimFeedback(false)}
                      style={{
                        flex: 1,
                        padding: "0.65rem",
                        borderRadius: 8,
                        border: "none",
                        background: "#dc2626",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Training status */}
            <div
              style={{
                background: "white",
                borderRadius: 10,
                padding: "1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.65rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    color: "#1a1a2e",
                    margin: 0,
                  }}
                >
                  Training Data
                </h2>
                {trainingData.length > 0 && (
                  <button
                    onClick={handleReset}
                    style={{
                      fontSize: "0.72rem",
                      color: "#dc2626",
                      background: "none",
                      border: "1px solid #fca5a5",
                      borderRadius: 4,
                      padding: "2px 8px",
                      cursor: "pointer",
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div style={{ fontSize: "0.82rem" }}>
                {[
                  ["Total samples", trainingData.length, "#1a1a2e"],
                  ["From TOPSIS page", fromTestMatching.length, "#6366f1"],
                  ["From simulation", fromSimulation.length, "#0891b2"],
                  ["Accepted", accepts, "#16a34a"],
                  ["Rejected", rejects, "#dc2626"],
                ].map(([label, val, color]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.28rem 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span style={{ color: "#555" }}>{label}</span>
                    <strong style={{ color }}>{val}</strong>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.28rem 0",
                  }}
                >
                  <span style={{ color: "#555" }}>LR status</span>
                  <strong style={{ color: canTrain ? "#16a34a" : "#ca8a04" }}>
                    {canTrain ? "✓ trained" : "pending"}
                  </strong>
                </div>
              </div>

              {trainingStatusMsg && (
                <p
                  style={{
                    fontSize: "0.73rem",
                    color: "#ca8a04",
                    margin: "0.5rem 0 0",
                    background: "#fefce8",
                    padding: "0.35rem 0.6rem",
                    borderRadius: 6,
                  }}
                >
                  ⚠ {trainingStatusMsg}
                </p>
              )}

              <p
                style={{
                  fontSize: "0.7rem",
                  color: "#aaa",
                  margin: "0.6rem 0 0",
                  lineHeight: 1.5,
                }}
              >
                This page auto-syncs when you accept/reject on the TOPSIS
                Matching page (even in another tab).
              </p>
            </div>
          </div>

          {/* ── RIGHT: LR output ──────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Learned weights + bars */}
            <div
              style={{
                background: "white",
                borderRadius: 10,
                padding: "1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              <h2
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  color: "#1a1a2e",
                  margin: "0 0 0.85rem",
                }}
              >
                Learned Weights
              </h2>

              {!lrResult ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#bbb",
                    padding: "1.5rem 0",
                    fontSize: "0.82rem",
                  }}
                >
                  Accept/Reject in the TOPSIS page or the simulation above to
                  start training ({MIN_SAMPLES}+ mixed samples needed)
                </div>
              ) : (
                <>
                  {CRITERIA_REGISTRY.map((c) => {
                    const def = DEFAULT_WEIGHTS[c.key];
                    const learned = lrResult.learnedWeights[c.key];
                    const delta = learned - def;
                    const maxBar = 60;

                    return (
                      <div key={c.key} style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: "0.22rem",
                          }}
                        >
                          <span style={{ fontSize: "0.82rem", color: "#333" }}>
                            {c.icon} {c.label}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              color:
                                delta > 0
                                  ? "#16a34a"
                                  : delta < 0
                                    ? "#dc2626"
                                    : "#6b7280",
                            }}
                          >
                            {learned}%
                            {delta !== 0 && (
                              <span
                                style={{
                                  fontSize: "0.67rem",
                                  marginLeft: 4,
                                  opacity: 0.75,
                                }}
                              >
                                ({delta > 0 ? "+" : ""}
                                {delta})
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Default bar */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.12rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.62rem",
                              color: "#bbb",
                              width: 44,
                              textAlign: "right",
                              flexShrink: 0,
                            }}
                          >
                            default
                          </span>
                          <div
                            style={{
                              flex: 1,
                              background: "#f0f0f0",
                              borderRadius: 999,
                              height: 7,
                            }}
                          >
                            <div
                              style={{
                                width: `${(def / maxBar) * 100}%`,
                                height: "100%",
                                borderRadius: 999,
                                background: "#9ca3af",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "0.62rem",
                              color: "#9ca3af",
                              width: 28,
                              flexShrink: 0,
                            }}
                          >
                            {def}%
                          </span>
                        </div>

                        {/* Learned bar */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.62rem",
                              color: "#bbb",
                              width: 44,
                              textAlign: "right",
                              flexShrink: 0,
                            }}
                          >
                            learned
                          </span>
                          <div
                            style={{
                              flex: 1,
                              background: "#f0f0f0",
                              borderRadius: 999,
                              height: 7,
                            }}
                          >
                            <div
                              style={{
                                width: `${(learned / maxBar) * 100}%`,
                                height: "100%",
                                borderRadius: 999,
                                background: "#1a1a2e",
                                transition: "width 0.45s ease",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "0.62rem",
                              color: "#1a1a2e",
                              fontWeight: "bold",
                              width: 28,
                              flexShrink: 0,
                            }}
                          >
                            {learned}%
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <p
                    style={{
                      fontSize: "0.68rem",
                      color: "#aaa",
                      margin: "0.25rem 0 0.85rem",
                    }}
                  >
                    {trainingData.length} samples · 800 epochs
                  </p>

                  <button
                    onClick={applyLearnedWeights}
                    style={{
                      width: "100%",
                      padding: "0.65rem",
                      borderRadius: 8,
                      border: "none",
                      background: "#1a1a2e",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      fontFamily: "'Georgia', serif",
                    }}
                  >
                    Apply learned weights to TOPSIS page
                  </button>
                </>
              )}
            </div>

            {/* Training log */}
            <div
              style={{
                background: "white",
                borderRadius: 10,
                padding: "1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              <h2
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  color: "#1a1a2e",
                  margin: "0 0 0.75rem",
                }}
              >
                Training Log{" "}
                <span
                  style={{
                    fontSize: "0.73rem",
                    color: "#aaa",
                    fontWeight: "normal",
                  }}
                >
                  ({trainingData.length})
                </span>
              </h2>

              {trainingData.length === 0 ? (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#bbb",
                    textAlign: "center",
                    margin: "1rem 0",
                  }}
                >
                  No outcomes yet. Accept/reject sitters in the TOPSIS page or
                  the simulation above.
                </p>
              ) : (
                <div style={{ maxHeight: 260, overflowY: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.74rem",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f0f0f0" }}>
                        {["#", "Source", "Parent", "Sitter", "Score", ""].map(
                          (h) => (
                            <th
                              key={h}
                              style={{
                                padding: "0.3rem 0.5rem",
                                textAlign:
                                  h === "" || h === "Score" ? "center" : "left",
                                color: "#555",
                                fontWeight: "bold",
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {[...trainingData].reverse().map((d, idx) => (
                        <tr
                          key={d.id}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <td
                            style={{ padding: "0.3rem 0.5rem", color: "#aaa" }}
                          >
                            {trainingData.length - idx}
                          </td>
                          <td style={{ padding: "0.3rem 0.5rem" }}>
                            <span
                              style={{
                                fontSize: "0.65rem",
                                padding: "1px 5px",
                                borderRadius: 999,
                                background:
                                  d.source === "testmatching"
                                    ? "#ede9fe"
                                    : "#e0f2fe",
                                color:
                                  d.source === "testmatching"
                                    ? "#5b21b6"
                                    : "#0369a1",
                              }}
                            >
                              {d.source === "testmatching" ? "TOPSIS" : "sim"}
                            </span>
                          </td>
                          <td style={{ padding: "0.3rem 0.5rem" }}>
                            {d.parentName.split(" ")[0]}
                          </td>
                          <td
                            style={{
                              padding: "0.3rem 0.5rem",
                              fontWeight: "bold",
                            }}
                          >
                            {d.sitterName.split(" ")[0]}
                          </td>
                          <td
                            style={{
                              padding: "0.3rem 0.5rem",
                              textAlign: "center",
                              color: "#888",
                            }}
                          >
                            {d.topsisScore}
                          </td>
                          <td
                            style={{
                              padding: "0.3rem 0.5rem",
                              textAlign: "center",
                            }}
                          >
                            {d.label === 1 ? (
                              <span
                                style={{ color: "#16a34a", fontWeight: "bold" }}
                              >
                                ✓
                              </span>
                            ) : (
                              <span
                                style={{ color: "#dc2626", fontWeight: "bold" }}
                              >
                                ✗
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* How it works */}
            <div
              style={{
                background: "white",
                borderRadius: 10,
                padding: "1rem 1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                fontSize: "0.74rem",
                color: "#666",
                lineHeight: 1.65,
              }}
            >
              <strong style={{ color: "#1a1a2e", fontSize: "0.82rem" }}>
                How it works
              </strong>
              <br />
              Each accept/reject on the TOPSIS page (or simulation) is a
              training sample: the sitter&apos;s feature values (language match,
              price, rating, experience) with a 1/0 label. Logistic Regression
              learns via gradient descent (800 epochs, z-score normalised). The
              absolute magnitudes of learned coefficients are normalised to 100%
              and used as new TOPSIS weights. Click{" "}
              <strong>Apply learned weights</strong> to push them to the TOPSIS
              page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
