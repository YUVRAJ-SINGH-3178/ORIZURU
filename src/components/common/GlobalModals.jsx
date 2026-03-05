import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Share2, Copy, Check } from "lucide-react";

/**
 * Newsletter Subscription Modal
 */
export const NewsletterModal = ({
    isOpen,
    onClose,
    email,
    setEmail,
    isSubmitted,
    onSubmit,
}) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-md w-full bg-[#0D0D0D] border border-orange-500/30 p-8 md:p-10 rounded-[32px] relative"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-black italic uppercase mb-2">Stay Updated</h2>
                    <p className="text-white/40 text-sm mb-6">
                        Get movie recommendations, feature updates, and entertainment insights delivered to your inbox.
                    </p>

                    {!isSubmitted ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit(email);
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-orange-500 transition-all text-white placeholder-white/30"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black uppercase rounded-xl hover:shadow-lg shadow-orange-500/30 transition-all"
                            >
                                Subscribe Now
                            </button>
                        </form>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                            <p className="text-white/60 text-sm">Check your inbox for confirmation. Happy watching! 🎬</p>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

/**
 * Share Watchlist Modal
 */
export const ShareWatchlistModal = ({
    isOpen,
    onClose,
    items,
    shareText,
    isCopied,
    onCopy,
}) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-xl w-full bg-[#0D0D0D] border border-white/10 p-8 md:p-10 rounded-[32px] relative shadow-2xl"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black italic uppercase">Share Watchlist</h2>
                            <p className="text-white/40 text-sm">Share your top picks with friends</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    {items.length > 0 ? (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest px-1">Current Picks</p>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                                    {items.map((item) => (
                                        <span key={item.id} className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-white/70">
                                            {item?.title || item?.name || "Untitled"}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest px-1 mb-2">Share Message</p>
                                <textarea
                                    readOnly
                                    value={shareText}
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] sm:text-xs text-white/60 resize-none font-mono"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onCopy}
                                    className="flex-1 py-4 bg-orange-500 text-white font-black uppercase rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                >
                                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                                    {isCopied ? "Copied!" : "Copy to Clipboard"}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <Share2 size={48} className="text-white/10 mx-auto mb-4" />
                            <p className="text-white/40">Your watchlist is currently empty.</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
