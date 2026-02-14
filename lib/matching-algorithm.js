// Rule-Based Matching Algorithm

// Step 1: Check if sitter passes all hard rules (must-haves)
export function passesHardRules(sitter, rules) {
    // Rule 1: Must speak English
    if (!sitter.languages?.includes('English')) {
        return false;
    }

    // Rule 2: Must be within budget
    if (sitter.hourly_rate > rules.maxBudget) {
        return false;
    }

    // Rule 3: Background check must be approved
    if (sitter.background_check_status !== 'approved') {
        return false;
    }

    // If we get here, they passed all hard rules
    return true;
}

// Step 2: Score based on soft rules (preferences)
export function calculatePreferenceScore(sitter, preferences) {
    let score = 0;

    // Preference 1: Same city (+1 point)
    if (sitter.location?.includes(preferences.city)) {
        score += 1;
    }

    // Preference 2: Speaks preferred language (+1 point)
    if (preferences.preferredLanguage && sitter.languages?.includes(preferences.preferredLanguage)) {
        score += 1;
    }

    // Preference 3: Verified (+1 point)
    if (sitter.is_verified === true) {
        score += 1;
    }

    // Preference 4: High rating (+1 point)
    if (sitter.rating >= 3.5) {
        score += 1;
    }

    return score; // Score out of 4
}

// Main matching function
export default function matchSitters(sitters, hardRules, softPreferences) {
    // Step 1: Filter by hard rules
    const qualifiedSitters = sitters.filter(sitter =>
        passesHardRules(sitter, hardRules)
    );

    // Step 2: Score remaining sitters by preferences
    const scoredSitters = qualifiedSitters.map(sitter => ({
        ...sitter,
        preferenceScore: calculatePreferenceScore(sitter, softPreferences)
    }));

    // Step 3: Sort by preference score (highest first)
    return scoredSitters.sort((a, b) => b.preferenceScore - a.preferenceScore);
}