import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "../context/ToastContext";

/**
 * Storage Helper
 */
const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(`orizuru_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(`orizuru_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn("Storage error", e);
        }
    },
};

/**
 * Hook for Discovery Page Logic
 */
export function useDiscovery({
    initialMovies,
    allMovies,
    onThemeChange,
    recMode: parentRecMode,
    setRecMode: setParentRecMode
}) {
    const [selected, setSelected] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showWatchlist, setShowWatchlist] = useState(false);
    const [showWatchHistory, setShowWatchHistory] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showAllMovies, setShowAllMovies] = useState(false);

    const [filters, setFilters] = useState({
        genre: "",
        minYear: "",
        minRating: "",
        contentType: "",
        language: "",
    });

    const [preferences, setPreferences] = useState(() => {
        const basePrefs = {
            theme: "editorial",
            defaultLanguage: "",
            showAdultContent: true,
            preferredContentTypes: { movie: true, series: true, anime: true },
            autoplayTrailers: false,
            darkMode: true,
            notifications: true,
        };
        const savedPrefs = storage.get("preferences");
        if (!savedPrefs) return basePrefs;
        return {
            ...basePrefs,
            ...savedPrefs,
            preferredContentTypes: {
                ...basePrefs.preferredContentTypes,
                ...(savedPrefs.preferredContentTypes || {}),
            },
        };
    });

    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [showShareWatchlistModal, setShowShareWatchlistModal] = useState(false);
    const [watchlistCopySuccess, setWatchlistCopySuccess] = useState(false);

    const { addToast } = useToast();

    const applyPreferences = useCallback((nextPrefs) => {
        setPreferences(nextPrefs);
        storage.set("preferences", nextPrefs);
        if (nextPrefs?.theme) {
            onThemeChange?.(nextPrefs.theme);
        }
    }, [onThemeChange]);

    // Filtering Logic
    const displayMovies = useMemo(() => {
        let list = showAllMovies ? allMovies : initialMovies;
        if (!list) return [];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(m =>
                m.title.toLowerCase().includes(q) ||
                m.genres.some(g => g.toLowerCase().includes(q))
            );
        }

        if (filters.genre) {
            list = list.filter(m => m.genres.includes(filters.genre));
        }

        if (filters.contentType) {
            list = list.filter(m => m.contentType === filters.contentType);
        }

        if (filters.minYear) {
            list = list.filter(m => parseInt(m.year) >= parseInt(filters.minYear));
        }

        if (filters.minRating) {
            list = list.filter(m => parseFloat(m.imdb) >= parseFloat(filters.minRating));
        }

        if (filters.language) {
            list = list.filter(m => m.language === filters.language);
        }

        return list;
    }, [showAllMovies, allMovies, initialMovies, searchQuery, filters]);

    // Simulate loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [initialMovies, filters, searchQuery, showAllMovies]);

    const handleRefreshClick = useCallback(async (onRefresh) => {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
        addToast("Refreshed with new personalized picks!", "success");
    }, [addToast]);

    const clearFilters = useCallback(() => {
        setFilters({
            genre: "",
            minYear: "",
            minRating: "",
            contentType: "",
            language: "",
        });
        setSearchQuery("");
        setShowAllMovies(false);
    }, []);

    return {
        selected, setSelected,
        similarMovies, setSimilarMovies,
        searchQuery, setSearchQuery,
        showFilters, setShowFilters,
        showUserMenu, setShowUserMenu,
        showWatchlist, setShowWatchlist,
        showWatchHistory, setShowWatchHistory,
        showPreferences, setShowPreferences,
        isLoading, setIsLoading,
        isRefreshing, setIsRefreshing,
        showAllMovies, setShowAllMovies,
        filters, setFilters,
        preferences, applyPreferences,
        displayMovies,
        handleRefreshClick,
        clearFilters,
        newsletterEmail, setNewsletterEmail,
        newsletterSubmitted, setNewsletterSubmitted,
        showNewsletterModal, setShowNewsletterModal,
        showShareWatchlistModal, setShowShareWatchlistModal,
        watchlistCopySuccess, setWatchlistCopySuccess,
        storage
    };
}
