import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck, Play, Sparkles, Tv } from "lucide-react";

/**
 * Modern Movie Card with Multiple Themes
 */
const MovieCard = ({
    movie,
    index,
    onClick,
    isInWatchlist,
    onToggleWatchlist,
    theme = "editorial",
    showMatchScore = true,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Smooth entry animation based on index
    const animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
            delay: Math.min(index * 0.05, 0.5),
            type: "spring",
            damping: 20,
        },
    };

    // --- EXPERIMENTAL THEME ---
    if (theme === "experimental") {
        return (
            <motion.div
                {...animationProps}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative cursor-pointer flex flex-col h-full bg-black border-2 border-lime-500/20 hover:border-lime-400 hover:shadow-[0_0_20px_rgba(183,255,60,0.4)] transition-all overflow-hidden rounded-sm"
            >
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                    {movie.isGem && (
                        <span className="px-2 py-1 bg-cyan-400 text-black text-[9px] font-black tracking-widest uppercase animate-pulse">
                            💎 GEM
                        </span>
                    )}
                    {movie.contentType && movie.contentType !== "movie" && (
                        <span className="px-2 py-1 bg-lime-500 text-black text-[9px] font-bold tracking-widest uppercase">
                            {movie.contentType === "anime" ? "ANIME" : "SERIES"}
                        </span>
                    )}
                    {showMatchScore && movie.matchScore && (
                        <span className="px-2 py-1 bg-black/80 border border-cyan-400 text-cyan-400 text-[9px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(50,245,255,0.3)]">
                            {movie.displayMatch || Math.round(movie.matchScore * 100)}% SYNC
                        </span>
                    )}
                </div>

                <div className="relative aspect-[4/5] overflow-hidden">
                    {!imageLoaded && <div className="absolute inset-0 bg-neutral-900 animate-pulse" />}
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>

                <div className="p-4 flex flex-col flex-1 justify-end bg-black z-10 -mt-8 relative h-full">
                    <h3 className="text-lime-400 text-lg font-black uppercase tracking-wider mb-2 line-clamp-2" style={{ textShadow: '0 0 10px rgba(183,255,60,0.5)' }}>
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] text-cyan-400 font-bold tracking-widest">
                            <span>{movie.year}</span>
                            <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                            <div className="flex items-center gap-1">
                                <Star size={10} className="fill-cyan-400" /> {movie.imdb}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons Overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWatchlist?.(movie); }}
                        className={`p-2 border-2 transition-all ${isInWatchlist ? "bg-lime-400 border-lime-400 text-black" : "bg-black/60 border-lime-400/40 text-lime-400 hover:bg-lime-400 hover:text-black"}`}
                    >
                        {isInWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                </div>
            </motion.div>
        );
    }

    // --- BATMAN (NOIR) THEME ---
    if (theme === "batman") {
        return (
            <motion.div
                {...animationProps}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative cursor-pointer aspect-[2/3] bg-neutral-900 border border-white/5 hover:border-yellow-500/50 transition-all duration-500 overflow-hidden"
            >
                {!imageLoaded && <div className="absolute inset-0 bg-neutral-800 animate-pulse" />}
                <img
                    src={movie.poster}
                    alt={movie.title}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110 ${imageLoaded ? "opacity-60 group-hover:opacity-100" : "opacity-0"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {movie.isGem && (
                        <span className="inline-block text-black bg-yellow-500 px-1 py-0.5 self-start text-xs font-black uppercase tracking-widest mb-1 shadow-md animate-pulse">
                            💎 GEM
                        </span>
                    )}
                    {showMatchScore && movie.matchScore && (
                        <span className="inline-block text-black bg-yellow-500 px-1 py-0.5 self-start text-xs font-bold uppercase tracking-widest mb-2 shadow-md">
                            MATCH: {movie.displayMatch || Math.round(movie.matchScore * 100)}%
                        </span>
                    )}
                    <h3 className="text-white text-2xl font-black uppercase leading-none tracking-tight mb-2 opacity-90">{movie.title}</h3>
                    <div className="text-yellow-500/70 text-[11px] font-medium uppercase tracking-widest flex items-center gap-2 mt-1">
                        <span>{movie.year}</span>
                        <span>|</span>
                        <span>{movie.genres?.[0] || ""}</span>
                        <span>|</span>
                        <div className="flex items-center gap-1">
                            <Star size={10} className="fill-yellow-500/70" /> {movie.imdb}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- EDITORIAL THEME (DEFAULT) ---
    return (
        <motion.div
            {...animationProps}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative overflow-hidden cursor-pointer backdrop-blur-xl aspect-[2/3] rounded-[28px] md:rounded-[36px] bg-gradient-to-br from-neutral-900/80 to-neutral-950/90 border border-white/10 hover:border-orange-400/40 hover:shadow-2xl hover:shadow-orange-400/20 hover:-translate-y-2"
        >
            {!imageLoaded && <div className="absolute inset-0 bg-neutral-800 animate-pulse" />}
            <img
                src={movie.poster}
                alt={movie.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 drop-shadow-xl ${imageLoaded ? "opacity-95 group-hover:opacity-100" : "opacity-0"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />

            <div className="absolute top-4 md:top-6 inset-x-4 md:inset-x-6 flex justify-between items-start z-20">
                <div className="flex flex-col gap-2">
                    {movie.isGem && (
                        <span className="self-start px-2 py-1 bg-orange-500 text-white text-[10px] font-black tracking-widest rounded-full shadow-lg shadow-orange-500/30 animate-pulse">
                            💎 GEM
                        </span>
                    )}
                    {movie.contentType && movie.contentType !== "movie" && (
                        <span className="self-start px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-xl shadow-xl border border-white/10 bg-white/5 text-white/90">
                            {movie.contentType === "anime" ? "🎌 Anime" : "📺 Series"}
                        </span>
                    )}
                    {showMatchScore && movie.matchScore && (
                        <span className="self-start px-2 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-widest border border-white/20 shadow-xl">
                            {movie.displayMatch || Math.round(movie.matchScore * 100)}% Match
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWatchlist?.(movie); }}
                        className={`p-2 backdrop-blur-xl rounded-full transition-all shadow-xl border border-white/20 hover:scale-110 active:scale-95 ${isInWatchlist ? "bg-orange-500 text-white" : "bg-black/60 hover:bg-orange-500/80"}`}
                    >
                        {isInWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                    <div className="p-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 cursor-pointer">
                        <Play size={16} className="fill-white" />
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end pointer-events-none z-10">
                <h3 className="text-lg md:text-xl font-black italic uppercase leading-tight mb-3 line-clamp-3 drop-shadow-xl">{movie.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full backdrop-blur-md">{movie.year}</span>
                    {movie.genres?.[0] && (
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-full backdrop-blur-md">{movie.genres[0]}</span>
                    )}
                    <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-lg shadow-orange-500/10">
                        <Star size={10} className="fill-orange-500" /> {movie.imdb}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
