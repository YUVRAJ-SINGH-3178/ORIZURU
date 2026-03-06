// Recommendation Engine with Cosine Similarity
// Enhanced for production-grade discovery and "Hidden Gem" detection

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
    if (!answers || answers.length === 0) return [0, 0, 0, 0, 0, 0, 0, 0];
    const vector = [];
    for (let i = 0; i < 8; i++) {
      vector.push(answers[i] !== undefined ? answers[i] : 0);
    }
    return vector;
  },

  // Main Recommendation Logic
  getRecommendations: (userVector, dataset, count = 40, userHistory = [], watchedIds = new Set()) => {
    if (!dataset || dataset.length === 0) return [];

    const watchedSet = watchedIds instanceof Set ? watchedIds : new Set(watchedIds);
    const pool = dataset.filter((item) => !watchedSet.has(item.id));
    if (pool.length === 0) return [];

    const historyStats = scoringEngine.getHistoryStats(userHistory);
    const nowYear = new Date().getFullYear();

    const scored = pool.map((item) => {
      // 1. Vector Similarity (Base)
      const similarity = scoringEngine.calculateCosineSimilarity(userVector, item.vec || [0, 0, 0, 0, 0, 0, 0, 0]);
      let normalizedSim = (similarity + 1) / 2;

      // Penalty for absolute mismatch
      if (normalizedSim < 0.35) normalizedSim *= 0.2;

      // 2. Quality & Popularity
      const rating = parseFloat(item.imdb || 5);
      const ratingScore = rating / 10;
      const popScore = Math.min(item.pop || 0.1, 1);

      // 3. Hidden Gem Logic (Boost high rating + low popularity)
      let hiddenGemBoost = 0;
      if (rating >= 7.6 && popScore < 0.15) hiddenGemBoost = 0.2;

      // 4. Recency (25y half-life for cinematic discovery)
      let recencyScore = 0.5;
      if (item.year) {
        const age = Math.max(0, nowYear - item.year);
        recencyScore = Math.pow(0.5, age / 25);
      }

      // 5. Personal History Context
      let genreBoost = 0;
      if (item.genres && item.genres.length > 0) {
        genreBoost = item.genres.reduce((sum, g) => sum + (historyStats.genreCounts[g] || 0), 0);
        genreBoost = Math.min(genreBoost / 8, 1);
      }

      const langAffinity = scoringEngine.getAffinityScore(historyStats.languageCounts, item.language);
      const typeAffinity = scoringEngine.getAffinityScore(historyStats.contentTypeCounts, item.contentType);

      // Final weighted calculation
      const finalScore =
        (normalizedSim * 0.44) +
        (ratingScore * 0.18) +
        (popScore * 0.05) +
        (recencyScore * 0.05) +
        (genreBoost * 0.10) +
        (langAffinity * 0.05) +
        (typeAffinity * 0.05) +
        hiddenGemBoost +
        (Math.random() * 0.08); // Serendipity factor for fresh results

      return {
        ...item,
        matchScore: finalScore,
        displayMatch: Math.min(99, Math.round(finalScore * 100)),
        isGem: hiddenGemBoost > 0
      };
    });

    return scoringEngine.diversifyResults(scored, count);
  },

  // Alias for compatibility
  recommend: (dataset, vectors, count, history, watched) => {
    return scoringEngine.getRecommendations(vectors, dataset, count, history, watched);
  },

  // Diversity enforcement
  diversifyResults: (items, count) => {
    const sorted = items.sort((a, b) => b.matchScore - a.matchScore);
    const selected = [];
    const rejected = [];
    const genreTracker = {};
    const langTracker = {};

    const SOFT_LIMIT = Math.max(3, Math.ceil(count * 0.25));

    for (const item of sorted) {
      if (selected.length >= count) break;
      const genre = item.genres?.[0] || "Unknown";
      const lang = item.language || "en";

      const gCount = genreTracker[genre] || 0;
      const lCount = langTracker[lang] || 0;

      // Top 5 are always kept for accuracy, others are checked for diversity
      if (selected.length < 5 || (gCount < SOFT_LIMIT && lCount < count * 0.6)) {
        selected.push(item);
        genreTracker[genre] = gCount + 1;
        langTracker[lang] = lCount + 1;
      } else {
        rejected.push(item);
      }
    }

    // Fill the rest if we didn't reach the exact count (e.g. if the user asked for very specific genres)
    let i = 0;
    while (selected.length < count && i < rejected.length) {
      selected.push(rejected[i]);
      i++;
    }

    return selected;
  },

  getSimilarMovies: (movie, dataset, count = 20, watchedIds = new Set()) => {
    if (!movie || !dataset) return [];
    const watchedSet = watchedIds instanceof Set ? watchedIds : new Set(watchedIds);

    const scored = dataset
      .filter(m => m.id !== movie.id && !watchedSet.has(m.id))
      .map(m => {
        const sim = scoringEngine.calculateCosineSimilarity(movie.vec || [0, 0, 0, 0, 0, 0, 0, 0], m.vec || [0, 0, 0, 0, 0, 0, 0, 0]);
        const sharedGenres = (movie.genres || []).filter(g => (m.genres || []).includes(g)).length;
        const genreScore = sharedGenres / Math.max(movie.genres?.length || 1, 1);

        const serendipity = Math.random() * 0.10; // Fresh recommendations
        const finalScore = (sim * 0.5) + (genreScore * 0.3) + ((parseFloat(m.imdb) || 7) / 100) + serendipity;
        return { ...m, matchScore: finalScore, displayMatch: Math.min(99, Math.round(finalScore * 100)) };
      });

    return scoringEngine.diversifyResults(scored, count);
  },

  getRecommendationsByGenres: (genres, dataset, count = 30, watchedIds = new Set()) => {
    if (!genres || genres.length === 0 || !dataset) return [];
    const watchedSet = watchedIds instanceof Set ? watchedIds : new Set(watchedIds);
    const pool = dataset.filter(m => !watchedSet.has(m.id));

    const scored = pool.map(item => {
      const matchCount = (item.genres || []).filter(g => genres.includes(g)).length;
      const genreScore = matchCount / genres.length;
      const rating = (parseFloat(item.imdb) || 7) / 10;
      const serendipity = Math.random() * 0.15; // Higher randomness for pure genres to ensure deep discovery
      const finalScore = (genreScore * 0.5) + (rating * 0.25) + (item.pop * 0.1) + serendipity;
      return { ...item, matchScore: finalScore, displayMatch: Math.min(99, Math.round(finalScore * 100)) };
    }).filter(i => i.matchScore > 0.2);

    return scoringEngine.diversifyResults(scored, count);
  },

  getHistoryStats: (history = []) => {
    const stats = { genreCounts: {}, languageCounts: {}, contentTypeCounts: {} };
    history.forEach(item => {
      (item.genres || []).forEach(g => stats.genreCounts[g] = (stats.genreCounts[g] || 0) + 1);
      if (item.language) stats.languageCounts[item.language] = (stats.languageCounts[item.language] || 0) + 1;
      if (item.contentType) stats.contentTypeCounts[item.contentType] = (stats.contentTypeCounts[item.contentType] || 0) + 1;
    });
    return stats;
  },

  getAffinityScore: (counts, key) => {
    if (!counts || !key || !counts[key]) return 0;
    const values = Object.values(counts);
    const max = Math.max(...values);
    return counts[key] / max;
  }
};

export default scoringEngine;
