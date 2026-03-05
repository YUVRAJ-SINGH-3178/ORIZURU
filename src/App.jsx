import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";

// Components
import LoadingScreen from "./components/common/LoadingScreen";
import LandingPage from "./components/auth/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import OnboardingTutorial from "./components/auth/OnboardingTutorial";
import RecommendationModes from "./components/discovery/RecommendationModes";
import Discovery from "./components/discovery/Discovery";
import InfoModal from "./components/common/InfoModal";

// Services & Utils
import tmdbService from "./services/tmdb";
import movieDatabase from "./services/movieDatabase";
import scoringEngine from "./services/recommendations";
import { storage } from "./utils/storage";
import { useToast } from "./context/ToastContext";

// Constants
import { Info, ShieldCheck, FileText, Mail } from "lucide-react";

/**
 * ORIZURU AI - PRODUCTION GRADE ARCHITECTURE
 */
const App = () => {
  // --- AUTH & VIEW STATE ---
  const [user, setUser] = useState(() => storage.get("user"));
  const [view, setView] = useState(user ? "discovery" : "landing");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // --- MOVIE DATA STATE ---
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [movieCount, setMovieCount] = useState(0);

  const initRef = useRef(false);

  // --- DISCOVERY CONFIG ---
  const [recMode, setRecMode] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [similarSource, setSimilarSource] = useState(null);
  const [watchlist, setWatchlist] = useState(() => storage.get("watchlist", []));
  const [watchHistory, setWatchHistory] = useState(() => storage.get("watch_history", []));
  const [recentlyViewed, setRecentlyViewed] = useState(() => storage.get("recently_viewed", []));

  // --- GLOBAL UI MODALS ---
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const { addToast } = useToast();

  // --- INITIALIZATION ---
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initData = async () => {
      try {
        setIsInitializing(true);
        // Step 1: Initialize local movie database
        await movieDatabase.initialize((progress, count) => {
          setLoadingProgress(Math.floor(progress));
          setMovieCount(count);
        });

        // Step 2: Fetch all titles for the catalog
        const titles = await movieDatabase.getAllTitles();
        setAllMovies(titles);

        // Step 3: Set initial discovery set (Trending)
        const trending = titles
          .filter(m => parseFloat(m.imdb) >= 7.5)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 40);

        setMovies(trending.length > 0 ? trending : titles.slice(0, 40));
        setRecMode("trending");

        console.log("App initialized with", titles.length, "titles.");
      } catch (err) {
        console.error("Initialization Failed:", err);
        addToast("Initialization error. Check console.", "error");
      } finally {
        setTimeout(() => setIsInitializing(false), 800);
      }
    };
    initData();
  }, [addToast]);

  // --- PERSISTENCE ---
  useEffect(() => { storage.set("user", user); }, [user]);
  useEffect(() => { storage.set("watchlist", watchlist); }, [watchlist]);
  useEffect(() => { storage.set("watch_history", watchHistory); }, [watchHistory]);
  useEffect(() => { storage.set("recently_viewed", recentlyViewed); }, [recentlyViewed]);

  // --- ACTIONS ---
  const handleAuthSuccess = (userData, isNew) => {
    setUser(userData);
    setView("discovery");
    if (isNew) setShowOnboarding(true);
    addToast(`Welcome back, ${userData.name}!`, "success");
  };

  const handleLogout = useCallback(() => {
    setUser(null);
    setView("landing");
    setRecMode(null);
    addToast("Signed out successfully.", "info");
  }, [addToast]);

  const handleRefresh = useCallback(async (forcedMode = null) => {
    const activeMode = forcedMode || recMode;
    // Generate new picks based on current mode
    const watchedIds = new Set(watchHistory.map(m => m.id));
    let newPicks = [];

    if (activeMode === "trending") {
      newPicks = allMovies
        .filter(m => !watchedIds.has(m.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 40);
    } else if (activeMode === "quiz" && user?.vectors) {
      newPicks = scoringEngine.recommend(allMovies, user.vectors, 40, watchHistory, watchedIds);
    } else if (activeMode === "genre" && selectedGenres.length) {
      newPicks = scoringEngine.getRecommendationsByGenres(selectedGenres, allMovies, 40, watchedIds);
    } else if (activeMode === "similar" && similarSource) {
      newPicks = scoringEngine.getSimilarMovies(similarSource, allMovies, 40, watchedIds);
    } else {
      newPicks = allMovies.filter(m => !watchedIds.has(m.id)).slice(0, 40);
    }

    setMovies(newPicks.length > 0 ? newPicks : allMovies.slice(0, 40));
  }, [allMovies, recMode, user, selectedGenres, similarSource, watchHistory]);

  const toggleWatchlist = useCallback((movie) => {
    setWatchlist(prev => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) {
        addToast(`Removed ${movie.title} from list`, "info");
        return prev.filter(m => m.id !== movie.id);
      }
      addToast(`Saved ${movie.title} to watchlist!`, "success");
      return [movie, ...prev];
    });
  }, [addToast]);

  const markWatched = useCallback((movie) => {
    if (!watchHistory.find(h => h.id === movie.id)) {
      setWatchHistory(prev => [movie, ...prev]);
      setWatchlist(prev => prev.filter(m => m.id !== movie.id));
      addToast(`Marked ${movie.title} as seen.`, "success");
    }
  }, [watchHistory, addToast]);

  const removeWatched = useCallback((id) => {
    setWatchHistory(prev => prev.filter(h => h.id !== id));
    addToast("Removed from history.", "info");
  }, [addToast]);

  // --- RENDER ---
  if (isInitializing) return <LoadingScreen progress={loadingProgress} movieCount={movieCount} />;

  return (
    <div className="min-h-screen bg-[#020308] text-white selection:bg-orange-500 selection:text-white overflow-x-hidden font-outfit">
      <AnimatePresence mode="wait">
        {view === "landing" && (
          <LandingPage key="landing" onStart={() => setView("login")} />
        )}

        {view === "login" && (
          <LoginPage key="login" onAuthSuccess={handleAuthSuccess} onBack={() => setView("landing")} />
        )}

        {view === "discovery" && (
          <div key="discovery" className="min-h-screen">
            {!recMode ? (
              <RecommendationModes
                onModeSelect={(mode, data) => {
                  setRecMode(mode);
                  if (mode === "quiz") {
                    setUser(prev => ({ ...prev, vectors: data }));
                  }
                  if (mode === "genre") setSelectedGenres(data);
                  if (mode === "similar") setSimilarSource(data);

                  // Force refresh with new mode immediately to avoid stale state
                  handleRefresh(mode);
                }}
                onSkip={() => {
                  setRecMode("trending");
                  handleRefresh("trending");
                }}
                userName={user?.name || "Member"}
                allMovies={allMovies}
              />
            ) : (
              <Discovery
                movies={movies}
                allMovies={allMovies}
                user={user}
                onLogout={handleLogout}
                onRefresh={handleRefresh}
                onRetakeQuiz={() => setRecMode(null)}
                recMode={recMode}
                setRecMode={setRecMode}
                similarSource={similarSource}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
                watchHistory={watchHistory}
                onMarkWatched={markWatched}
                onRemoveWatched={removeWatched}
                recentlyViewed={recentlyViewed}
                onThemeChange={(t) => document.documentElement.className = t}
                setShowOnboarding={setShowOnboarding}
                setShowAbout={setShowAbout}
                setShowPrivacy={setShowPrivacy}
                setShowTerms={setShowTerms}
                setShowContact={setShowContact}
              />
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Global Overlays */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTutorial key="tutorial" userName={user?.name} onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      <InfoModal isOpen={showAbout} onClose={() => setShowAbout(false)} title="About ORIZURU" icon={Info}>
        <div className="space-y-4">
          <p>ORIZURU AI is a next-generation cinematic discovery engine designed for movie connoisseurs.</p>
          <p>Our goal is to transcend simple streaming recommendations. We use complex vector mappings to understand the nuances of storytelling, mood, and visual style — delivering suggestions that feel truly human.</p>
        </div>
      </InfoModal>

      <InfoModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy" icon={ShieldCheck}>
        <div className="space-y-4">
          <p>Your privacy is non-negotiable. At ORIZURU, we prioritize data minimization.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not sell your watch data to third parties.</li>
            <li>Your preferences are encrypted and stored securely.</li>
            <li>You have full control to clear your history at any time.</li>
          </ul>
        </div>
      </InfoModal>

      <InfoModal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service" icon={FileText}>
        <div className="space-y-4">
          <p>By using ORIZURU, you agree to our fair use guidelines.</p>
          <p>ORIZURU is a discovery platform. We do not host copyrighted video content; we provide links and metadata to help you find content on legitimate streaming platforms.</p>
        </div>
      </InfoModal>

      <InfoModal isOpen={showContact} onClose={() => setShowContact(false)} title="Get in Touch" icon={Mail}>
        <div className="space-y-4">
          <p>Facing issues or have ideas? We're always listening.</p>
          <a href="mailto:support@orizuru.ai" className="block p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-orange-500 transition-colors">
            <p className="text-[10px] text-white/40 uppercase font-black">Email Support</p>
            <p className="font-bold">support@orizuru.ai</p>
          </a>
          <p className="text-sm text-white/40 italic">Response time is usually within 24 hours.</p>
        </div>
      </InfoModal>
    </div>
  );
};

export default App;
