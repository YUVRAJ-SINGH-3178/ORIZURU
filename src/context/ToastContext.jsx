import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info", duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={`px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 min-w-[280px] ${toast.type === "success"
                                ? "bg-green-500/90"
                                : toast.type === "error"
                                    ? "bg-red-500/90"
                                    : toast.type === "warning"
                                        ? "bg-yellow-500/90"
                                        : "bg-white/10 border border-white/20"
                                }`}
                        >
                            {toast.type === "success" && <CheckCircle size={20} />}
                            {toast.type === "error" && <AlertCircle size={20} />}
                            {toast.type === "info" && <Info size={20} />}
                            <span className="font-medium">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
