import { BarChart3, Clock, Edit2, Settings, Star, User } from "lucide-react";
import { useEffect, useState } from "react";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Usuario Demo",
    avatar: "👤",
    preferences: {
      favoriteGenres: ["Acción", "Ciencia Ficción", "Drama"],
      preferredLanguage: "es",
      autoplay: true,
      notifications: true,
    },
    stats: {
      totalWatched: 0,
      totalMovies: 0,
      totalSeries: 0,
      totalHours: 0,
      favoriteGenre: "Sin datos",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profileData.name,
    avatar: profileData.avatar,
  });

  useEffect(() => {
    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem("movieflix_profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData((prev) => ({ ...prev, ...parsed }));
      setEditForm({
        name: parsed.name || profileData.name,
        avatar: parsed.avatar || profileData.avatar,
      });
    }

    // Calcular estadísticas desde localStorage
    calculateStats();
  }, []);

  const calculateStats = () => {
    try {
      const watchedContent = JSON.parse(
        localStorage.getItem("movieflix_watched") || "[]"
      );
      const myList = JSON.parse(
        localStorage.getItem("movieflix_mylist") || "[]"
      );

      const movies = watchedContent.filter((item) => item.type === "movie");
      const series = watchedContent.filter((item) => item.type === "series");

      // Calcular género favorito
      const genreCounts = {};
      watchedContent.forEach((item) => {
        if (item.genre) {
          genreCounts[item.genre] = (genreCounts[item.genre] || 0) + 1;
        }
      });

      const favoriteGenre =
        Object.entries(genreCounts).length > 0
          ? Object.entries(genreCounts).reduce((a, b) =>
              genreCounts[a[0]] > genreCounts[b[0]] ? a : b
            )[0]
          : "Sin datos";

      // Estimar horas vistas (promedio 2h por película, 45min por episodio de serie)
      const estimatedHours = movies.length * 2 + series.length * 8; // Asumiendo 8 horas promedio por serie

      setProfileData((prev) => ({
        ...prev,
        stats: {
          totalWatched: watchedContent.length,
          totalMovies: movies.length,
          totalSeries: series.length,
          totalHours: estimatedHours,
          favoriteGenre,
        },
      }));
    } catch (error) {
      console.error("Error calculando estadísticas:", error);
    }
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profileData,
      name: editForm.name,
      avatar: editForm.avatar,
    };

    setProfileData(updatedProfile);
    localStorage.setItem("movieflix_profile", JSON.stringify(updatedProfile));
    setIsEditing(false);
  };

  const handlePreferenceChange = (key, value) => {
    const updatedProfile = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [key]: value,
      },
    };

    setProfileData(updatedProfile);
    localStorage.setItem("movieflix_profile", JSON.stringify(updatedProfile));
  };

  const availableAvatars = [
    "👤",
    "🎭",
    "🎬",
    "🍿",
    "⭐",
    "🎪",
    "🎨",
    "🎵",
    "🎮",
    "📚",
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <User className="w-8 h-8 text-red-500" />
          Mi Perfil
        </h1>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{profileData.avatar}</div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-gray-700 text-white p-2 rounded-lg w-full"
                    placeholder="Nombre del perfil"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {availableAvatars.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, avatar }))
                        }
                        className={`text-2xl p-2 rounded-lg transition-colors ${
                          editForm.avatar === avatar
                            ? "bg-red-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {profileData.name}
                  </h2>
                  <p className="text-gray-400">Perfil de demostración</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar Perfil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <BarChart3 className="w-8 h-8 text-red-500 mb-2" />
            <h3 className="text-lg font-semibold">Total Visto</h3>
            <p className="text-2xl font-bold text-red-500">
              {profileData.stats.totalWatched}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <Star className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="text-lg font-semibold">Películas</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {profileData.stats.totalMovies}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <Clock className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-semibold">Series</h3>
            <p className="text-2xl font-bold text-blue-500">
              {profileData.stats.totalSeries}
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <Clock className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="text-lg font-semibold">Horas Vistas</h3>
            <p className="text-2xl font-bold text-green-500">
              {profileData.stats.totalHours}h
            </p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-500" />
            Preferencias
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Género Favorito
              </label>
              <p className="text-red-400 font-semibold">
                {profileData.stats.favoriteGenre}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Idioma Preferido
              </label>
              <select
                value={profileData.preferences.preferredLanguage}
                onChange={(e) =>
                  handlePreferenceChange("preferredLanguage", e.target.value)
                }
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Reproducción Automática
              </label>
              <button
                onClick={() =>
                  handlePreferenceChange(
                    "autoplay",
                    !profileData.preferences.autoplay
                  )
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  profileData.preferences.autoplay
                    ? "bg-red-600"
                    : "bg-gray-600"
                } relative`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    profileData.preferences.autoplay
                      ? "translate-x-6"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Notificaciones</label>
              <button
                onClick={() =>
                  handlePreferenceChange(
                    "notifications",
                    !profileData.preferences.notifications
                  )
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  profileData.preferences.notifications
                    ? "bg-red-600"
                    : "bg-gray-600"
                } relative`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    profileData.preferences.notifications
                      ? "translate-x-6"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Favorite Genres */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Géneros Favoritos</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.preferences.favoriteGenres.map((genre) => (
              <span
                key={genre}
                className="bg-red-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
