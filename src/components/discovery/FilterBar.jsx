import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Advanced Filter Bar for Discovery view
 */
const FilterBar = ({
    isOpen,
    filters,
    setFilters,
    genres,
    showAllMovies,
    setShowAllMovies,
    clearFilters,
}) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/5 overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent"
            >
                <div className="p-4 md:p-6 flex flex-wrap gap-3">
                    {/* Content Type */}
                    <select
                        value={filters.contentType}
                        onChange={(e) => setFilters({ ...filters, contentType: e.target.value })}
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 outline-none text-sm text-white cursor-pointer hover:border-cyan-500 transition-colors [&>option]:bg-[#1a1a1a]"
                    >
                        <option value="">All Types</option>
                        <option value="movie">🎬 Movies</option>
                        <option value="series">📺 TV Series</option>
                        <option value="anime">🎌 Anime</option>
                    </select>

                    {/* Genre */}
                    <select
                        value={filters.genre}
                        onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 outline-none text-sm text-white cursor-pointer hover:border-cyan-500 transition-colors [&>option]:bg-[#1a1a1a]"
                    >
                        <option value="">All Genres</option>
                        {genres.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>

                    {/* Year */}
                    <select
                        value={filters.minYear}
                        onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 outline-none text-sm text-white cursor-pointer hover:border-cyan-500 transition-colors [&>option]:bg-[#1a1a1a]"
                    >
                        <option value="">All Years</option>
                        {[2024, 2020, 2010, 2000, 1990, 1980, 1970].map((y) => (
                            <option key={y} value={y}>{y}+</option>
                        ))}
                    </select>

                    {/* Rating */}
                    <select
                        value={filters.minRating}
                        onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 outline-none text-sm text-white cursor-pointer hover:border-cyan-500 transition-colors [&>option]:bg-[#1a1a1a]"
                    >
                        <option value="">All Ratings</option>
                        {[9, 8, 7, 6, 5].map((r) => (
                            <option key={r} value={r}>{r}+ IMDb</option>
                        ))}
                    </select>

                    {/* Language */}
                    <select
                        value={filters.language || ""}
                        onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                        className="bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 outline-none text-sm text-white cursor-pointer hover:border-cyan-500 transition-colors [&>option]:bg-[#1a1a1a]"
                    >
                        <option value="">All Languages</option>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ko">Korean</option>
                        <option value="ja">Japanese</option>
                        <option value="zh">Chinese</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="ru">Russian</option>
                        <option value="tr">Turkish</option>
                        <option value="th">Thai</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                        <option value="ml">Malayalam</option>
                        <option value="ar">Arabic</option>
                        <option value="id">Indonesian</option>
                        <option value="vi">Vietnamese</option>
                        <option value="pl">Polish</option>
                    </select>

                    {/* Browse All Toggle */}
                    <button
                        onClick={() => setShowAllMovies(!showAllMovies)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${showAllMovies
                            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 font-bold"
                            : "bg-[#1a1a1a] border border-white/10 hover:border-cyan-500"
                            }`}
                    >
                        {showAllMovies ? "Showing All" : "Browse All"}
                    </button>

                    {/* Clear Button */}
                    <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm hover:border-red-500 hover:bg-red-500/10 transition-all"
                    >
                        Clear Filters
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default FilterBar;
