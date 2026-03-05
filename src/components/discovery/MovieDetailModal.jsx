import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    X,
    Play,
    TrendingUp,
    Sparkles,
    Tv,
    Star,
    ExternalLink,
    Bookmark,
    BookmarkCheck,
    Eye,
    Share2,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

/**
 * High-fidelity Movie Detail View
 */
const MovieDetailModal = ({
    movie,
    similarMovies,
    onClose,
    onSelectMovie,
    isInWatchlist,
    onToggleWatchlist,
    isWatched,
    onMarkWatched,
    onRemoveWatched,
}) => {
    const [activeTab, setActiveTab] = useState("about");
    const { addToast } = useToast();

    if (!movie) return null;

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: movie.title,
                    text: `Check out ${movie.title} on ORIZURU!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(
                    `Check out ${movie.title}! ${movie.watchUrl}`
                );
                addToast("Link copied to clipboard!", "success");
            }
        } catch (e) {
            console.log("Share cancelled");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-start justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-6xl w-full bg-[#0D0D0D] rounded-[32px] md:rounded-[48px] border border-white/10 overflow-hidden my-8 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X size={20} />
                </button>

                {movie.backdrop && (
                    <div className="relative h-64 md:h-96 overflow-hidden">
                        <img
                            src={movie.backdrop}
                            alt={movie.title}
                            className="w-full h-full object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-orange-500 transition-colors"
                            >
                                <Play size={32} fill="white" />
                            </motion.button>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8 p-6 md:p-12 -mt-32 relative z-10">
                    <div className="lg:col-span-1">
                        <div className="aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play size={48} className="text-white" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <div className="bg-white/5 p-4 rounded-2xl text-center">
                                <p className="text-[8px] opacity-40 uppercase font-black mb-1">IMDb</p>
                                <p className="text-xl font-bold text-yellow-500">{movie.imdb}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl text-center">
                                <p className="text-[8px] opacity-40 uppercase font-black mb-1">Score</p>
                                <p className="text-xl font-bold text-red-500">{movie.rt}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl text-center">
                                <p className="text-[8px] opacity-40 uppercase font-black mb-1">Votes</p>
                                <p className="text-lg font-bold">
                                    {movie.voteCount
                                        ? movie.voteCount >= 1000
                                            ? `${(movie.voteCount / 1000).toFixed(1)}K`
                                            : movie.voteCount
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <span className="text-white/40 text-sm">Popularity</span>
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-green-500" />
                                    <span className="font-bold">{movie.popularity?.toFixed(0) || "N/A"}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <span className="text-white/40 text-sm">Release</span>
                                <span className="font-bold">{movie.year}</span>
                            </div>
                            {movie.runtime && (
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <span className="text-white/40 text-sm">Runtime</span>
                                    <span className="font-bold">{movie.runtime} min</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {movie.matchScore && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full">
                                    <Sparkles size={14} className="text-orange-500" />
                                    <span className="text-orange-500 text-sm font-bold">
                                        {movie.displayMatch || Math.round(movie.matchScore * 100)}% Match for You
                                    </span>
                                </div>
                            )}

                            {movie.contentType && movie.contentType !== "movie" && (
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${movie.contentType === "anime" ? "bg-purple-500/20" : "bg-blue-500/20"}`}>
                                    {movie.contentType === "anime" ? (
                                        <>
                                            <Sparkles size={14} className="text-purple-400" />
                                            <span className="text-purple-400 text-sm font-bold">Anime Series</span>
                                        </>
                                    ) : (
                                        <>
                                            <Tv size={14} className="text-blue-400" />
                                            <span className="text-blue-400 text-sm font-bold">TV Series</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2 leading-[0.9]">
                            {movie.title}
                        </h2>

                        {movie.originalTitle !== movie.title && (
                            <p className="text-white/40 text-sm mb-4">{movie.originalTitle}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.map((g) => (
                                <span key={g} className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest">
                                    {g}
                                </span>
                            ))}
                            <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-white/40">
                                {movie.year}
                            </span>
                            {movie.language && (
                                <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest text-white/40">
                                    {movie.language.toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                            {["about", "details", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all ${activeTab === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === "about" && (
                            <p className="text-white/60 text-lg leading-relaxed mb-8 flex-grow">{movie.synopsis}</p>
                        )}

                        {activeTab === "details" && (
                            <div className="space-y-4 mb-8 flex-grow">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Original Language</p>
                                        <p className="font-bold">{movie.language?.toUpperCase() || "EN"}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Status</p>
                                        <p className="font-bold text-green-500">Released</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Type</p>
                                        <p className="font-bold capitalize">{movie.contentType || "Movie"}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Vote Count</p>
                                        <p className="font-bold">{movie.voteCount?.toLocaleString() || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="space-y-4 mb-8 flex-grow">
                                <div className="p-6 bg-white/5 rounded-2xl">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-sm font-bold">A</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold">Anonymous User</span>
                                                <span className="text-white/30 text-sm">• 2 days ago</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} size={12} className={i <= 4 ? "text-yellow-500 fill-yellow-500" : "text-white/20"} />
                                                ))}
                                            </div>
                                            <p className="text-white/60 text-sm">
                                                Great {movie.contentType || "movie"}! Highly recommended for fans of {movie.genres[0]?.toLowerCase()}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-3">Available On</h4>
                            <div className="flex flex-wrap gap-2">
                                {movie.streaming.map((s) => (
                                    <span key={s} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all cursor-pointer">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <a
                                href={movie.watchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[200px] py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3"
                            >
                                Find Where to Watch <ExternalLink size={18} />
                            </a>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onToggleWatchlist?.(movie)}
                                className={`px-6 py-5 border rounded-2xl transition-all flex items-center gap-2 ${isInWatchlist ? "bg-orange-500 border-orange-500 text-white" : "border-white/10 hover:bg-white/5"}`}
                            >
                                {isInWatchlist ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                                <span className="hidden sm:inline font-bold text-sm">{isInWatchlist ? "In Watchlist" : "Add to List"}</span>
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => isWatched ? onRemoveWatched?.(movie.id) : onMarkWatched?.(movie)}
                                className={`px-6 py-5 border rounded-2xl transition-all flex items-center gap-2 ${isWatched ? "bg-green-500 border-green-500 text-white" : "border-white/10 hover:bg-white/5"}`}
                            >
                                <Eye size={20} className={isWatched ? "" : "opacity-50"} />
                                <span className="hidden sm:inline font-bold text-sm">{isWatched ? "Watched" : "Mark Seen"}</span>
                            </motion.button>
                            <button onClick={handleShare} className="px-6 py-5 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {similarMovies && similarMovies.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-white/10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4">Similar Titles You Might Like</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {similarMovies.slice(0, 5).map((similar) => (
                                        <motion.div
                                            key={similar.id}
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => onSelectMovie(similar)}
                                            className="aspect-[2/3] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500 transition-colors relative group"
                                        >
                                            <img src={similar.poster} alt={similar.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                <p className="text-[10px] font-bold line-clamp-2">{similar.title}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MovieDetailModal;
