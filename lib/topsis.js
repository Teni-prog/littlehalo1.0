// ===============================
// TOPSIS ALGORITHM - Little Halo
// Technique for Order Preference by Similarity to Ideal Solution
//
// How it works:
// 1. Normalize raw values so all criteria are on the same scale
// 2. Apply weights based on what matters most to newcomer families
// 3. Find the ideal sitter (best value per criterion) and worst sitter
// 4. Calculate each sitter's distance from ideal AND from worst
// 5. Score = distance from worst / (distance from worst + distance from ideal)
//    → Score closer to 1 = better match
// ===============================

/**
 * Main TOPSIS function
 *
 * @param {Array} sitters - array of sitter objects from DB
 * @param {Object} parentPrefs - parent preferences { preferredLanguage, maxBudget }
 * @returns {Array} sitters sorted by TOPSIS score descending
 */
export function matchSittersTOPSIS(sitters, parentPrefs) {
  if (!sitters || sitters.length === 0) {
    return { error: "No sitters available to match." };
  }

  // ---- STEP 0: PREPARE THE MATRIX ----
  // Columns: Price, Rating, Experience, LanguageMatch
  const matrix = sitters.map((sitter) => [
    sitter.price ?? sitter.hourly_rate ?? 0,
    sitter.rating ?? 0,
    sitter.experience ?? 0,
    sitter.languages?.includes(parentPrefs.preferredLanguage) ? 1 : 0,
  ]);

  // Weights based on newcomer family priorities
  // Language → 40%, Price → 30%, Rating → 20%, Experience → 10%
  const weights = [0.35, 0.2, 0.1, 0.35];

  // price = cost (lower is better), rest = benefit (higher is better)
  const criteriaTypes = ["cost", "benefit", "benefit", "benefit"];

  const numCriteria = matrix[0].length;

  // ---- STEP 1: NORMALIZE ----
  const divisors = Array(numCriteria).fill(0);
  for (let col = 0; col < numCriteria; col++) {
    const sumOfSquares = matrix.reduce((sum, row) => sum + row[col] ** 2, 0);
    divisors[col] = Math.sqrt(sumOfSquares) || 1;
  }
  const normalized = matrix.map((row) =>
    row.map((value, col) => value / divisors[col]),
  );

  // ---- STEP 2: APPLY WEIGHTS ----
  const weighted = normalized.map((row) =>
    row.map((value, col) => value * weights[col]),
  );

  // ---- STEP 3: FIND IDEAL AND WORST ----
  const ideal = [];
  const worst = [];
  for (let col = 0; col < numCriteria; col++) {
    const colValues = weighted.map((row) => row[col]);
    const max = Math.max(...colValues);
    const min = Math.min(...colValues);
    if (criteriaTypes[col] === "benefit") {
      ideal.push(max);
      worst.push(min);
    } else {
      ideal.push(min);
      worst.push(max);
    }
  }

  // ---- STEP 4: CALCULATE DISTANCES ----
  const distances = weighted.map((row) => {
    const distFromIdeal = Math.sqrt(
      row.reduce((sum, value, col) => sum + (value - ideal[col]) ** 2, 0),
    );
    const distFromWorst = Math.sqrt(
      row.reduce((sum, value, col) => sum + (value - worst[col]) ** 2, 0),
    );
    return { distFromIdeal, distFromWorst };
  });

  // ---- STEP 5: CALCULATE FINAL SCORES ----
  const scores = distances.map(
    ({ distFromIdeal, distFromWorst }) =>
      distFromWorst / (distFromWorst + distFromIdeal),
  );

  // ---- COMBINE AND SORT ----
  return sitters
    .map((sitter, i) => ({
      ...sitter,
      score: parseFloat(scores[i].toFixed(4)),
      distFromIdeal: parseFloat(distances[i].distFromIdeal.toFixed(4)),
      distFromWorst: parseFloat(distances[i].distFromWorst.toFixed(4)),
      languageMatch: matrix[i][3],
    }))
    .sort((a, b) => b.score - a.score);
}
