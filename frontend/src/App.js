import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./index.css";

// Components
import ContentDetail from "./components/ContentDetail";
import DemoInfo from "./components/DemoInfo";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./components/Home";
import LoadingSpinner from "./components/LoadingSpinner";
import Movies from "./components/Movies";
import MyList from "./components/MyList";
import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./components/Search";
import Series from "./components/Series";

// Services
import demoApiService from "./services/demoApiService";

function App() {
  // State management
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode] = useState(true); // Always true for demo version

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize demo data if needed
      await demoApiService.initializeDemoData();

      // Load profiles
      const profilesResponse = await demoApiService.getProfiles();
      if (profilesResponse.success) {
        setProfiles(profilesResponse.data);
      }

      // Load current profile or create default
      let currentProfileResponse = await demoApiService.getCurrentProfile();
      if (!currentProfileResponse.success || !currentProfileResponse.data) {
        // Create default profile
        const defaultProfile = {
          id: 1,
          name: "Usuario Demo",
          avatar: "👤",
          isDefault: true,
        };
        await demoApiService.createProfile(defaultProfile);
        await demoApiService.setCurrentProfile(1);
        currentProfileResponse = await demoApiService.getCurrentProfile();
      }

      if (currentProfileResponse.success) {
        setCurrentProfile(currentProfileResponse.data);
      }
    } catch (err) {
      console.error("Error inicializando la aplicación:", err);
      setError("Error al cargar la aplicación. Por favor, recarga la página.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = async (profileId) => {
    try {
      const response = await demoApiService.setCurrentProfile(profileId);
      if (response.success) {
        setCurrentProfile(response.data);
      }
    } catch (err) {
      console.error("Error cambiando perfil:", err);
    }
  };

  const handleCreateProfile = async (profileData) => {
    try {
      const response = await demoApiService.createProfile(profileData);
      if (response.success) {
        // Reload profiles
        const profilesResponse = await demoApiService.getProfiles();
        if (profilesResponse.success) {
          setProfiles(profilesResponse.data);
        }
        return response;
      }
    } catch (err) {
      console.error("Error creando perfil:", err);
      throw err;
    }
  };

  const handleResetDemo = async () => {
    try {
      demoApiService.resetDemoData();
      await initializeApp();
    } catch (err) {
      console.error("Error reiniciando demo:", err);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Error de Aplicación
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen bg-gray-900">
          {/* Demo Info Banner */}
          <DemoInfo onResetDemo={handleResetDemo} />

          {/* Navigation */}
          <Navigation
            currentProfile={currentProfile}
            profiles={profiles}
            onProfileChange={handleProfileChange}
            onCreateProfile={handleCreateProfile}
            isDemoMode={isDemoMode}
          />

          {/* Main Content */}
          <main className="pt-16">
            {" "}
            {/* Padding top for fixed navigation */}
            <Routes>
              {/* Home Route */}
              <Route
                path="/"
                element={
                  <Home
                    currentProfile={currentProfile}
                    isDemoMode={isDemoMode}
                  />
                }
              />

              {/* Movies Route */}
              <Route
                path="/movies"
                element={
                  <Movies
                    currentProfile={currentProfile}
                    isDemoMode={isDemoMode}
                  />
                }
              />

              {/* Series Route */}
              <Route
                path="/series"
                element={
                  <Series
                    currentProfile={currentProfile}
                    isDemoMode={isDemoMode}
                  />
                }
              />

              {/* My List Route */}
              <Route
                path="/my-list"
                element={
                  <MyList
                    currentProfile={currentProfile}
                    isDemoMode={isDemoMode}
                  />
                }
              />
              <Route
                path="/mylist"
                element={<Navigate to="/my-list" replace />}
              />

              {/* Profile Route */}
              <Route path="/profile" element={<Profile />} />

              {/* Search Route */}
              <Route path="/search" element={<Search />} />

              {/* Content Detail Route */}
              <Route path="/content/:id" element={<ContentDetail />} />

              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-gray-400 py-8 mt-16">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  🎬 MovieFlix Demo
                </h3>
                <p className="text-sm">
                  Aplicación de demostración - Todos los datos son simulados
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm mb-4">
                <span>React 18</span>
                <span>•</span>
                <span>Tailwind CSS</span>
                <span>•</span>
                <span>Node.js</span>
                <span>•</span>
                <span>Demo Mode</span>
              </div>

              <div className="text-xs text-gray-500">
                © 2024 MovieFlix Demo - Proyecto de Portfolio
              </div>
            </div>
          </footer>

          {/* Scroll to Top Button */}
          <ScrollToTop />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
