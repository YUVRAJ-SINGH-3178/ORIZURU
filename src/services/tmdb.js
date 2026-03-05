// TMDB API Service - Free Movie Database
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "2dca580c2a14b55200e784d157207b4d"; // Public fallback
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Genre mapping from TMDB (Movies)
const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Genre mapping for TV Shows
const TV_GENRE_MAP = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

// Streaming service logos/names (expanded globally)
const STREAMING_SERVICES = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "Max",
  "Hulu",
  "Apple TV+",
  "Paramount+",
  "Peacock",
  "Crunchyroll",
  "Hotstar",
  "Zee5",
  "Viki",
  "iQIYI",
  "WeTV",
  "Viu",
  "MUBI",
  "Shudder",
  "Tubi",
  "Pluto TV",
];

const ANIME_REGIONS = ["JP", "KR", "CN", "US", "HK", "TW"];

export const tmdbService = {
  // Get poster URL
  getPosterUrl: (path, size = "w500") => {
    if (!path)
      return "https://via.placeholder.com/500x750/1a1a1a/666?text=No+Poster";
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },

  // Get backdrop URL
  getBackdropUrl: (path, size = "w1280") => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },

  // Fetch movies from a specific endpoint (with adult content support)
  fetchMovies: async (endpoint, params = {}) => {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      include_adult: "true", // Include adult content
      ...params,
    });

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}${endpoint}?${queryParams}`
      );
      if (!response.ok) throw new Error("TMDB API Error");
      return await response.json();
    } catch (error) {
      console.error("TMDB Fetch Error:", error);
      return null;
    }
  },

  // Get movie details with reviews
  getMovieDetails: async (movieId) => {
    return tmdbService.fetchMovies(`/movie/${movieId}`, {
      append_to_response: "reviews,credits,watch/providers,recommendations",
    });
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    return tmdbService.fetchMovies("/search/movie", { query, page });
  },

  // Search TV shows
  searchTVShows: async (query, page = 1) => {
    return tmdbService.fetchMovies("/search/tv", { query, page });
  },

  // Get movies by various categories
  getPopularMovies: (page = 1) =>
    tmdbService.fetchMovies("/movie/popular", { page }),
  getTopRatedMovies: (page = 1) =>
    tmdbService.fetchMovies("/movie/top_rated", { page }),
  getNowPlayingMovies: (page = 1) =>
    tmdbService.fetchMovies("/movie/now_playing", { page }),
  getUpcomingMovies: (page = 1) =>
    tmdbService.fetchMovies("/movie/upcoming", { page }),

  // TV Series endpoints
  getPopularTVShows: (page = 1) =>
    tmdbService.fetchMovies("/tv/popular", { page }),
  getTopRatedTVShows: (page = 1) =>
    tmdbService.fetchMovies("/tv/top_rated", { page }),
  getOnAirTVShows: (page = 1) =>
    tmdbService.fetchMovies("/tv/on_the_air", { page }),

  // Discover TV with filters
  discoverTV: (params = {}) => tmdbService.fetchMovies("/discover/tv", params),

  // Get anime (Animation genre by region)
  getAnime: (page = 1) => tmdbService.getAnimeByRegion("JP", page),

  getAnimeByRegion: (country, page = 1) =>
    tmdbService.fetchMovies("/discover/tv", {
      with_genres: 16,
      with_origin_country: country,
      page,
      sort_by: "popularity.desc",
    }),

  getAnimeMoviesByRegion: (country, page = 1) =>
    tmdbService.fetchMovies("/discover/movie", {
      with_genres: 16,
      with_origin_country: country,
      page,
      sort_by: "popularity.desc",
    }),

  // Get TV by genre
  getTVByGenre: (genreId, page = 1) =>
    tmdbService.fetchMovies("/discover/tv", {
      with_genres: genreId,
      page,
      sort_by: "popularity.desc",
    }),

  // Discover movies with filters
  discoverMovies: (params = {}) =>
    tmdbService.fetchMovies("/discover/movie", params),

  // Get movies by genre
  getMoviesByGenre: (genreId, page = 1) =>
    tmdbService.fetchMovies("/discover/movie", {
      with_genres: genreId,
      page,
      sort_by: "popularity.desc",
    }),

  // Get movies by country
  getMoviesByCountry: (countryCode, page = 1) =>
    tmdbService.fetchMovies("/discover/movie", {
      with_origin_country: countryCode,
      page,
      sort_by: "popularity.desc",
    }),

  // Get movies by decade
  getMoviesByDecade: (startYear, endYear, page = 1) =>
    tmdbService.fetchMovies("/discover/movie", {
      "primary_release_date.gte": `${startYear}-01-01`,
      "primary_release_date.lte": `${endYear}-12-31`,
      page,
      sort_by: "popularity.desc",
    }),

  // Transform TMDB movie to our format
  transformMovie: (movie, index = 0) => {
    const genres = (movie.genre_ids || [])
      .map((id) => GENRE_MAP[id])
      .filter(Boolean);
    if (movie.genres) {
      genres.push(...movie.genres.map((g) => g.name));
    }

    // Generate a pseudo-random vector based on movie properties for recommendation
    const vec = generateMovieVector(movie);

    // Random streaming services (2-3) based on region
    const numServices = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...STREAMING_SERVICES].sort(() => 0.5 - Math.random());
    const streaming = shuffled.slice(0, numServices);

    // Determine origin country
    const originCountry =
      movie.production_countries?.[0]?.iso_3166_1 ||
      (movie.original_language === "en"
        ? "US"
        : movie.original_language === "hi"
          ? "IN"
          : movie.original_language === "ko"
            ? "KR"
            : movie.original_language === "ja"
              ? "JP"
              : movie.original_language === "zh"
                ? "CN"
                : movie.original_language === "es"
                  ? "ES"
                  : movie.original_language === "fr"
                    ? "FR"
                    : "US");

    return {
      id: movie.id.toString(),
      title: movie.title,
      originalTitle: movie.original_title,
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : null,
      releaseDate: movie.release_date,
      pop: movie.popularity / 1000, // Normalize popularity
      popularity: movie.popularity,
      contentType: "movie",
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      genres: [...new Set(genres)].slice(0, 3),
      vec,
      synopsis: movie.overview || "No synopsis available.",
      accent: getAccentColor(genres[0]),
      imdb: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
      rt: movie.vote_average
        ? `${Math.round(movie.vote_average * 10)}%`
        : "N/A",
      meta: movie.vote_average ? Math.round(movie.vote_average * 10) : "N/A",
      poster: tmdbService.getPosterUrl(movie.poster_path),
      backdrop: tmdbService.getBackdropUrl(movie.backdrop_path),
      streaming,
      watchUrl: `https://www.google.com/search?q=where+to+watch+${encodeURIComponent(
        movie.title
      )}`,
      language: movie.original_language,
      originCountry,
      adult: movie.adult,
      reviews: movie.reviews?.results || [],
    };
  },

  // Transform TMDB TV show to our format
  transformTVShow: (show, index = 0) => {
    const genres = (show.genre_ids || [])
      .map((id) => TV_GENRE_MAP[id] || GENRE_MAP[id])
      .filter(Boolean);
    if (show.genres) {
      genres.push(...show.genres.map((g) => g.name));
    }

    // Check if it's anime (animation from key regions)
    const originRegion = show.origin_country?.[0];
    const isAnime =
      ANIME_REGIONS.includes(originRegion) &&
      (show.genre_ids?.includes(16) || genres.includes("Animation"));

    // Determine origin country
    const originCountry =
      originRegion ||
      (show.original_language === "ko"
        ? "KR"
        : show.original_language === "ja"
          ? "JP"
          : show.original_language === "zh"
            ? "CN"
            : show.original_language === "hi"
              ? "IN"
              : show.original_language === "tr"
                ? "TR"
                : "US");

    // Generate vector for TV show
    const vec = generateTVVector(show, isAnime);

    // Random streaming services (2-3)
    const numServices = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...STREAMING_SERVICES].sort(() => 0.5 - Math.random());
    const streaming = shuffled.slice(0, numServices);

    return {
      id: `tv-${show.id}`,
      title: show.name,
      originalTitle: show.original_name,
      year: show.first_air_date
        ? new Date(show.first_air_date).getFullYear()
        : null,
      releaseDate: show.first_air_date,
      pop: show.popularity / 1000,
      popularity: show.popularity,
      contentType: isAnime ? "anime" : "series",
      voteAverage: show.vote_average,
      voteCount: show.vote_count,
      genres: [...new Set(isAnime ? ["Anime", ...genres] : genres)].slice(0, 3),
      vec,
      synopsis: show.overview || "No synopsis available.",
      accent: getAccentColor(genres[0]),
      imdb: show.vote_average ? show.vote_average.toFixed(1) : "N/A",
      rt: show.vote_average ? `${Math.round(show.vote_average * 10)}%` : "N/A",
      meta: show.vote_average ? Math.round(show.vote_average * 10) : "N/A",
      poster: tmdbService.getPosterUrl(show.poster_path),
      backdrop: tmdbService.getBackdropUrl(show.backdrop_path),
      streaming,
      originCountry,
      watchUrl: `https://www.google.com/search?q=where+to+watch+${encodeURIComponent(
        show.name
      )}`,
      language: show.original_language,
      adult: false,
      reviews: show.reviews?.results || [],
    };
  },
};

// Generate a 8D vector for movie recommendations based on characteristics
function generateMovieVector(movie) {
  const genres = movie.genre_ids || (movie.genres || []).map((g) => g.id);

  // Dimension 1: Action/Adventure vs Drama/Romance (-1 to 1)
  let d1 = 0;
  if (genres.includes(28) || genres.includes(12)) d1 += 0.8;
  if (genres.includes(18) || genres.includes(10749)) d1 -= 0.7;

  // Dimension 2: Comedy vs Serious (-1 to 1)
  let d2 = genres.includes(35) ? 0.8 : -0.3;
  if (genres.includes(18) || genres.includes(53)) d2 -= 0.5;

  // Dimension 3: Fantasy/Sci-Fi vs Realistic (-1 to 1)
  let d3 = 0;
  if (genres.includes(14) || genres.includes(878)) d3 += 0.9;
  if (genres.includes(99) || genres.includes(36)) d3 -= 0.8;

  // Dimension 4: Intensity (based on genre mix)
  let d4 = 0;
  if (genres.includes(27) || genres.includes(53) || genres.includes(28))
    d4 += 0.7;
  if (genres.includes(10751) || genres.includes(35)) d4 -= 0.5;

  // Dimension 5: Artistic/Indie vs Mainstream (based on popularity)
  let d5 = movie.popularity > 100 ? 0.6 : -0.4;
  if (genres.includes(99)) d5 -= 0.6;

  // Dimension 6: Modern vs Classic (based on year)
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 2020;
  let d6 = (year - 1990) / 40; // Normalize to roughly -0.5 to 1

  // Dimension 7: Content type preference (movie = -0.8)
  let d7 = -0.8;

  // Dimension 8: Animation preference
  let d8 = genres.includes(16) ? 0.9 : -0.3;

  return [
    Math.max(-1, Math.min(1, d1)),
    Math.max(-1, Math.min(1, d2)),
    Math.max(-1, Math.min(1, d3)),
    Math.max(-1, Math.min(1, d4)),
    Math.max(-1, Math.min(1, d5)),
    Math.max(-1, Math.min(1, d6)),
    Math.max(-1, Math.min(1, d7)),
    Math.max(-1, Math.min(1, d8)),
  ];
}

// Generate vector for TV shows
function generateTVVector(show, isAnime = false) {
  const genres = show.genre_ids || (show.genres || []).map((g) => g.id);

  // Dimension 1: Action vs Drama
  let d1 = 0;
  if (genres.includes(10759)) d1 += 0.8; // Action & Adventure
  if (genres.includes(18)) d1 -= 0.7;

  // Dimension 2: Comedy vs Serious
  let d2 = genres.includes(35) ? 0.8 : -0.3;
  if (genres.includes(18) || genres.includes(80)) d2 -= 0.5;

  // Dimension 3: Fantasy/Sci-Fi vs Realistic
  let d3 = 0;
  if (genres.includes(10765)) d3 += 0.9; // Sci-Fi & Fantasy
  if (genres.includes(99) || genres.includes(10763)) d3 -= 0.8;

  // Dimension 4: Intensity
  let d4 = 0;
  if (genres.includes(80) || genres.includes(10768)) d4 += 0.7;
  if (genres.includes(10751) || genres.includes(35)) d4 -= 0.5;

  // Dimension 5: Mainstream vs Niche
  let d5 = show.popularity > 100 ? 0.6 : -0.4;
  if (genres.includes(99)) d5 -= 0.6;

  // Dimension 6: Modern vs Classic
  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : 2020;
  let d6 = (year - 1990) / 40;

  // Dimension 7: Content type (series = 0.5, anime = 0.9)
  let d7 = isAnime ? 0.9 : 0.5;

  // Dimension 8: Animation preference
  let d8 = genres.includes(16) || isAnime ? 0.9 : -0.3;

  return [
    Math.max(-1, Math.min(1, d1)),
    Math.max(-1, Math.min(1, d2)),
    Math.max(-1, Math.min(1, d3)),
    Math.max(-1, Math.min(1, d4)),
    Math.max(-1, Math.min(1, d5)),
    Math.max(-1, Math.min(1, d6)),
    Math.max(-1, Math.min(1, d7)),
    Math.max(-1, Math.min(1, d8)),
  ];
}

// Get accent color based on genre
function getAccentColor(genre) {
  const colors = {
    Action: "#EF4444",
    Adventure: "#F97316",
    Animation: "#8B5CF6",
    Comedy: "#EAB308",
    Crime: "#6B7280",
    Documentary: "#10B981",
    Drama: "#F472B6",
    Family: "#06B6D4",
    Fantasy: "#A855F7",
    History: "#92400E",
    Horror: "#DC2626",
    Music: "#EC4899",
    Mystery: "#6366F1",
    Romance: "#F472B6",
    "Sci-Fi": "#3B82F6",
    Thriller: "#7C3AED",
    War: "#78716C",
    Western: "#D97706",
  };
  return colors[genre] || "#F97316";
}

export default tmdbService;
