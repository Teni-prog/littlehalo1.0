// ─────────────────────────────────────────────────────────────────────────────
// Shared matching data and TOPSIS engine for Testmatching + LearningDemo pages.
// Other pages (demo-matching, etc.) use separate datasets intentionally.
// ─────────────────────────────────────────────────────────────────────────────

export const CRITERIA_REGISTRY = [
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
];

export const DEFAULT_WEIGHTS = Object.fromEntries(
  CRITERIA_REGISTRY.map((c) => [c.key, c.defaultWeight])
);

export const PARENTS = [
  { id: 1, name: "Sarah Johnson", language: "French",   budget: 25, city: "Fredericton, NB" },
  { id: 2, name: "Li Wei",        language: "Mandarin", budget: 30, city: "Moncton, NB"     },
  { id: 3, name: "Maria Gonzalez",language: "Spanish",  budget: 20, city: "Halifax, NS"      },
];

export const SITTERS = [
  { id: 1, name: "Sophie Martin",    price: 24, rating: 4.8, experience: 10, languages: ["English", "French"],   available: true  },
  { id: 2, name: "Amara Diallo",     price: 22, rating: 4.6, experience: 7,  languages: ["English", "French"],   available: false },
  { id: 3, name: "Rosa Rivera",      price: 25, rating: 4.9, experience: 1,  languages: ["English"],              available: true  },
  { id: 4, name: "Li Na",            price: 20, rating: 4.7, experience: 5,  languages: ["English", "Mandarin"], available: true  },
  { id: 5, name: "James Lee",        price: 18, rating: 4.5, experience: 3,  languages: ["English"],              available: false },
  { id: 6, name: "Isabella Torres",  price: 19, rating: 4.6, experience: 6,  languages: ["English", "Spanish"],  available: true  },
  { id: 7, name: "Olivia Chen",      price: 23, rating: 4.7, experience: 8,  languages: ["English", "Mandarin"], available: true  },
  { id: 8, name: "Carlos Ruiz",      price: 21, rating: 4.4, experience: 4,  languages: ["English", "Spanish"],  available: false },
];

/**
 * Runs TOPSIS on a list of sitters for a given parent and weight object.
 * weights: { [criterionKey]: number } — values are auto-normalised so they
 * don't need to sum to 100.
 */
export function runTOPSIS(sitters, parent, weights) {
  const total =
    CRITERIA_REGISTRY.reduce((s, c) => s + (weights[c.key] || 0), 0) || 1;
  const normWeights = CRITERIA_REGISTRY.map((c) => (weights[c.key] || 0) / total);

  const matrix = sitters.map((s) =>
    CRITERIA_REGISTRY.map((c) => c.getValue(s, parent))
  );

  const divisors = CRITERIA_REGISTRY.map(
    (_, col) =>
      Math.sqrt(matrix.reduce((sum, row) => sum + row[col] ** 2, 0)) || 1
  );
  const weighted = matrix.map((row) =>
    row.map((v, col) => (v / divisors[col]) * normWeights[col])
  );

  const ideal = CRITERIA_REGISTRY.map((c, col) => {
    const vals = weighted.map((r) => r[col]);
    return c.type === "benefit" ? Math.max(...vals) : Math.min(...vals);
  });
  const worst = CRITERIA_REGISTRY.map((c, col) => {
    const vals = weighted.map((r) => r[col]);
    return c.type === "benefit" ? Math.min(...vals) : Math.max(...vals);
  });

  return sitters
    .map((sitter, i) => {
      const dPlus = Math.sqrt(
        weighted[i].reduce((s, v, c) => s + (v - ideal[c]) ** 2, 0)
      );
      const dMinus = Math.sqrt(
        weighted[i].reduce((s, v, c) => s + (v - worst[c]) ** 2, 0)
      );
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
