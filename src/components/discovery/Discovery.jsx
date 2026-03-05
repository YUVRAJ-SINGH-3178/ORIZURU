import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Search, RefreshCw, Wand2, Star } from "lucide-react";

// Components
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import FilterBar from "./FilterBar";
import MovieCard from "./MovieCard";
import MovieRowCard from "./MovieRowCard";
import MovieDetailModal from "./MovieDetailModal";
import { WatchlistSlideout, WatchHistorySlideout, PreferencesModal } from "../layout/Slideouts";
import { NewsletterModal, ShareWatchlistModal } from "../common/GlobalModals";
import SkeletonCard from "../common/SkeletonCard";

// Hooks
import { useDiscovery } from "../../hooks/useDiscovery";
import { useToast } from "../../context/ToastContext";

/**
 * Main Discovery Interface
 */
const Discovery = ({
    movies,
    allMovies,
    user,
    onLogout,
    onRefresh,
    onRetakeQuiz,
    recMode,
    setRecMode,
    similarSource,
    selectedGenres,
    setSelectedGenres,
    setView,
    watchlist,
    onToggleWatchlist,
    recentlyViewed,
    onThemeChange,
    watchHistory,
    onMarkWatched,
    onRemoveWatched,
    setShowOnboarding,
    setShowAbout,
    setShowPrivacy,
    setShowTerms,
    setShowContact,
}) => {
    const { addToast } = useToast();

    const {
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
    } = useDiscovery({
        initialMovies: movies,
        allMovies,
        onThemeChange,
        recMode,
        setRecMode
    });

    const getRecommendationTitle = () => {
        if (showAllMovies) return "All Content Library";
        if (searchQuery) return `Search: "${searchQuery}"`;
        if (recMode === "similar") return `Similar to ${similarSource?.title || "selected"}`;
        if (recMode === "genre") return "Genre-based Top Picks";
        if (recMode === "quiz") return "Your AI Vector Picks";
        if (recMode === "trending") return "Trending Now";
        return "Universal Discovery";
    };

    const menuProps = {
        showUserMenu, setShowUserMenu,
        watchlist, watchHistory, recentlyViewed,
        onOpenPreferences: () => { setShowPreferences(true); setShowUserMenu(false); },
        onOpenOnboarding: () => { setShowOnboarding(true); setShowUserMenu(false); },
        onOpenAbout: () => { setShowAbout(true); setShowUserMenu(false); },
        onOpenContact: () => { setShowContact(true); setShowUserMenu(false); },
        onOpenPrivacy: () => { setShowPrivacy(true); setShowUserMenu(false); },
        onOpenTerms: () => { setShowTerms(true); setShowUserMenu(false); },
        onOpenHistory: () => { setShowWatchHistory(true); setShowUserMenu(false); },
        onLogout,
        onDeleteAccount: async () => {
            if (window.confirm("Permanently delete account? This cannot be undone.")) {
                try {
                    const { supabase } = await import("../../services/supabase");
                    await supabase.from("watchlist").delete().eq("user_id", user.id);
                    await supabase.from("watch_history").delete().eq("user_id", user.id);
                    await supabase.auth.admin?.deleteUser(user.id);
                    await onLogout();
                } catch {
                    alert("Could not fully delete from cloud. Local session cleared.");
                    await onLogout();
                }
            }
        }
    };

    const themeOptions = [
        { key: "editorial", label: "Editorial Warm", desc: "Warm and organic", swatch: "linear-gradient(135deg, #d97736, #6f7b5e)" },
        { key: "experimental", label: "Experimental Flux", desc: "Neon and vibrant", swatch: "linear-gradient(135deg, #b7ff3c, #32f5ff)" },
        { key: "batman", label: "Gotham Noir", desc: "Midnight and yellow", swatch: "linear-gradient(135deg, #0a0b0d, #f2c94c)" },
        { key: "matte", label: "Dark Matte", desc: "Minimal and flat", swatch: "linear-gradient(135deg, #020308, #111827)" },
    ];

    const shareText = `My ORIZURU watchlist:\n${watchlist.slice(0, 10).map((m, i) => `${i + 1}. ${m.title}`).join("\n")}`;

    const genres = useMemo(() => {
        const s = new Set();
        allMovies.forEach(m => m.genres.forEach(g => s.add(g)));
        return Array.from(s).sort();
    }, [allMovies]);

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <Navbar
                user={user}
                allMoviesCount={allMovies.length}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showWatchlist={showWatchlist}
                setShowWatchlist={setShowWatchlist}
                watchlistCount={watchlist.length}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                isRefreshing={isRefreshing}
                onRefresh={() => handleRefreshClick(onRefresh)}
                onRetakeQuiz={onRetakeQuiz}
                onLogoClick={() => {
                    setRecMode("trending");
                    clearFilters();
                }}
                userMenuProps={menuProps}
            />

            <FilterBar
                isOpen={showFilters}
                filters={filters}
                setFilters={setFilters}
                genres={genres}
                showAllMovies={showAllMovies}
                setShowAllMovies={setShowAllMovies}
                clearFilters={clearFilters}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {!searchQuery && !showAllMovies && (
                    <div className="p-6 md:p-12 pb-0">
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-2 text-white">{getRecommendationTitle()}</h2>
                        <p className="text-white/40 text-sm max-w-2xl">
                            {recMode === "quiz" && "AI-curated matches based on your unique personality vector."}
                            {recMode === "genre" && "Top picks from your selected genres."}
                            {recMode === "trending" && "The most popular titles in our library right now."}
                        </p>
                    </div>
                )}

                {/* Movie Grid */}
                <main className="p-6 md:p-12">
                    {preferences.theme === "matte" ? (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {isLoading
                                ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                                : displayMovies.map((m, i) => (
                                    <MovieRowCard
                                        key={m.id}
                                        movie={m}
                                        index={i}
                                        onClick={() => setSelected(m)}
                                        isInWatchlist={watchlist.some(w => w.id === m.id)}
                                        onToggleWatchlist={onToggleWatchlist}
                                    />
                                ))
                            }
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
                            {isLoading
                                ? [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
                                : displayMovies.map((m, i) => (
                                    <MovieCard
                                        key={m.id}
                                        movie={m}
                                        index={i}
                                        theme={preferences.theme}
                                        onClick={() => setSelected(m)}
                                        isInWatchlist={watchlist.some(w => w.id === m.id)}
                                        onToggleWatchlist={onToggleWatchlist}
                                        showMatchScore={recMode !== "trending"}
                                    />
                                ))
                            }
                        </div>
                    )}

                    {!isLoading && displayMovies.length === 0 && (
                        <div className="text-center py-24">
                            <Film size={64} className="mx-auto text-white/10 mb-6" />
                            <p className="text-white/30 text-xl">No titles found. Try adjusting your filters.</p>
                            <button onClick={clearFilters} className="mt-4 text-orange-500 font-bold hover:underline">Clear all filters</button>
                        </div>
                    )}
                </main>
            </div>

            <Footer
                onOpenAbout={() => setShowAbout(true)}
                onOpenContact={() => setShowContact(true)}
                onOpenPrivacy={() => setShowPrivacy(true)}
                onOpenTerms={() => setShowTerms(true)}
                onOpenNewsletter={() => setShowNewsletterModal(true)}
                onOpenShareWatchlist={() => setShowShareWatchlistModal(true)}
                handleDiscoverShortcut={({ mode, genre, contentType, minRating, minYear }) => {
                    setRecMode(mode);
                    setFilters(f => ({ ...f, genre: genre || "", contentType: contentType || "", minRating: minRating || "", minYear: minYear || "" }));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            />

            {/* Slideouts */}
            <WatchlistSlideout
                isOpen={showWatchlist}
                onClose={() => setShowWatchlist(false)}
                watchlist={watchlist}
                onToggleWatchlist={onToggleWatchlist}
                onSelectMovie={setSelected}
            />
            <WatchHistorySlideout
                isOpen={showWatchHistory}
                onClose={() => setShowWatchHistory(false)}
                watchHistory={watchHistory}
                onRemoveWatched={onRemoveWatched}
                onSelectMovie={setSelected}
            />
            <PreferencesModal
                isOpen={showPreferences}
                onClose={() => setShowPreferences(false)}
                preferences={preferences}
                applyPreferences={applyPreferences}
                themeOptions={themeOptions}
            />

            {/* Global Modals */}
            <NewsletterModal
                isOpen={showNewsletterModal}
                onClose={() => setShowNewsletterModal(false)}
                email={newsletterEmail}
                setEmail={setNewsletterEmail}
                isSubmitted={newsletterSubmitted}
                onSubmit={(email) => {
                    setNewsletterSubmitted(true);
                    storage.set("newsletterEmail", email);
                    addToast("Subscribed! 🎬", "success");
                }}
            />
            <ShareWatchlistModal
                isOpen={showShareWatchlistModal}
                onClose={() => setShowShareWatchlistModal(false)}
                items={watchlist}
                shareText={shareText}
                isCopied={watchlistCopySuccess}
                onCopy={() => {
                    navigator.clipboard.writeText(shareText);
                    setWatchlistCopySuccess(true);
                    addToast("Copied to clipboard!", "success");
                }}
            />

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <MovieDetailModal
                        movie={selected}
                        onClose={() => setSelected(null)}
                        isInWatchlist={watchlist.some(w => w.id === selected.id)}
                        onToggleWatchlist={onToggleWatchlist}
                        isWatched={watchHistory.some(h => h.id === selected.id)}
                        onMarkWatched={onMarkWatched}
                        onRemoveWatched={onRemoveWatched}
                        similarMovies={allMovies.filter(m => m.id !== selected.id && m.genres.some(g => selected.genres.includes(g))).slice(0, 10)}
                        onSelectMovie={setSelected}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Discovery;
