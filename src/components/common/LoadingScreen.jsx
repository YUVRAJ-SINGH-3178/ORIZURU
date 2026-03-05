import React from "react";
import { motion } from "framer-motion";
import { Film, Tv, Star, Clapperboard, Sparkles } from "lucide-react";

const LoadingScreen = ({ progress, movieCount, message }) => {
    const loadingIcons = [Film, Tv, Star, Clapperboard, Sparkles];

    return (
        <div className="fixed inset-0 bg-[var(--ink)] flex flex-col items-center justify-center z-50 overflow-hidden">
            {/* Animated background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 10,
                            opacity: 0.2 + Math.random() * 0.3,
                        }}
                        animate={{
                            y: -10,
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Gradient orbs */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/5 blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{ top: "-20%", left: "-10%" }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/5 blur-3xl"
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                style={{ bottom: "-15%", right: "-5%" }}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center relative z-10"
            >
                {/* Animated icon carousel */}
                <div className="relative w-32 h-32 mx-auto mb-10">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white/5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-2 rounded-full border border-dashed border-white/10"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="absolute inset-0">
                        {loadingIcons.map((Icon, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{ top: "50%", left: "50%" }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: i * -1.6,
                                }}
                            >
                                <motion.div
                                    style={{ x: -8, y: -52 }}
                                    animate={{ rotate: -360 }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * -1.6,
                                    }}
                                >
                                    <Icon size={16} className="text-white/40" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <Film size={24} className="text-white/80" />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                        <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                            {movieCount > 0 ? movieCount.toLocaleString() : "Loading"}
                        </span>
                        <span className="text-white/30 ml-2 text-2xl md:text-3xl">
                            {movieCount > 0 ? "titles" : "..."}
                        </span>
                    </h2>
                    <p className="text-white/40 text-sm mb-8 tracking-wide">
                        {message || "Preparing your personalized experience"}
                    </p>
                </motion.div>

                <div className="w-80 mx-auto">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-white/80 to-violet-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-white/30">
                        <span>Loading content</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>

                <motion.div
                    className="mt-10 flex items-center justify-center gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {["Movies", "Series", "Anime"].map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <motion.div
                                className={`w-2 h-2 rounded-full ${progress > (i + 1) * 30 ? "bg-emerald-500" : "bg-white/20"
                                    }`}
                                animate={
                                    progress > (i + 1) * 30 ? {} : { opacity: [0.3, 1, 0.3] }
                                }
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                            <span
                                className={`text-xs ${progress > (i + 1) * 30 ? "text-white/60" : "text-white/30"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
