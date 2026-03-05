import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck } from "lucide-react";

/**
 * List style Movie Card for Matte theme
 */
const MovieRowCard = ({
    movie,
    index,
    onClick,
    isInWatchlist,
    onToggleWatchlist,
    showMatchScore = true,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: Math.min(index * 0.03, 0.4),
                type: "spring",
                damping: 22,
            }}
            onClick={onClick}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-3 sm:p-4 rounded-none bg-black border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 transition-all cursor-pointer"
        >
            <div className="relative w-full sm:w-40 md:w-44 aspect-[2/3] overflow-hidden rounded-xl bg-slate-900">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                )}
                <img
                    src={movie.poster}
                    alt={movie.title}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                />
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-100 line-clamp-2">
                            {movie.title}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleWatchlist?.(movie);
                            }}
                            className="shrink-0 p-2 rounded-full border border-slate-700 hover:border-slate-400 hover:bg-slate-800 text-slate-200"
                        >
                            {isInWatchlist ? (
                                <BookmarkCheck size={16} />
                            ) : (
                                <Bookmark size={16} />
                            )}
                        </button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                        {movie.year && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800">
                                {movie.year}
                            </span>
                        )}
                        {movie.isGem && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-black animate-pulse">
                                💎 GEM
                            </span>
                        )}
                        {movie.genres?.slice(0, 3).map((g) => (
                            <span
                                key={g}
                                className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700"
                            >
                                {g}
                            </span>
                        ))}
                        {typeof movie.imdb !== "undefined" && (
                            <span className="ml-auto flex items-center gap-1 text-amber-300">
                                <Star size={12} className="fill-amber-300" /> {movie.imdb}
                            </span>
                        )}
                        {showMatchScore && movie.matchScore && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold tracking-widest uppercase">
                                {movie.displayMatch || Math.round(movie.matchScore * 100)}% MATCH
                            </span>
                        )}
                    </div>

                    {movie.overview && (
                        <p className="mt-3 text-xs sm:text-sm text-slate-300/80 line-clamp-3">
                            {movie.overview}
                        </p>
                    )}
                </div>

                {movie.contentType && (
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-full border border-slate-700 uppercase tracking-wide">
                            {movie.contentType === "anime"
                                ? "Anime"
                                : movie.contentType === "series"
                                    ? "Series"
                                    : "Movie"}
                        </span>
                        {movie.runtime && (
                            <span className="text-slate-500">{movie.runtime} min</span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MovieRowCard;
