import tmdbService from "./tmdb";

// Countries to fetch movies from (worldwide coverage - expanded)
const COUNTRIES = [
  // Americas
  "US",
  "CA",
  "MX",
  "BR",
  "AR",
  "CO",
  "CL",
  "PE",
  "VE",
  "CU",
  "PR",
  "EC",
  "UY",
  // Europe
  "GB",
  "FR",
  "DE",
  "IT",
  "ES",
  "PT",
  "NL",
  "BE",
  "AT",
  "CH",
  "SE",
  "DK",
  "NO",
  "FI",
  "PL",
  "CZ",
  "RU",
  "UA",
  "RO",
  "HU",
  "GR",
  "IE",
  "IS",
  "LU",
  "HR",
  "RS",
  "BG",
  "SK",
  // Asia
  "JP",
  "KR",
  "CN",
  "IN",
  "TH",
  "ID",
  "PH",
  "VN",
  "MY",
  "SG",
  "HK",
  "TW",
  "PK",
  "BD",
  "NP",
  "LK",
  "MM",
  "KH",
  "LA",
  "MN",
  "KZ",
  "UZ",
  "AZ",
  "GE",
  "AM",
  // Middle East
  "IL",
  "TR",
  "IR",
  "SA",
  "AE",
  "QA",
  "KW",
  "LB",
  "JO",
  "EG",
  // Africa
  "ZA",
  "NG",
  "KE",
  "MA",
  "GH",
  "ET",
  "TZ",
  "UG",
  "SN",
  "CI",
  "CM",
  "DZ",
  "TN",
  // Oceania
  "AU",
  "NZ",
];

// Genre IDs for variety (Movies) - all genres
const GENRES = [
  28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53,
  10752, 37,
];

// TV Genre IDs - expanded
const TV_GENRES = [
  10759, 16, 35, 80, 99, 18, 10751, 9648, 10765, 10768, 37, 10762, 10764, 10766,
  10767,
];

// Decades to cover - expanded
const DECADES = [
  { start: 1940, end: 1949 },
  { start: 1950, end: 1959 },
  { start: 1960, end: 1969 },
  { start: 1970, end: 1979 },
  { start: 1980, end: 1989 },
  { start: 1990, end: 1999 },
  { start: 2000, end: 2009 },
  { start: 2010, end: 2019 },
  { start: 2020, end: 2026 },
];

// Languages for international content
const LANGUAGES = [
  "hi",
  "ta",
  "te",
  "ml",
  "bn",
  "mr",
  "pa",
  "kn", // Indian languages
  "ko",
  "ja",
  "zh",
  "th",
  "vi",
  "id",
  "ms", // East/Southeast Asian
  "es",
  "pt",
  "fr",
  "de",
  "it",
  "ru",
  "pl",
  "tr",
  "ar",
  "fa", // Other major languages
];

const PAGE_LIMITS = {
  popularMovies: 400,
  topRatedMovies: 400,
  nowPlaying: 80,
  upcoming: 80,
  moviesByGenre: 60,
  moviesByCountry: 40,
  moviesByLanguage: 40,
  moviesByDecade: 40,
  popularTV: 350,
  topRatedTV: 350,
  animeByRegion: 200,
  animeMoviesByRegion: 120,
  kDrama: 150,
  cDrama: 140,
  regionalTV: 120,
  tvByGenre: 60,
  onAirTV: 200,
  voteCountMovies: 150,
  highRatedMovies: 100,
};

const QUICK_LIMITS = {
  popularMovies: 40,
  topRatedMovies: 40,
  popularTV: 30,
  topRatedTV: 30,
  animeByRegion: 20,
  animeMoviesByRegion: 8,
  kDrama: 12,
  cDrama: 10,
  regionalTV: 10,
};

const TARGET_TITLES = ["Kaiju Ditan Mai Dali", "The Most Powerful Vendor"];

class MovieDatabase {
  constructor() {
    this.movies = new Map();
    this.tvShows = new Map();
    this.isLoading = false;
    this.loadProgress = 0;
    this.totalToLoad = 0;
  }

  // Load a comprehensive movie database (10,000+ titles)
  async loadMovies(onProgress = () => { }) {
    if (this.isLoading) return;
    this.isLoading = true;

    const allMovies = [];
    let loaded = 0;

    try {
      // Strategy: Fetch from multiple sources to get variety
      const fetchPromises = [];

      // 1. Popular movies (near TMDB 500-page cap)
      for (let page = 1; page <= PAGE_LIMITS.popularMovies; page++) {
        fetchPromises.push(
          tmdbService
            .getPopularMovies(page)
            .then((data) => ({ type: "movie", results: data?.results || [] })),
        );
      }

      // 2. Top rated movies (near TMDB 500-page cap)
      for (let page = 1; page <= PAGE_LIMITS.topRatedMovies; page++) {
        fetchPromises.push(
          tmdbService
            .getTopRatedMovies(page)
            .then((data) => ({ type: "movie", results: data?.results || [] })),
        );
      }

      // 3. Now playing & Upcoming
      for (let page = 1; page <= PAGE_LIMITS.nowPlaying; page++) {
        fetchPromises.push(
          tmdbService
            .getNowPlayingMovies(page)
            .then((data) => ({ type: "movie", results: data?.results || [] })),
        );
        fetchPromises.push(
          tmdbService
            .getUpcomingMovies(page)
            .then((data) => ({ type: "movie", results: data?.results || [] })),
        );
      }

      // 4. Movies by genre (15 pages each) = deeper catalog per genre
      for (const genreId of GENRES) {
        for (let page = 1; page <= PAGE_LIMITS.moviesByGenre; page++) {
          fetchPromises.push(
            tmdbService
              .getMoviesByGenre(genreId, page)
              .then((data) => ({
                type: "movie",
                results: data?.results || [],
              })),
          );
        }
      }

      // 5. Movies from different countries (international content)
      for (const country of COUNTRIES) {
        for (let page = 1; page <= PAGE_LIMITS.moviesByCountry; page++) {
          fetchPromises.push(
            tmdbService
              .getMoviesByCountry(country, page)
              .then((data) => ({
                type: "movie",
                results: data?.results || [],
              })),
          );
        }
      }

      // 6. Movies by language (for better international coverage)
      for (const language of LANGUAGES) {
        for (let page = 1; page <= PAGE_LIMITS.moviesByLanguage; page++) {
          fetchPromises.push(
            tmdbService
              .discoverMovies({
                with_original_language: language,
                page,
                sort_by: "popularity.desc",
              })
              .then((data) => ({
                type: "movie",
                results: data?.results || [],
              })),
          );
        }
      }

      // 7. Movies by decade = historical coverage
      for (const decade of DECADES) {
        for (let page = 1; page <= PAGE_LIMITS.moviesByDecade; page++) {
          fetchPromises.push(
            tmdbService
              .getMoviesByDecade(decade.start, decade.end, page)
              .then((data) => ({
                type: "movie",
                results: data?.results || [],
              })),
          );
        }
      }

      // 8. Popular TV Shows (near TMDB 500-page cap)
      for (let page = 1; page <= PAGE_LIMITS.popularTV; page++) {
        fetchPromises.push(
          tmdbService
            .getPopularTVShows(page)
            .then((data) => ({ type: "tv", results: data?.results || [] })),
        );
      }

      // 9. Top Rated TV Shows (near TMDB 500-page cap)
      for (let page = 1; page <= PAGE_LIMITS.topRatedTV; page++) {
        fetchPromises.push(
          tmdbService
            .getTopRatedTVShows(page)
            .then((data) => ({ type: "tv", results: data?.results || [] })),
        );
      }

      // 10. Anime by region (JP/US/KR/CN/HK/TW)
      for (const country of ["JP", "US", "KR", "CN", "HK", "TW"]) {
        for (let page = 1; page <= PAGE_LIMITS.animeByRegion; page++) {
          fetchPromises.push(
            tmdbService
              .getAnimeByRegion(country, page)
              .then((data) => ({ type: "tv", results: data?.results || [] })),
          );
        }
      }

      // 10b. Anime movies by region
      for (const country of ["JP", "US", "KR", "CN", "HK", "TW"]) {
        for (let page = 1; page <= PAGE_LIMITS.animeMoviesByRegion; page++) {
          fetchPromises.push(
            tmdbService
              .getAnimeMoviesByRegion(country, page)
              .then((data) => ({
                type: "movie",
                results: data?.results || [],
              })),
          );
        }
      }

      // 11. Korean dramas
      for (let page = 1; page <= PAGE_LIMITS.kDrama; page++) {
        fetchPromises.push(
          tmdbService
            .discoverTV({
              with_origin_country: "KR",
              page,
              sort_by: "popularity.desc",
            })
            .then((data) => ({ type: "tv", results: data?.results || [] })),
        );
      }

      // 12. Chinese dramas
      for (let page = 1; page <= PAGE_LIMITS.cDrama; page++) {
        fetchPromises.push(
          tmdbService
            .discoverTV({
              with_origin_country: "CN",
              page,
              sort_by: "popularity.desc",
            })
            .then((data) => ({ type: "tv", results: data?.results || [] })),
        );
      }

      // 13. Thai, Indian, Turkish series
      for (const country of ["TH", "IN", "TR"]) {
        for (let page = 1; page <= PAGE_LIMITS.regionalTV; page++) {
          fetchPromises.push(
            tmdbService
              .discoverTV({
                with_origin_country: country,
                page,
                sort_by: "popularity.desc",
              })
              .then((data) => ({ type: "tv", results: data?.results || [] })),
          );
        }
      }

      // 14. TV by genre
      for (const genreId of TV_GENRES) {
        for (let page = 1; page <= PAGE_LIMITS.tvByGenre; page++) {
          fetchPromises.push(
            tmdbService
              .getTVByGenre(genreId, page)
              .then((data) => ({ type: "tv", results: data?.results || [] })),
          );
        }
      }

      // 15. On-air TV for fresher series coverage
      for (let page = 1; page <= PAGE_LIMITS.onAirTV; page++) {
        fetchPromises.push(
          tmdbService
            .getOnAirTVShows(page)
            .then((data) => ({ type: "tv", results: data?.results || [] })),
        );
      }

      // 16. Deep catalog by vote count (movies)
      for (let page = 1; page <= PAGE_LIMITS.voteCountMovies; page++) {
        fetchPromises.push(
          tmdbService
            .discoverMovies({
              sort_by: "vote_count.desc",
              page,
            })
            .then((data) => ({ type: "movie", results: data?.results || [] })),
        );
      }

      // 17. High-rated discovery (movies)
      for (let page = 1; page <= PAGE_LIMITS.highRatedMovies; page++) {
        fetchPromises.push(
          tmdbService
            .discoverMovies({
              "vote_average.gte": 7.5,
              "vote_count.gte": 500,
              sort_by: "vote_average.desc",
              page,
            })
            .then((data) => ({ type: "movie", results: data?.results || [] })),
        );
      }

      // 18. Targeted titles (ensure specific anime appear if available on TMDB)
      for (const title of TARGET_TITLES) {
        fetchPromises.push(
          tmdbService
            .searchTVShows(title, 1)
            .then((data) => ({ type: "tv", results: data?.results || [] })),
        );
        fetchPromises.push(
          tmdbService
            .searchMovies(title, 1)
            .then((data) => ({ type: "movie", results: data?.results || [] })),
        );
      }

      this.totalToLoad = fetchPromises.length;
      // console.log(`Loading ${fetchPromises.length} API requests for a massive catalog...`);

      // Batch fetch with rate limiting
      const batchSize = 25;
      for (let i = 0; i < fetchPromises.length; i += batchSize) {
        const batch = fetchPromises.slice(i, i + batchSize);
        const results = await Promise.all(batch);

        results.forEach((result) => {
          const { type, results: items } = result;
          items.forEach((item) => {
            if (item && item.id) {
              if (type === "movie" && !this.movies.has(item.id)) {
                const transformed = tmdbService.transformMovie(item);
                if (transformed.poster && transformed.year) {
                  this.movies.set(item.id, transformed);
                }
              } else if (type === "tv" && !this.tvShows.has(item.id)) {
                const transformed = tmdbService.transformTVShow(item);
                if (transformed.poster && transformed.year) {
                  this.tvShows.set(item.id, transformed);
                }
              }
            }
          });
        });

        loaded += batch.length;
        this.loadProgress = (loaded / this.totalToLoad) * 100;
        onProgress(this.loadProgress, this.movies.size + this.tvShows.size);

        // Small delay to avoid rate limiting
        if (i + batchSize < fetchPromises.length) {
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    }

    this.isLoading = false;
    // console.log(`Loaded ${this.movies.size} movies and ${this.tvShows.size} TV shows`);
    return Array.from(this.movies.values());
  }

  // Quick load for initial experience — optimized for speed
  async quickLoad(onProgress = () => { }) {
    const QUICK_LIMITS = {
      popularMovies: 2,
      topRatedMovies: 1,
      popularTV: 2,
      topRatedTV: 1,
      animeByRegion: 1,
      animeMoviesByRegion: 1,
      kDrama: 1,
      regionalTV: 1
    };

    const allItems = [];

    try {
      // Phase 1: Fetch the most important content FAST (just popular movies + TV)
      const phase1 = [
        ...Array.from({ length: QUICK_LIMITS.popularMovies }, (_, i) =>
          tmdbService
            .getPopularMovies(i + 1)
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ),
        ...Array.from({ length: QUICK_LIMITS.popularTV }, (_, i) =>
          tmdbService
            .getPopularTVShows(i + 1)
            .then((d) => ({ type: "tv", results: d?.results || [] })),
        ),
      ];

      const phase1Results = await Promise.all(phase1);
      phase1Results.forEach((result) => {
        const { type, results: items } = result;
        if (items) {
          items.forEach((item) => {
            if (item && item.id) {
              if (type === "movie" && !this.movies.has(item.id)) {
                const transformed = tmdbService.transformMovie(item);
                if (transformed.poster && transformed.year) {
                  this.movies.set(item.id, transformed);
                  allItems.push(transformed);
                }
              } else if (type === "tv" && !this.tvShows.has(item.id)) {
                const transformed = tmdbService.transformTVShow(item);
                if (transformed.poster && transformed.year) {
                  this.tvShows.set(item.id, transformed);
                  allItems.push(transformed);
                }
              }
            }
          });
        }
      });

      onProgress(50, this.movies.size + this.tvShows.size);

      // Phase 2: Load remaining content in background (non-blocking)
      const phase2 = [
        // Top Rated Movies
        ...Array.from({ length: QUICK_LIMITS.topRatedMovies }, (_, i) =>
          tmdbService
            .getTopRatedMovies(i + 1)
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ),
        // International Movies - Bollywood
        ...Array.from({ length: 5 }, (_, i) =>
          tmdbService
            .discoverMovies({
              with_original_language: "hi",
              page: i + 1,
              sort_by: "popularity.desc",
            })
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ),
        // Korean Movies
        ...Array.from({ length: 5 }, (_, i) =>
          tmdbService
            .getMoviesByCountry("KR", i + 1)
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ),
        // Japanese Movies
        ...Array.from({ length: 5 }, (_, i) =>
          tmdbService
            .getMoviesByCountry("JP", i + 1)
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ),
        // French Movies
        ...Array.from({ length: 3 }, (_, i) =>
          tmdbService
            .getMoviesByCountry("FR", i + 1)
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ),
        // Spanish Movies
        ...Array.from({ length: 3 }, (_, i) =>
          tmdbService
            .getMoviesByCountry("ES", i + 1)
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ),
        // TV Shows
        ...Array.from({ length: QUICK_LIMITS.popularTV }, (_, i) =>
          tmdbService
            .getPopularTVShows(i + 1)
            .then((d) => ({ type: "tv", results: d?.results || [] })),
        ),
        ...Array.from({ length: QUICK_LIMITS.topRatedTV }, (_, i) =>
          tmdbService
            .getTopRatedTVShows(i + 1)
            .then((d) => ({ type: "tv", results: d?.results || [] })),
        ),
        // Anime
        ...["JP", "US", "KR", "CN", "HK", "TW"].flatMap((region) =>
          Array.from({ length: QUICK_LIMITS.animeByRegion }, (_, i) =>
            tmdbService
              .getAnimeByRegion(region, i + 1)
              .then((d) => ({ type: "tv", results: d?.results || [] })),
          ),
        ),
        ...["JP", "US", "KR", "CN", "HK", "TW"].flatMap((region) =>
          Array.from({ length: QUICK_LIMITS.animeMoviesByRegion }, (_, i) =>
            tmdbService
              .getAnimeMoviesByRegion(region, i + 1)
              .then((d) => ({ type: "movie", results: d?.results || [] })),
          ),
        ),
        // Korean Dramas
        ...Array.from({ length: QUICK_LIMITS.kDrama }, (_, i) =>
          tmdbService
            .discoverTV({
              with_origin_country: "KR",
              page: i + 1,
              sort_by: "popularity.desc",
            })
            .then((d) => ({ type: "tv", results: d?.results || [] })),
        ),
        // Turkish Dramas
        ...Array.from({ length: QUICK_LIMITS.regionalTV }, (_, i) =>
          tmdbService
            .discoverTV({
              with_origin_country: "TR",
              page: i + 1,
              sort_by: "popularity.desc",
            })
            .then((d) => ({ type: "tv", results: d?.results || [] })),
        ),
        // Indian Shows
        ...Array.from({ length: QUICK_LIMITS.regionalTV }, (_, i) =>
          tmdbService
            .discoverTV({
              with_origin_country: "IN",
              page: i + 1,
              sort_by: "popularity.desc",
            })
            .then((d) => ({ type: "tv", results: d?.results || [] })),
        ),
        // Targeted titles
        ...TARGET_TITLES.flatMap((title) => [
          tmdbService
            .searchTVShows(title, 1)
            .then((d) => ({ type: "tv", results: d?.results || [] })),
          tmdbService
            .searchMovies(title, 1)
            .then((d) => ({ type: "movie", results: d?.results || [] })),
        ]),
      ];

      const phase2Results = await Promise.all(phase2);

      phase2Results.forEach((result) => {
        const { type, results: items } = result;
        if (items) {
          items.forEach((item) => {
            if (item && item.id) {
              if (type === "movie" && !this.movies.has(item.id)) {
                const transformed = tmdbService.transformMovie(item);
                if (transformed.poster && transformed.year) {
                  this.movies.set(item.id, transformed);
                  allItems.push(transformed);
                }
              } else if (type === "tv" && !this.tvShows.has(item.id)) {
                const transformed = tmdbService.transformTVShow(item);
                if (transformed.poster && transformed.year) {
                  this.tvShows.set(item.id, transformed);
                  allItems.push(transformed);
                }
              }
            }
          });
        }
      });

      onProgress(100, this.movies.size + this.tvShows.size);
    } catch (error) {
      console.error("Quick load error:", error);
    }

    return allItems;
  }

  // Get all loaded content (movies + TV shows)
  getAllMovies() {
    return [
      ...Array.from(this.movies.values()),
      ...Array.from(this.tvShows.values()),
    ];
  }

  // Get only movies
  getMoviesOnly() {
    return Array.from(this.movies.values());
  }

  // Get only TV shows
  getTVShowsOnly() {
    return Array.from(this.tvShows.values());
  }

  // Get only anime
  getAnimeOnly() {
    return Array.from(this.tvShows.values()).filter(
      (s) => s.contentType === "anime",
    );
  }

  // Get movie by ID
  getMovie(id) {
    return (
      this.movies.get(parseInt(id)) ||
      this.tvShows.get(parseInt(id.replace("tv-", "")))
    );
  }

  // Get content count
  getCount() {
    return this.movies.size + this.tvShows.size;
  }
}

// Singleton instance
export const movieDatabase = new MovieDatabase();
export default movieDatabase;
