import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    ListFilter,
    Target,
    Zap,
    Compass,
    Sparkles,
    Laugh,
    Glasses,
    Film,
    Heart,
    Wand2,
    Skull,
    Search,
    HeartHandshake,
    Rocket,
    Ghost,
    Sword,
    Star,
    ArrowRight,
    TrendingUp,
    Award,
    Tv,
    CloudRain,
    Wind,
    Smile,
    User,
    Users,
    X,
} from "lucide-react";

// --- GENRE DATA ---
export const GENRE_OPTIONS = [
    { id: "Action", label: "Action", icon: Zap, color: "bg-red-500" },
    { id: "Adventure", label: "Adventure", icon: Compass, color: "bg-orange-500" },
    { id: "Animation", label: "Animation", icon: Sparkles, color: "bg-amber-500" },
    { id: "Comedy", label: "Comedy", icon: Laugh, color: "bg-yellow-500" },
    { id: "Crime", label: "Crime", icon: Glasses, color: "bg-stone-600" },
    { id: "Documentary", label: "Documentary", icon: Film, color: "bg-emerald-600" },
    { id: "Drama", label: "Drama", icon: Heart, color: "bg-pink-500" },
    { id: "Fantasy", label: "Fantasy", icon: Wand2, color: "bg-orange-700" },
    { id: "Horror", label: "Horror", icon: Skull, color: "bg-red-700" },
    { id: "Mystery", label: "Mystery", icon: Search, color: "bg-stone-500" },
    { id: "Romance", label: "Romance", icon: HeartHandshake, color: "bg-rose-500" },
    { id: "Sci-Fi", label: "Sci-Fi", icon: Rocket, color: "bg-emerald-500" },
    { id: "Thriller", label: "Thriller", icon: Ghost, color: "bg-stone-600" },
    { id: "War", label: "War", icon: Sword, color: "bg-stone-500" },
    { id: "Anime", label: "Anime", icon: Star, color: "bg-amber-600" },
];

/**
 * Initial view to choose recommendation style
 */
export const ModeSelector = ({ onSelectMode, userName }) => (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full text-center"
        >
            <h1 className="text-4xl md:text-6xl font-black italic uppercase mb-4">
                Hey {userName}, How Would You Like to Discover?
            </h1>
            <p className="text-white/40 text-lg mb-12">
                Choose how you want us to find your perfect watch
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode("quiz")}
                    className="p-8 surface-card rounded-[32px] hover:border-[rgba(217,119,54,0.45)] transition-all text-left group"
                >
                    <Brain size={48} className="mb-6 text-orange-500" />
                    <h3 className="text-2xl font-black italic uppercase mb-2">Take Quiz</h3>
                    <p className="text-white/40 text-sm">
                        Answer questions about your mood and preferences for personalized picks
                    </p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode("genre")}
                    className="p-8 surface-card rounded-[32px] hover:border-[rgba(201,122,107,0.4)] transition-all text-left group"
                >
                    <ListFilter size={48} className="mb-6 text-rose-400" />
                    <h3 className="text-2xl font-black italic uppercase mb-2">Pick Genres</h3>
                    <p className="text-white/40 text-sm">
                        Select your favorite genres and get targeted recommendations
                    </p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode("similar")}
                    className="p-8 surface-card rounded-[32px] hover:border-[rgba(111,123,94,0.45)] transition-all text-left group"
                >
                    <Target size={48} className="mb-6 text-olive-400" />
                    <h3 className="text-2xl font-black italic uppercase mb-2">Find Similar</h3>
                    <p className="text-white/40 text-sm">
                        Tell us a movie/series/anime you love and we'll find similar ones
                    </p>
                </motion.button>
            </div>

            <button
                onClick={() => onSelectMode("skip")}
                className="mt-8 text-white/30 text-sm hover:text-white/60 transition-colors"
            >
                Skip → Show trending content
            </button>
        </motion.div>
    </div>
);

/**
 * Genre Selecting View
 */
export const GenrePicker = ({ onComplete, onBack }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);

    const toggleGenre = (genreId) => {
        if (selectedGenres.includes(genreId)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genreId));
        } else if (selectedGenres.length < 5) {
            setSelectedGenres([...selectedGenres, genreId]);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
                <button onClick={onBack} className="text-white/40 hover:text-white mb-8 flex items-center gap-2">
                    <ArrowRight className="rotate-180" size={16} /> Back
                </button>

                <h1 className="text-4xl md:text-5xl font-black italic uppercase mb-2">Pick Your Favorite Genres</h1>
                <p className="text-white/40 text-lg mb-8">
                    Select up to 5 genres you enjoy ({selectedGenres.length}/5 selected)
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                    {GENRE_OPTIONS.map((genre) => {
                        const isSelected = selectedGenres.includes(genre.id);
                        const Icon = genre.icon;
                        return (
                            <motion.button
                                key={genre.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleGenre(genre.id)}
                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${isSelected
                                    ? `${genre.color} border-white/30`
                                    : "surface-strong border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <Icon size={24} />
                                <span className="text-xs font-bold uppercase">{genre.label}</span>
                            </motion.button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onComplete(selectedGenres)}
                    disabled={selectedGenres.length === 0}
                    className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl transition-all ${selectedGenres.length > 0
                        ? "btn-primary font-bold"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                        }`}
                >
                    Get Recommendations ({selectedGenres.length} genres)
                </button>
            </motion.div>
        </div>
    );
};

/**
 * Search-based Similar content view
 */
export const FindSimilar = ({ allMovies, onComplete, onBack }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(null);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const query = searchQuery.toLowerCase();
            const results = allMovies
                .filter(
                    (m) =>
                        m.title.toLowerCase().includes(query) ||
                        m.originalTitle?.toLowerCase().includes(query)
                )
                .slice(0, 8);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, allMovies]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
                <button onClick={onBack} className="text-white/40 hover:text-white mb-8 flex items-center gap-2">
                    <ArrowRight className="rotate-180" size={16} /> Back
                </button>

                <h1 className="text-4xl md:text-5xl font-black italic uppercase mb-2">Find Similar</h1>
                <p className="text-white/40 text-lg mb-8">Search for a movie, series, or anime you love</p>

                <div className="relative mb-6">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., Inception, Breaking Bad, Attack on Titan..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-orange-500 transition-all text-lg"
                    />
                </div>

                {searchResults.length > 0 && !selectedTitle && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
                        {searchResults.map((movie) => (
                            <button
                                key={movie.id}
                                onClick={() => {
                                    setSelectedTitle(movie);
                                    setSearchQuery(movie.title);
                                    setSearchResults([]);
                                }}
                                className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-all text-left border-b border-white/5 last:border-0"
                            >
                                <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h4 className="font-bold">{movie.title}</h4>
                                    <p className="text-white/40 text-sm">
                                        {movie.year} • {movie.genres[0]}
                                        {movie.contentType !== "movie" && (
                                            <span className="ml-2 text-xs px-2 py-0.5 bg-purple-500/30 rounded-full">
                                                {movie.contentType === "anime" ? "Anime" : "Series"}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <Star size={14} className="text-yellow-500" />
                                <span className="text-sm">{movie.imdb}</span>
                            </button>
                        ))}
                    </div>
                )}

                {selectedTitle && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/30 rounded-2xl p-4 flex items-center gap-4 mb-6"
                    >
                        <img src={selectedTitle.poster} alt={selectedTitle.title} className="w-16 h-24 object-cover rounded-xl" />
                        <div className="flex-1">
                            <p className="text-orange-500 text-xs font-bold uppercase mb-1">Finding similar to:</p>
                            <h4 className="text-xl font-black">{selectedTitle.title}</h4>
                            <p className="text-white/40 text-sm">{selectedTitle.year} • {selectedTitle.genres.join(", ")}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedTitle(null);
                                setSearchQuery("");
                            }}
                            className="p-2 hover:bg-white/10 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                )}

                <button
                    onClick={() => onComplete(selectedTitle)}
                    disabled={!selectedTitle}
                    className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl transition-all ${selectedTitle
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                        }`}
                >
                    Find Similar Titles
                </button>
            </motion.div>
        </div>
    );
};

/**
 * Personality Quiz View
 */
export const Quiz = ({ onComplete, onSkip, onBack }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);

    const questions = [
        {
            title: "What Do You Want to Watch?",
            subtitle: "Pick your preferred content type",
            options: [
                { label: "Movies", desc: "Feature films, 1.5-3 hours", val: -0.8, icon: Film },
                { label: "Series & Anime", desc: "Episodic content, binge-worthy", val: 0.8, icon: Tv },
            ],
        },
        {
            title: "What's Your Vibe?",
            subtitle: "Choose your visual preference",
            options: [
                { label: "Soft & Moody", desc: "Atmospheric, artistic films", val: -0.8, icon: CloudRain },
                { label: "Bold & Bright", desc: "Vibrant, energetic movies", val: 0.8, icon: Sparkles },
            ],
        },
        {
            title: "Story Pace",
            subtitle: "How do you like your narratives?",
            options: [
                { label: "Slow & Thoughtful", desc: "Character-driven dramas", val: -0.7, icon: Wind },
                { label: "Fast & Thrilling", desc: "Action-packed adventures", val: 0.9, icon: Zap },
            ],
        },
        {
            title: "Reality or Fantasy?",
            subtitle: "What kind of world do you want?",
            options: [
                { label: "Reality Based", desc: "Dramas, biopics, documentaries", val: -0.8, icon: HeartHandshake },
                { label: "Fantasy Worlds", desc: "Sci-fi, fantasy, animation", val: 0.9, icon: Rocket },
            ],
        },
        {
            title: "Emotional Tone",
            subtitle: "What feeling are you after?",
            options: [
                { label: "Feel Good", desc: "Comedies, heartwarming stories", val: -0.6, icon: Laugh },
                { label: "Edge of Seat", desc: "Thrillers, horror, suspense", val: 0.8, icon: Ghost },
            ],
        },
        {
            title: "Content Era",
            subtitle: "Classic or contemporary?",
            options: [
                { label: "Classic Cinema", desc: "Timeless films from past decades", val: -0.7, icon: Award },
                { label: "Modern Releases", desc: "Recent content and new voices", val: 0.8, icon: TrendingUp },
            ],
        },
        {
            title: "Complexity Level",
            subtitle: "How much do you want to think?",
            options: [
                { label: "Light & Easy", desc: "Relaxing, straightforward plots", val: -0.7, icon: Smile },
                { label: "Mind-Bending", desc: "Complex narratives, plot twists", val: 0.9, icon: Brain },
            ],
        },
        {
            title: "Who Are You Watching With?",
            subtitle: "Pick your viewing scenario",
            options: [
                { label: "Solo Night", desc: "Just me, deep into the story", val: -0.5, icon: User },
                { label: "Group Watch", desc: "Friends or family, crowd pleasers", val: 0.6, icon: Users },
            ],
        },
    ];

    const handleAnswer = (val) => {
        const newAnswers = [...answers, val];
        if (step < questions.length - 1) {
            setAnswers(newAnswers);
            setStep(step + 1);
        } else {
            while (newAnswers.length < 8) newAnswers.push(0);
            onComplete({ type: "quiz", data: newAnswers });
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-6">
            <div className="max-w-4xl w-full">
                <button onClick={onBack} className="text-white/40 hover:text-white mb-8 flex items-center gap-2">
                    <ArrowRight className="rotate-180" size={16} /> Back
                </button>

                <div className="flex items-center gap-2 mb-8">
                    {questions.map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "bg-orange-500" : "bg-white/10"}`} />
                    ))}
                </div>

                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">Question {step + 1} of {questions.length}</p>
                    <h2 className="text-5xl md:text-6xl font-black italic uppercase mb-2">{questions[step].title}</h2>
                    <p className="text-white/40 text-lg mb-12">{questions[step].subtitle}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {questions[step].options.map((opt) => (
                            <motion.button
                                key={opt.label}
                                onClick={() => handleAnswer(opt.val)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[32px] hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left group"
                            >
                                <opt.icon size={40} className="mb-6 text-orange-500 group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl md:text-3xl font-black italic uppercase mb-2">{opt.label}</h3>
                                <p className="text-white/40 text-sm">{opt.desc}</p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <button onClick={onSkip} className="text-white/30 text-sm hover:text-white/60 transition-colors">Skip quiz → Show popular content</button>
                </div>
            </div>
        </div>
    );
};
/**
 * Main wrapper for Recommendation Method selection
 */
const RecommendationModes = ({ onModeSelect, onSkip, userName, allMovies }) => {
    const [activeView, setActiveView] = useState("selector");

    const handleBack = () => setActiveView("selector");

    return (
        <AnimatePresence mode="wait">
            {activeView === "selector" && (
                <ModeSelector
                    key="selector"
                    onSelectMode={(mode) => {
                        if (mode === "skip") onSkip();
                        else setActiveView(mode);
                    }}
                    userName={userName}
                />
            )}

            {activeView === "quiz" && (
                <Quiz
                    key="quiz"
                    onBack={handleBack}
                    onSkip={onSkip}
                    onComplete={(res) => onModeSelect("quiz", res.data)}
                />
            )}

            {activeView === "genre" && (
                <GenrePicker
                    key="genre"
                    onBack={handleBack}
                    onComplete={(genres) => onModeSelect("genre", genres)}
                />
            )}

            {activeView === "similar" && (
                <FindSimilar
                    key="similar"
                    allMovies={allMovies}
                    onBack={handleBack}
                    onComplete={(source) => onModeSelect("similar", source)}
                />
            )}
        </AnimatePresence>
    );
};

export default RecommendationModes;
