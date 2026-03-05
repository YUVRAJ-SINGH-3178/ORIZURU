import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Reusable Info Modal for Support, About, Terms, Privacy
 */
const InfoModal = ({ isOpen, onClose, title, icon: Icon, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-2xl w-full bg-[#0D0D0D] border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden relative shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-8 md:p-12 pb-4 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {Icon && (
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Icon size={24} className="text-orange-500" />
                                </div>
                            )}
                            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 pt-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div className="text-white/60 text-lg leading-relaxed flex flex-col gap-6">
                            {children}
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

export default InfoModal;
