import React from "react";
import { Search, Bookmark, Filter, RefreshCw, Wand2, Film } from "lucide-react";
import UserMenu from "./UserMenu";

/**
 * Main Application Navbar
 */
const Navbar = ({
    user,
    allMoviesCount,
    searchQuery,
    setSearchQuery,
    showWatchlist,
    setShowWatchlist,
    watchlistCount,
    showFilters,
    setShowFilters,
    isRefreshing,
    onRefresh,
    onRetakeQuiz,
    onLogoClick,
    userMenuProps,
}) => (
    <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 p-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-8">
            {/* Brand */}
            <button
                onClick={onLogoClick}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer relative z-50"
            >
                <img src="/orizuru-logo-2d.png" alt="ORIZURU" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-orange-500/25" />
                <span className="text-xl md:text-2xl font-black italic tracking-tighter bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    ORIZURU
                </span>
            </button>

            {/* Stats - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-white/5 to-white/10 rounded-full text-[10px] font-bold text-white/50 uppercase border border-white/5">
                <Film size={12} />
                {allMoviesCount.toLocaleString()} Titles
            </div>
        </div>

        {/* Search - Hidden on small mobile */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                    type="text"
                    placeholder="Search movies, genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full input-base py-3 pl-12 pr-4 text-sm placeholder:text-white/30"
                />
            </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
            {/* Watchlist Button */}
            <button
                onClick={() => setShowWatchlist(!showWatchlist)}
                className={`relative p-3 rounded-xl transition-all group ${showWatchlist ? "bg-orange-500 shadow-lg shadow-orange-500/30 text-white" : "hover:bg-white/10 border border-transparent hover:border-white/10"}`}
            >
                <Bookmark size={18} className="group-hover:scale-110 transition-transform" />
                {watchlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                        {watchlistCount}
                    </span>
                )}
            </button>

            {/* Filter Toggle */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl transition-all group ${showFilters ? "bg-emerald-600 shadow-lg shadow-emerald-700/30 text-white" : "hover:bg-white/10 border border-transparent hover:border-white/10"}`}
            >
                <Filter size={18} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Desktop Actions */}
            <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${isRefreshing
                    ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-orange-500/20 hover:-translate-y-0.5"}`}
            >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                New Picks
            </button>

            <button
                onClick={onRetakeQuiz}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all font-bold text-sm group active:scale-95"
            >
                <Wand2 size={16} className="group-hover:rotate-12 transition-transform text-orange-500" />
                Change Method
            </button>

            {/* User Menu */}
            <UserMenu {...userMenuProps} user={user} />
        </div>
    </nav>
);

export default Navbar;
