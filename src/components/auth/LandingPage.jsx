import React from "react";
import { motion } from "framer-motion";
import { Film, Clapperboard, Star, Heart, Tv, Sparkles, ArrowRight } from "lucide-react";

const LandingPage = ({ onStart }) => (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-transparent overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,_rgba(217,119,54,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,_rgba(111,123,94,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,_rgba(168,85,247,0.05),transparent_40%)]" />

        {/* Floating movie icons with glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[Film, Clapperboard, Star, Heart, Tv, Sparkles].map((Icon, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white/[0.03]"
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
                    style={{
                        left: `${5 + i * 15}%`,
                        top: `${15 + (i % 3) * 25}%`,
                    }}
                >
                    <Icon size={50 + i * 12} />
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10 max-w-2xl"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 chip mb-8 backdrop-blur-sm"
            >
                <img src="/orizuru-logo-2d.png" alt="ORIZURU" className="w-5 h-5 rounded-md object-cover" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Movies • Series • Anime
                </span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-[0.85]"
            >
                Cinema <br />
                <span className="text-orange-500">Simplified.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/40 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed"
            >
                The next generation AI-powered discovery engine. Find your next favorite story in seconds.
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="px-12 py-6 btn-primary flex items-center gap-3 mx-auto"
            >
                Discover Movies <ArrowRight size={20} />
            </motion.button>
        </motion.div>
    </div>
);

export default LandingPage;
