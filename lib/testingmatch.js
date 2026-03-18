// ===============================
// MATCHING ENGINE
// Entropy + Pareto + Mahalanobis
// ===============================

// ---------- 1 ENTROPY ----------

function calculateEntropy(probabilities) {
  return probabilities.reduce((sum, p) => {
    if (p === 0) return sum;
    return sum - p * Math.log2(p);
  }, 0);
}

function informationGain(data, filterFn) {
  const total = data.length;
  const pass = data.filter(filterFn).length;
  const fail = total - pass;

  const pPass = pass / total;
  const pFail = fail / total;

  return calculateEntropy([pPass, pFail]);
}

function orderFiltersByEntropy(data, filters) {
  return filters.sort(
    (a, b) => informationGain(data, a.fn) - informationGain(data, b.fn),
  );
}

// ---------- 2 HARD FILTER ----------

function applyHardConstraints(data, mustConstraints) {
  return data.filter((sitter) =>
    Object.entries(mustConstraints).every(
      ([key, value]) => sitter[key] === value,
    ),
  );
}

// ---------- 3 PARETO ----------

function dominates(a, b) {
  const betterOrEqual =
    a.price <= b.price &&
    a.rating >= b.rating &&
    a.experience >= b.experience &&
    a.languageMatch >= b.languageMatch;

  const strictlyBetter =
    a.price < b.price ||
    a.rating > b.rating ||
    a.experience > b.experience ||
    a.languageMatch > b.languageMatch;

  return betterOrEqual && strictlyBetter;
}

function paretoFilter(data) {
  return data.filter(
    (candidate) =>
      !data.some((other) => other !== candidate && dominates(other, candidate)),
  );
}

// ---------- 4 MAHALANOBIS ----------

// Matrix utilities
function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

function multiply(a, b) {
  return a.map((row) =>
    b[0].map((_, j) => row.reduce((sum, val, i) => sum + val * b[i][j], 0)),
  );
}

function invert2x2(matrix) {
  const [[a, b], [c, d]] = matrix;
  const det = a * d - b * c;
  if (det === 0) return null;
  return [
    [d / det, -b / det],
    [-c / det, a / det],
  ];
}

// Simplified Mahalanobis (2 features for stability)
function mahalanobisRanking(data, parentVector) {
  // Using only price + rating for stability
  const featureMatrix = data.map((s) => [s.price, s.rating]);

  const mean = [
    featureMatrix.reduce((sum, v) => sum + v[0], 0) / featureMatrix.length,
    featureMatrix.reduce((sum, v) => sum + v[1], 0) / featureMatrix.length,
  ];

  const centered = featureMatrix.map((v) => [v[0] - mean[0], v[1] - mean[1]]);

  const cov = [
    [
      centered.reduce((sum, v) => sum + v[0] * v[0], 0) / featureMatrix.length,
      centered.reduce((sum, v) => sum + v[0] * v[1], 0) / featureMatrix.length,
    ],
    [
      centered.reduce((sum, v) => sum + v[1] * v[0], 0) / featureMatrix.length,
      centered.reduce((sum, v) => sum + v[1] * v[1], 0) / featureMatrix.length,
    ],
  ];

  const invCov = invert2x2(cov);
  if (!invCov) return data;

  const ranked = data.map((s) => {
    const diff = [s.price - parentVector.price, s.rating - parentVector.rating];

    const diffMatrix = [diff];
    const diffT = transpose(diffMatrix);

    const distance = multiply(multiply(diffMatrix, invCov), diffT)[0][0];

    return {
      ...s,
      distance,
    };
  });

  ranked.sort((a, b) => a.distance - b.distance);

  return ranked;
}

// ---------- 5 COMPLETE PIPELINE ----------

function matchSitters(sitters, parent) {
  console.log(`[Matching] Starting with ${sitters.length} sitters`);

  // ENTROPY FILTER ORDERING
  const filters = Object.entries(parent.must).map(([key, value]) => ({
    name: key,
    fn: (s) => s[key] === value,
  }));

  console.log(`[Matching] Number of hard constraints: ${filters.length}`);

  const orderedFilters = orderFiltersByEntropy(sitters, filters);

  let candidates = [...sitters];

  for (let filter of orderedFilters) {
    const beforeCount = candidates.length;
    candidates = candidates.filter(filter.fn);
    console.log(
      `[Matching] After filter '${filter.name}': ${beforeCount} -> ${candidates.length}`,
    );
    if (candidates.length === 0) {
      console.log(`[Matching] No candidates passed filter: ${filter.name}`);
      return { error: "No matches found." };
    }
  }

  console.log(`[Matching] ${candidates.length} candidates after hard filters`);

  // PARETO
  candidates = paretoFilter(candidates);
  console.log(`[Matching] ${candidates.length} candidates after Pareto filter`);

  if (candidates.length === 0) {
    console.log(`[Matching] No candidates after Pareto (all dominated)`);
    return { error: "No matches found." };
  }

  // MAHALANOBIS
  const ranked = mahalanobisRanking(candidates, parent.idealVector);
  console.log(
    `[Matching] Final ranking complete with ${ranked.length} results`,
  );

  return ranked;
}

export default matchSitters;
