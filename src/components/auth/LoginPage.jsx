import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Eye, Check, Loader2, ArrowLeft } from "lucide-react";

/**
 * Enhanced Login Page with Supabase Auth
 */
const LoginPage = ({ onAuthSuccess, onBack }) => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [authStep, setAuthStep] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pass.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (isSignUp && !name.trim()) {
            setError("Please enter your display name.");
            return;
        }
        setError("");
        setSuccessMsg("");
        setIsLoading(true);

        try {
            const { supabase } = await import("../../services/supabase");

            if (isSignUp) {
                setAuthStep("Creating your account...");
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password: pass,
                    options: { data: { name: name.trim() } },
                });
                if (signUpError) {
                    setError(signUpError.message);
                    setIsLoading(false);
                    setAuthStep("");
                    return;
                }
                if (data?.user && !data?.session) {
                    setSuccessMsg("Check your email for a confirmation link, then sign in!");
                    setIsLoading(false);
                    setAuthStep("");
                    setIsSignUp(false);
                    return;
                }
                if (data?.session) {
                    setAuthStep("Setting up your profile...");
                    await new Promise((r) => setTimeout(r, 500));
                    onAuthSuccess(
                        {
                            id: data.user.id,
                            name: name.trim(),
                            email: data.user.email,
                            avatar: null,
                            joinedDate: data.user.created_at,
                        },
                        true
                    );
                    setIsLoading(false);
                    return;
                }
            } else {
                setAuthStep("Authenticating...");
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password: pass,
                });
                if (signInError) {
                    setError(signInError.message);
                    setIsLoading(false);
                    setAuthStep("");
                    return;
                }
                setAuthStep("Loading profile...");
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();
                setAuthStep("Initializing engine...");
                await new Promise((r) => setTimeout(r, 400));
                onAuthSuccess(
                    {
                        id: data.user.id,
                        name: profile?.name || data.user.email.split("@")[0],
                        email: data.user.email,
                        avatar: profile?.avatar_url || null,
                        joinedDate: data.user.created_at,
                        preferences: profile?.preferences || {},
                    },
                    false
                );
                setIsLoading(false);
                return;
            }
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
        setIsLoading(false);
        setAuthStep("");
    };

    const handleOAuth = async (provider) => {
        try {
            const { supabase } = await import("../../services/supabase");
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin },
            });
            if (oauthError) setError(oauthError.message);
        } catch {
            setError("OAuth login failed. Please try email/password.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(217,119,54,0.16),transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,_rgba(111,123,94,0.14),transparent_45%)]" />

            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onBack}
                className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all z-20 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-xl shadow-orange-500/30 overflow-hidden"
                    >
                        <img
                            src="/orizuru-logo-2d.png"
                            alt="ORIZURU"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </motion.div>
                    <h1 className="text-4xl font-black italic tracking-tighter mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        ORIZURU
                    </h1>
                    <p className="text-white/40 text-sm">Your personal streaming guide</p>
                </div>

                <div className="surface-card p-8 md:p-10 rounded-[32px]">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight">
                            {isSignUp ? "Create Account" : "Welcome Back"}
                        </h2>
                        <p className="text-white/40 text-sm mt-2">
                            {isSignUp
                                ? "Join ORIZURU to save your preferences across devices"
                                : "Sign in to access your watchlist and recommendations"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
                            >
                                <AlertCircle size={18} className="flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm"
                            >
                                <CheckCircle size={18} className="flex-shrink-0" />
                                {successMsg}
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {isSignUp && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full input-base py-4 px-5 transition-all text-white placeholder-white/30"
                                        placeholder="Your name"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full input-base py-4 px-5 transition-all text-white placeholder-white/30"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    Password
                                </label>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        className="text-[10px] text-orange-500 hover:text-orange-400 transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    className="w-full input-base py-4 px-5 pr-12 transition-all text-white placeholder-white/30"
                                    placeholder={isSignUp ? "Min 6 characters" : "••••••••"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>

                        {!isSignUp && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setRememberMe(!rememberMe)}
                                        className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${rememberMe
                                            ? "bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30"
                                            : "border-white/20 group-hover:border-white/40"
                                            }`}
                                    >
                                        {rememberMe && <Check size={14} />}
                                    </div>
                                    <span className="text-sm text-white/60">Remember me</span>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {authStep || (isSignUp ? "Creating account..." : "Signing in...")}
                                </>
                            ) : isSignUp ? (
                                "Create Account"
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-white/30 text-xs mb-4">Or continue with</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleOAuth("google")}
                                className="py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                <svg
                                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                            <button
                                onClick={() => handleOAuth("github")}
                                className="py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                <svg
                                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-white/30 text-xs mt-6">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError("");
                                setSuccessMsg("");
                            }}
                            className="text-orange-500 hover:text-orange-400 transition-colors"
                        >
                            {isSignUp ? "Sign in" : "Sign up free"}
                        </button>
                    </p>
                </div>

                <p className="text-center text-white/20 text-[10px] mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
