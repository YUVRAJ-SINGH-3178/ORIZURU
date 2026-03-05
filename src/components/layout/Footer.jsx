import React from "react";
import { Info, Mail, ShieldCheck, FileText, Share2 } from "lucide-react";

/**
 * Main Application Footer
 */
const Footer = ({
    onOpenAbout,
    onOpenContact,
    onOpenPrivacy,
    onOpenTerms,
    onOpenNewsletter,
    onOpenShareWatchlist,
    handleDiscoverShortcut,
    currentYear = new Date().getFullYear(),
}) => (
    <footer className="border-t border-white/5 p-6 md:p-12 mt-auto">
        <div className="max-w-[1800px] mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                {/* Brand Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center relative">
                            <div className="absolute inset-[2px] rounded-md bg-[#0D0D0D] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-400" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                        <h4 className="text-2xl font-black italic tracking-tighter text-white">ORIZURU</h4>
                    </div>
                    <p className="text-white/40 text-sm">
                        Your personal streaming guide. Discover movies, series, and anime tailored to your taste.
                    </p>
                </div>

                {/* Discover Section */}
                <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Discover</h5>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li>
                            <button
                                onClick={() => handleDiscoverShortcut({ mode: "skip", contentType: "movie" })}
                                className="text-left hover:text-white transition-colors hover:underline"
                            >
                                Popular Movies
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleDiscoverShortcut({ mode: "genre", contentType: "series", minRating: "8" })}
                                className="text-left hover:text-white transition-colors hover:underline"
                            >
                                Top Rated Series
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleDiscoverShortcut({ mode: "genre", contentType: "anime", genre: "Anime" })}
                                className="text-left hover:text-white transition-colors hover:underline"
                            >
                                Anime Collection
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleDiscoverShortcut({ mode: "skip", minYear: String(currentYear - 1) })}
                                className="text-left hover:text-white transition-colors hover:underline"
                            >
                                New Releases
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Support Section */}
                <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Support & Legal</h5>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={onOpenAbout}
                            className="flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl text-xs text-white/50 hover:text-white transition-all group"
                        >
                            <Info size={14} className="group-hover:text-blue-400" />
                            About
                        </button>
                        <button
                            onClick={onOpenContact}
                            className="flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl text-xs text-white/50 hover:text-white transition-all group"
                        >
                            <Mail size={14} className="group-hover:text-emerald-400" />
                            Help
                        </button>
                        <button
                            onClick={onOpenPrivacy}
                            className="flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl text-xs text-white/50 hover:text-white transition-all group"
                        >
                            <ShieldCheck size={14} className="group-hover:text-orange-400" />
                            Privacy
                        </button>
                        <button
                            onClick={onOpenTerms}
                            className="flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl text-xs text-white/50 hover:text-white transition-all group"
                        >
                            <FileText size={14} className="group-hover:text-purple-400" />
                            Terms
                        </button>
                    </div>
                </div>

                {/* Connect Section */}
                <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Connect</h5>
                    <div className="flex gap-3">
                        <button
                            onClick={onOpenNewsletter}
                            className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all hover:scale-110"
                            title="Join our Newsletter"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        </button>
                        <button
                            onClick={onOpenShareWatchlist}
                            className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all hover:scale-110"
                            title="Share Watchlist"
                        >
                            <Share2 className="w-5 h-5 text-white/60" />
                        </button>
                        <a
                            href="https://github.com/YUVRAJ-SINGH-3178"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all hover:scale-110"
                            title="GitHub"
                        >
                            <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white/30 text-xs">© {currentYear} ORIZURU. Data provided by TMDB.</p>
                <p className="text-white/20 text-xs">Made with ❤️ for movie lovers</p>
            </div>
        </div>
    </footer>
);

export default Footer;
