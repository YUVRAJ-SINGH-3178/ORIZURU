import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Bookmark, History, Settings, Sparkles, Globe, Film, Play, Lock, Bell } from "lucide-react";

/**
 * Watchlist Slideout Sidebar
 */
export const WatchlistSlideout = ({ isOpen, onClose, watchlist, onToggleWatchlist, onSelectMovie }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0D0D0D] border-l border-white/10 overflow-y-auto"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0D0D0D] z-10">
                        <div>
                            <h3 className="text-xl font-black uppercase">My Watchlist</h3>
                            <p className="text-white/40 text-sm">{watchlist?.length || 0} titles saved</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {watchlist?.length > 0 ? (
                        <div className="p-4 space-y-3">
                            {watchlist.map((movie, idx) => (
                                <motion.div
                                    key={movie.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex gap-4 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                                    onClick={() => {
                                        onSelectMovie(movie);
                                        onClose();
                                    }}
                                >
                                    <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded-xl" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate">{movie.title}</h4>
                                        <p className="text-white/40 text-sm">{movie.year} • {movie.genres[0]}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Star size={12} className="text-yellow-500" />
                                            <span className="text-sm">{movie.imdb}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onToggleWatchlist(movie); }}
                                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-full transition-all self-center"
                                    >
                                        <X size={16} className="text-red-400" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Bookmark size={48} className="mx-auto mb-4 text-white/20" />
                            <p className="text-white/40 mb-2">Your watchlist is empty</p>
                            <p className="text-white/20 text-sm">Save movies to watch later</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

/**
 * Watch History Slideout Sidebar
 */
export const WatchHistorySlideout = ({ isOpen, onClose, watchHistory, onRemoveWatched, onSelectMovie }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0D0D0D] border-l border-white/10 overflow-y-auto"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0D0D0D] z-10">
                        <div>
                            <h3 className="text-xl font-black uppercase text-green-500">Watch History</h3>
                            <p className="text-white/40 text-sm">{watchHistory?.length || 0} titles you've seen</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {watchHistory?.length > 0 ? (
                        <div className="p-4 space-y-3">
                            {watchHistory.map((movie, idx) => (
                                <motion.div
                                    key={movie.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex gap-4 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                                    onClick={() => {
                                        onSelectMovie(movie);
                                        onClose();
                                    }}
                                >
                                    <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded-xl grayscale-[50%] group-hover:grayscale-0 transition-all" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate text-white/80 group-hover:text-white transition-colors">{movie.title}</h4>
                                        <p className="text-white/40 text-sm">{movie.year} • {movie.genres[0]}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Watched</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemoveWatched(movie.id); }}
                                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-full transition-all self-center"
                                    >
                                        <X size={16} className="text-red-400" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <History size={24} className="text-white/20" />
                            </div>
                            <p className="text-white/60 font-bold mb-2 uppercase tracking-widest text-sm">Nothing Here Yet</p>
                            <p className="text-white/30 text-xs text-center px-4">Titles you mark as "Watched" will appear here and will never be suggested to you again.</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

/**
 * Main Preferences Modal
 */
export const PreferencesModal = ({ isOpen, onClose, preferences, applyPreferences, themeOptions }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-gradient-to-b from-[#1a1a1a] to-[#0D0D0D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                <Settings size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Preferences</h3>
                                <p className="text-white/40 text-xs">Customize your experience</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Theme */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                                <Sparkles size={14} /> Theme
                            </label>
                            <div className="grid gap-3">
                                {themeOptions.map((theme) => (
                                    <button
                                        key={theme.key}
                                        onClick={() => applyPreferences({ ...preferences, theme: theme.key })}
                                        className={`p-4 rounded-2xl border transition-all text-left ${preferences.theme === theme.key ? "border-orange-500 bg-white/10" : "bg-white/5 border-white/10 hover:border-white/20"}`}
                                    >
                                        <div className="h-10 w-full rounded-xl border border-white/10 mb-3" style={{ background: theme.swatch }} />
                                        <p className="text-sm font-bold">{theme.label}</p>
                                        <p className="text-xs text-white/40">{theme.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                                <Globe size={14} /> Default Language
                            </label>
                            <select
                                value={preferences.defaultLanguage}
                                onChange={(e) => applyPreferences({ ...preferences, defaultLanguage: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none text-sm text-white cursor-pointer hover:border-orange-500 focus:border-orange-500 transition-colors [&>option]:bg-[#1a1a1a]"
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
                                <option value="ar">Arabic</option>
                            </select>
                        </div>

                        {/* Content Types */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-3">
                                <Film size={14} /> Content Types
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { key: "movie", label: "Movies", icon: "🎬" },
                                    { key: "series", label: "Series", icon: "📺" },
                                    { key: "anime", label: "Anime", icon: "🎌" },
                                ].map((type) => (
                                    <button
                                        key={type.key}
                                        onClick={() => applyPreferences({
                                            ...preferences,
                                            preferredContentTypes: {
                                                ...preferences.preferredContentTypes,
                                                [type.key]: !preferences.preferredContentTypes[type.key],
                                            },
                                        })}
                                        className={`p-4 rounded-xl border transition-all text-center ${preferences.preferredContentTypes[type.key] ? "bg-orange-500/20 border-orange-500 text-orange-400" : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"}`}
                                    >
                                        <span className="text-2xl mb-2 block">{type.icon}</span>
                                        <span className="text-xs font-bold">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle Toggles */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                                <Settings size={14} /> Options
                            </label>
                            <div className="space-y-2">
                                {[
                                    { key: "showAdultContent", label: "Show 18+ Adult Content", icon: Lock },
                                    { key: "autoplayTrailers", label: "Autoplay Trailers", icon: Play },
                                    { key: "notifications", label: "Enable Notifications", icon: Bell },
                                ].map((option) => (
                                    <div
                                        key={option.key}
                                        onClick={() => applyPreferences({ ...preferences, [option.key]: !preferences[option.key] })}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <option.icon size={18} className="text-white/40 group-hover:text-white/60 transition-colors" />
                                            <span className="text-sm">{option.label}</span>
                                        </div>
                                        <div className={`w-12 h-7 rounded-full transition-all relative ${preferences[option.key] ? "bg-emerald-500" : "bg-white/10"}`}>
                                            <motion.div animate={{ x: preferences[option.key] ? 22 : 2 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 bg-white/5 text-center">
                        <button onClick={onClose} className="w-full py-4 btn-primary rounded-xl font-bold">Apply Changes</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
