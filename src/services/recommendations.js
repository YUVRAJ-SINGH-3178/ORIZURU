// Recommendation Engine with Cosine Similarity
// Enhanced for international diversity
export const scoringEngine = {
  // Calculate cosine similarity between two vectors
  calculateCosineSimilarity: (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * (vecB[i] || 0), 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    return magA && magB ? dotProduct / (magA * magB) : 0;
  },

  // Build user preference vector from quiz answers
  buildUserVector: (answers) => {
    // answers is an array of quiz responses
    // Map to 8D preference space:
    // [vibe, pace, genre_type, emotional_tone, era, length, complexity, social]

    if (!answers || answers.length === 0) {
      return [0, 0, 0, 0, 0, 0, 0, 0];
    }

    // Normalize and pad answers to 8 dimensions
    const vector = [];
    for (let i = 0; i < 8; i++) {
      vector.push(answers[i] !== undefined ? answers[i] : 0);
    }

    return vector;
  },

  // Get personalized recommendations with trending/recency and user history
  // watchedIds: Set of movie/show IDs the user has marked as watched — these are HARD EXCLUDED
  getRecommendations: (userVector, dataset, count = 5, userHistory = [], watchedIds = new Set()) => {
    if (!dataset || dataset.length === 0) return [];

    // ── HARD EXCLUSION: strip watched items before any scoring ──
    const pool = watchedIds.size > 0
      ? dataset.filter((item) => !watchedIds.has(item.id))
      : dataset;

    if (pool.length === 0) return [];

    // Build history stats for personalization
    const historyStats = scoringEngine.getHistoryStats(userHistory);

    // Get current year for recency factor
    const nowYear = new Date().getFullYear();

    const scored = pool.map((item) => {
      // Calculate base similarity
      const similarity = scoringEngine.calculateCosineSimilarity(
        userVector,
        item.vec,
      );

      // Normalize similarity from [-1,1] to [0,1]
      let normalizedSim = (similarity + 1) / 2;

      // Heavily penalize movies that represent the exact opposite of what the user wants
      if (normalizedSim < 0.3) {
        normalizedSim *= 0.3; // Tank the score if it completely mismatches
      }

      // Factor in popularity (normalized)
      const popScore = Math.min(item.pop || 0.1, 1);

      // Factor in rating
      const ratingScore = item.voteAverage ? item.voteAverage / 10 : 0.5;

      // Confidence boost based on vote count
      const voteCountScore = item.voteCount
        ? Math.min(Math.log10(item.voteCount + 10) / 4, 1) // adding 10 avoids log(1) issues
        : 0.3;

      // Recency/trending boost using half-life decay (15y half-life)
      let recencyScore = 0.5;
      if (item.year) {
        const age = Math.max(0, nowYear - item.year);
        recencyScore = Math.pow(0.5, age / 15);
      }

      // User history genre boost
      let genreBoost = 0;
      if (item.genres && item.genres.length > 0) {
        genreBoost = item.genres.reduce(
          (sum, g) => sum + (historyStats.genreCounts[g] || 0),
          0,
        );
        genreBoost = Math.min(genreBoost / 6, 1);
      }

      // Affinities
      const languageAffinity = scoringEngine.getAffinityScore(historyStats.languageCounts, item.language);
      const countryAffinity = scoringEngine.getAffinityScore(historyStats.countryCounts, item.originCountry);
      const typeAffinity = scoringEngine.getAffinityScore(historyStats.contentTypeCounts, item.contentType);
      const animeRegionBoost = scoringEngine.getAnimeRegionBoost(item, historyStats);
      const intlBoost = item.language && item.language !== "en" ? 0.05 : 0;

      // Re-weighted Combined Score
      // Stronger emphasis on similarity and quality, smarter recency
      const finalScore =
        0.35 * normalizedSim +     // Increased weight for direct vector similarity
        0.20 * ratingScore +       // Increased weight for quality
        0.10 * popScore +
        0.05 * recencyScore +
        0.05 * voteCountScore +
        0.08 * genreBoost +
        0.04 * languageAffinity +
        0.04 * countryAffinity +
        0.04 * typeAffinity +
        animeRegionBoost +
        intlBoost;

      return {
        ...item,
        matchScore: finalScore,
        similarityScore: normalizedSim,
        displayMatch: Math.round(finalScore * 100),
      };
    });

    // Sort by score and return top N with diversity
    return scoringEngine.diversifyResults(scored, count);
  },

  // Ensure diverse recommendations - STRICT ENFORCEMENT
  diversifyResults: (scoredMovies, count) => {
    const sorted = scoredMovies.sort((a, b) => b.matchScore - a.matchScore);
    const selected = [];

    // Track usage to prevent flooding
    const genreCounts = {};
    const decadeCounts = {};
    const languageCounts = {};

    const TYPE_LIMIT = Math.max(2, Math.ceil(count * 0.4)); // Max 40% same genre/decade/language

    // First pass: Fill strictly respecting limits
    for (const movie of sorted) {
      if (selected.length >= count) break;

      const primaryGenre = movie.genres?.[0] || 'Unknown';
      const decade = movie.year ? Math.floor(movie.year / 10) * 10 : 'Unknown';
      const language = movie.language || "en";

      const currentGenreCount = genreCounts[primaryGenre] || 0;
      const currentDecadeCount = decadeCounts[decade] || 0;
      const currentLangCount = languageCounts[language] || 0;

      // To guarantee the absolute best matches still make it through, exempt the very first #1 match
      const isFirst = selected.length === 0;

      // Very strict capping on diversity
      const overLimit =
        currentGenreCount >= TYPE_LIMIT ||
        currentDecadeCount >= TYPE_LIMIT ||
        (language === 'en' ? currentLangCount >= Math.ceil(count * 0.7) : currentLangCount >= TYPE_LIMIT);

      if (isFirst || !overLimit) {
        selected.push(movie);
        genreCounts[primaryGenre] = currentGenreCount + 1;
        decadeCounts[decade] = currentDecadeCount + 1;
        languageCounts[language] = currentLangCount + 1;
      }
    }

    // Second pass: Ensure at least X% international content if enough slots exist
    const minIntl = Math.ceil(count * 0.3);
    const intlCount = selected.filter((m) => m.language && m.language !== "en").length;

    if (intlCount < minIntl && selected.length >= count) {
      // Find backup international titles in the top sorted range (up to top 100)
      const intlCandidates = sorted.slice(0, 100).filter(
        (m) =>
          m.language &&
          m.language !== "en" &&
          !selected.find((s) => s.id === m.id)
      );

      for (let i = 0; i < intlCandidates.length && selected.length > 2; i++) {
        // Swap out an English title from the bottom half of the selected list
        for (let j = selected.length - 1; j >= Math.floor(count / 2); j--) {
          if (selected[j].language === "en" || !selected[j].language) {
            selected[j] = intlCandidates[i];
            break;
          }
        }
      }
    }

    // Fallback: if we somehow didn't hit count due to strict caps, backfill with best remaining
    if (selected.length < count) {
      for (const movie of sorted) {
        if (selected.length >= count) break;
        if (!selected.find((m) => m.id === movie.id)) {
          selected.push(movie);
        }
      }
    }

    // Mild shuffle for variety visually, keeping top #1 in position
    for (let i = selected.length - 1; i > 1; i--) {
      // Only 15% chance to swap around
      if (Math.random() < 0.15) {
        const j = Math.floor(Math.random() * (i - 1)) + 1;
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }
    }

    return selected;
  },

  // Get similar movies to a given movie (enhanced version)
  getSimilarMovies: (movie, dataset, count = 5) => {
    if (!movie || !dataset) return [];

    const similar = dataset
      .filter((m) => m.id !== movie.id)
      .map((m) => {
        // Vector similarity
        const vecSimilarity = scoringEngine.calculateCosineSimilarity(
          movie.vec,
          m.vec,
        );

        // Genre overlap bonus
        const sharedGenres = movie.genres.filter((g) =>
          m.genres.includes(g),
        ).length;
        const genreBonus =
          (sharedGenres / Math.max(movie.genres.length, 1)) * 0.3;

        // Same content type bonus
        const typeBonus = movie.contentType === m.contentType ? 0.1 : 0;

        // Language/country proximity bonus
        const languageBonus =
          movie.language && movie.language === m.language ? 0.05 : 0;
        const countryBonus =
          movie.originCountry && movie.originCountry === m.originCountry
            ? 0.05
            : 0;

        // Similar era bonus
        const yearDiff = Math.abs((movie.year || 2020) - (m.year || 2020));
        const eraBonus = yearDiff < 5 ? 0.1 : yearDiff < 10 ? 0.05 : 0;

        const totalScore =
          ((vecSimilarity + 1) / 2) * 0.5 +
          genreBonus +
          typeBonus +
          eraBonus +
          languageBonus +
          countryBonus;

        return {
          ...m,
          matchScore: totalScore,
          displayMatch: Math.round(totalScore * 100),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return scoringEngine.diversifyResults(similar, count);
  },

  // Build history stats for affinity scoring
  getHistoryStats: (userHistory = []) => {
    const historyIds = new Set(userHistory.map((h) => h.id));
    const genreCounts = {};
    const languageCounts = {};
    const countryCounts = {};
    const contentTypeCounts = {};
    const animeRegionCounts = {};
    let animeTotal = 0;

    userHistory.forEach((item) => {
      (item.genres || []).forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });

      if (item.language) {
        languageCounts[item.language] =
          (languageCounts[item.language] || 0) + 1;
      }

      if (item.originCountry) {
        countryCounts[item.originCountry] =
          (countryCounts[item.originCountry] || 0) + 1;
      }

      if (item.contentType) {
        contentTypeCounts[item.contentType] =
          (contentTypeCounts[item.contentType] || 0) + 1;
      }

      if (item.contentType === "anime") {
        animeTotal += 1;
        const region = item.originCountry || "JP";
        animeRegionCounts[region] = (animeRegionCounts[region] || 0) + 1;
      }
    });

    return {
      historyIds,
      genreCounts,
      languageCounts,
      countryCounts,
      contentTypeCounts,
      animeRegionCounts,
      animeTotal,
    };
  },

  // Normalize count-based affinity to 0..1
  getAffinityScore: (counts, key) => {
    if (!counts || !key) return 0;
    const values = Object.values(counts);
    if (values.length === 0) return 0;
    const max = Math.max(...values);
    return max ? (counts[key] || 0) / max : 0;
  },

  // Boost anime by region, with optional user-history bias
  getAnimeRegionBoost: (item, historyStats) => {
    if (!item || item.contentType !== "anime") return 0;

    const region = item.originCountry || "JP";
    const baseMap = {
      JP: 0.12,
      KR: 0.1,
      CN: 0.09,
      US: 0.07,
    };

    const base = baseMap[region] ?? 0.06;
    const historyBoost = historyStats.animeTotal
      ? ((historyStats.animeRegionCounts[region] || 0) /
        historyStats.animeTotal) *
      0.08
      : 0;

    return base + historyBoost;
  },

  // Get recommendations by selected genres
  // watchedIds: hard excludes watched items
  getRecommendationsByGenres: (genres, dataset, count = 8, watchedIds = new Set()) => {
    if (!genres || genres.length === 0 || !dataset) return [];

    const pool = watchedIds.size > 0
      ? dataset.filter((item) => !watchedIds.has(item.id))
      : dataset;

    const scored = pool.map((item) => {
      const matchingGenres = item.genres.filter((g) => genres.includes(g)).length;
      const genreScore = matchingGenres / genres.length;
      const ratingScore = item.voteAverage ? item.voteAverage / 10 : 0.5;
      const popScore = Math.min(item.pop, 1);
      const finalScore = 0.5 * genreScore + 0.25 * ratingScore + 0.25 * popScore;
      return { ...item, matchScore: finalScore, displayMatch: Math.round(finalScore * 100) };
    });

    const filtered = scored.filter((item) => item.genres.some((g) => genres.includes(g)));
    return scoringEngine.diversifyResults(filtered, count);
  },

  // Get similar to a specific title (respects watchedIds)
  getSimilarToTitle: (sourceTitle, dataset, count = 8, watchedIds = new Set()) => {
    if (!sourceTitle || !dataset) return [];
    const pool = watchedIds.size > 0
      ? dataset.filter((item) => !watchedIds.has(item.id))
      : dataset;
    return scoringEngine.getSimilarMovies(sourceTitle, pool, count);
  },

  // Filter movies by criteria
  filterMovies: (movies, filters) => {
    return movies.filter((movie) => {
      if (filters.genre && !movie.genres.includes(filters.genre)) return false;
      if (filters.minYear && movie.year < filters.minYear) return false;
      if (filters.maxYear && movie.year > filters.maxYear) return false;
      if (filters.minRating && movie.voteAverage < filters.minRating)
        return false;
      if (filters.language && movie.language !== filters.language) return false;
      return true;
    });
  },
};

export default scoringEngine;
