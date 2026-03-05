import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Database, Target, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

const OnboardingTutorial = ({ onComplete, userName }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: Sparkles,
            title: `Welcome to ORIZURU, ${userName}!`,
            desc: "Experience a completely new way to discover cinema. Our 8-axis AI vector algorithm analyzes thousands of data points to find stories that truly resonate with you.",
            color: "text-orange-500"
        },
        {
            icon: Database,
            title: "The Infinite Library",
            desc: "Unlike traditional apps, ORIZURU pre-calculates an entire cinematic universe locally on your device. This is why you might see a brief preparation screen—we're organizing 90,000+ titles just for you.",
            color: "text-cyan-400"
        },
        {
            icon: Target,
            title: "Hyper-Personalization",
            desc: "Every interaction—every 'Want to Watch' or 'Seen it'—shapers your unique taste vector. Your feed evolves in real-time as you navigate the app.",
            color: "text-lime-400"
        },
        {
            icon: ShieldCheck,
            title: "Your Privacy is Core",
            desc: "Your taste profile and search history stay private. We focus on matching you with great movies, not tracking your every move. You always stay in control.",
            color: "text-purple-400"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg surface-card p-8 rounded-[32px] border border-white/10 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-orange-500"
                        initial={{ width: `${(step / steps.length) * 100}%` }}
                        animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="flex flex-col items-center text-center mt-4">
                    <div className={`w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 ${steps[step].color}`}>
                        {React.createElement(steps[step].icon, { size: 36 })}
                    </div>
                    <h2 className="text-3xl font-black mb-3">{steps[step].title}</h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-10">{steps[step].desc}</p>
                </div>

                <div className="flex justify-between items-center gap-4">
                    <button
                        onClick={() => step > 0 ? setStep(step - 1) : null}
                        className={`p-4 rounded-xl transition-all ${step > 0 ? "hover:bg-white/10 text-white" : "opacity-0 pointer-events-none"}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? "bg-orange-500 w-6" : "bg-white/20"}`} />
                        ))}
                    </div>

                    <button
                        onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
                        className="px-6 py-4 rounded-xl font-bold bg-white text-black hover:bg-white/90 transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        {step < steps.length - 1 ? "Next" : "Start Discovering"} <ChevronRight size={18} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardingTutorial;
