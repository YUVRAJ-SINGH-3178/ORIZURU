// Optimized Countries list - Focus on major markets to prevent API overload
const COUNTRIES = [
    "US", "GB", "FR", "DE", "IT", "ES", "JP", "KR", "CN", "IN",
    "MX", "BR", "CA", "AU", "RU", "SE", "NO", "FI", "HK", "TW"
];

// Optimized Languages list
const LANGUAGES = ["en", "hi", "ko", "ja", "zh", "es", "fr", "de", "it", "ru", "ta", "te"];

// Optimized Page Limits - More aggressive capping for stability
const PAGE_LIMITS = {
    popularMovies: 30,
    topRatedMovies: 30,
    nowPlaying: 15,
    upcoming: 15,
    moviesByGenre: 10,
    moviesByCountry: 3,   // Reduced from 10
    moviesByLanguage: 5,  // Reduced from 10
    moviesByDecade: 5,    // Reduced from 10
    popularTV: 20,
    topRatedTV: 20,
    animeByRegion: 25,
    animeMoviesByRegion: 20,
    kDrama: 30,
    cDrama: 15,
    regionalTV: 15,
    tvByGenre: 10,
    onAirTV: 15,
    voteCountMovies: 25,
    highRatedMovies: 20,
};
