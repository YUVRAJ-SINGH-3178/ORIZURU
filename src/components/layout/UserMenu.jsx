import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings, HelpCircle, Info, Mail, ShieldCheck, FileText, LogOut, Trash2, ChevronDown
} from "lucide-react";
import UserAvatar from "../common/UserAvatar";

/**
 * User Profile Dropdown Menu
 */
const UserMenu = ({
    user,
    showUserMenu,
    setShowUserMenu,
    watchlist,
    watchHistory,
    recentlyViewed,
    onOpenPreferences,
    onOpenOnboarding,
    onOpenAbout,
    onOpenContact,
    onOpenPrivacy,
    onOpenTerms,
    onOpenHistory,
    onLogout,
    onDeleteAccount,
}) => (
    <div className="relative">
        <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
        >
            <UserAvatar user={user} size="sm" />
            <ChevronDown
                size={14}
                className={`hidden md:block text-white/40 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`}
            />
        </button>

        <AnimatePresence>
            {showUserMenu && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-gradient-to-b from-[#1a1a1a] to-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-orange-500/5 to-transparent">
                        <div className="flex items-center gap-3">
                            <UserAvatar user={user} size="lg" />
                            <div>
                                <p className="font-bold text-white">{user.name}</p>
                                <p className="text-white/40 text-xs truncate max-w-[120px]">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* User Stats */}
                    <div className="p-3">
                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/10">
                                <p className="text-xl font-black text-orange-500">{watchlist?.length || 0}</p>
                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">List</p>
                            </div>
                            <div
                                className="text-center p-2 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors"
                                onClick={onOpenHistory}
                            >
                                <p className="text-xl font-black text-green-500">{watchHistory?.length || 0}</p>
                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Seen</p>
                            </div>
                            <div className="text-center p-2 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-xl border border-cyan-500/10">
                                <p className="text-xl font-black text-cyan-500">{recentlyViewed?.length || 0}</p>
                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Viewed</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <div className="p-2 border-t border-white/10">
                        <button
                            onClick={onOpenPreferences}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-left group"
                        >
                            <Settings size={18} className="text-white/40 group-hover:text-orange-500 group-hover:rotate-90 transition-all duration-300" />
                            <span className="text-sm font-bold group-hover:text-white transition-colors text-white/70">Preferences</span>
                        </button>

                        <button
                            onClick={onOpenOnboarding}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-left group"
                        >
                            <HelpCircle size={18} className="text-white/40 group-hover:text-cyan-500 transition-all duration-300" />
                            <span className="text-sm font-bold group-hover:text-white transition-colors text-white/70">How it Works</span>
                        </button>

                        <div className="my-2 border-t border-white/5 mx-2"></div>
                        <p className="px-3 py-1 text-[10px] text-white/20 uppercase font-black tracking-widest">Support & Legal</p>

                        <div className="grid grid-cols-2 gap-1 p-1">
                            <button onClick={onOpenAbout} className="flex items-center gap-2 p-2.5 hover:bg-white/5 rounded-lg text-xs text-white/50 hover:text-white transition-all">
                                <Info size={14} /> About
                            </button>
                            <button onClick={onOpenContact} className="flex items-center gap-2 p-2.5 hover:bg-white/5 rounded-lg text-xs text-white/50 hover:text-white transition-all">
                                <Mail size={14} /> Contact
                            </button>
                            <button onClick={onOpenPrivacy} className="flex items-center gap-2 p-2.5 hover:bg-white/5 rounded-lg text-xs text-white/50 hover:text-white transition-all">
                                <ShieldCheck size={14} /> Privacy
                            </button>
                            <button onClick={onOpenTerms} className="flex items-center gap-2 p-2.5 hover:bg-white/5 rounded-lg text-xs text-white/50 hover:text-white transition-all">
                                <FileText size={14} /> Terms
                            </button>
                        </div>

                        <div className="my-2 border-t border-white/5 mx-2"></div>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-left text-white/50 group"
                        >
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                            <span className="text-sm font-bold">Sign Out</span>
                        </button>

                        <button
                            onClick={onDeleteAccount}
                            className="w-full mt-2 flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl transition-all text-left text-red-500 group border border-transparent hover:border-red-500/20"
                        >
                            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold uppercase tracking-tight">Delete Account</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default UserMenu;
