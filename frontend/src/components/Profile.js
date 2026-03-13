import { BarChart3, Clock, Edit2, Settings, Star, User, Save, X, Camera } from "lucide-react";
import { useEffect, useState } from "react";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Usuario Demo",
    avatar: "👤",
    email: "usuario@demo.com",
    bio: "Amante del cine y las series",
    preferences: {
      favoriteGenres: ["Acción", "Ciencia Ficción", "Drama"],
      preferredLanguage: "es",
      autoplay: true,
      notifications: true,
      quality: "HD",
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
    email: profileData.email,
    bio: profileData.bio,
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const availableAvatars = [
    "👤", "🎭", "🎬", "🍿", "🎪", "🎨", "🎵", "🎯", 
    "🌟", "⭐", "🔥", "💎", "🚀", "🎲", "🎸", "📚"
  ];

  useEffect(() => {
    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem("movieflix_profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData((prev) => ({ ...prev, ...parsed }));
      setEditForm({
        name: parsed.name || profileData.name,
        avatar: parsed.avatar || profileData.avatar,
        email: parsed.email || profileData.email,
        bio: parsed.bio || profileData.bio,
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
      
      const totalWatched = watchedContent.length;
      const movies = watchedContent.filter(item => item.type === 'movie').length;
      const series = watchedContent.filter(item => item.type === 'series').length;
      
      // Calcular horas basado en duración promedio
      const totalMinutes = watchedContent.reduce((acc, item) => {
        const duration = item.duration || (item.type === 'movie' ? 120 : 45);
        return acc + duration;
      }, 0);
      const totalHours = Math.round(totalMinutes / 60);

      // Género favorito
      const genreCount = {};
      watchedContent.forEach(item => {
        if (item.genre) {
          genreCount[item.genre] = (genreCount[item.genre] || 0) + 1;
        }
      });
      
      const favoriteGenre = Object.keys(genreCount).length > 0 
        ? Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b)
        : "Sin datos";

      setProfileData(prev => ({
        ...prev,
        stats: {
          totalWatched,
          totalMovies: movies,
          totalSeries: series,
          totalHours,
          favoriteGenre,
        }
      }));

    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      ...profileData,
      name: editForm.name,
      avatar: editForm.avatar,
      email: editForm.email,
      bio: editForm.bio,
    };
    
    setProfileData(updatedProfile);
    localStorage.setItem("movieflix_profile", JSON.stringify(updatedProfile));
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: profileData.name,
      avatar: profileData.avatar,
      email: profileData.email,
      bio: profileData.bio,
    });
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const updatePreference = (key, value) => {
    const updatedProfile = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [key]: value,
      }
    };
    setProfileData(updatedProfile);
    localStorage.setItem("movieflix_profile", JSON.stringify(updatedProfile));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header compacto */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">👤 Mi Perfil</h1>
          <p className="text-red-100">Gestiona tu información y preferencias</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información del perfil */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="text-center mb-6">
                {isEditing ? (
                  <div className="relative inline-block">
                    <button
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="text-6xl bg-gray-700 rounded-full p-4 hover:bg-gray-600 transition-colors relative"
                    >
                      {editForm.avatar}
                      <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1">
                        <Camera size={16} />
                      </div>
                    </button>
                    
                    {showAvatarPicker && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-700 rounded-lg p-4 shadow-lg z-10">
                        <div className="grid grid-cols-4 gap-2 max-w-xs">
                          {availableAvatars.map((avatar) => (
                            <button
                              key={avatar}
                              onClick={() => {
                                setEditForm({...editForm, avatar});
                                setShowAvatarPicker(false);
                              }}
                              className="text-2xl p-2 rounded hover:bg-gray-600 transition-colors"
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-6xl bg-gray-700 rounded-full p-4 inline-block mb-4">
                    {profileData.avatar}
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Biografía</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      placeholder="Cuéntanos sobre tus gustos cinematográficos..."
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Guardar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
                  <p className="text-gray-400 mb-2">{profileData.email}</p>
                  <p className="text-gray-300 text-sm mb-4 italic">{profileData.bio}</p>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <Edit2 size={16} />
                    Editar Perfil
                  </button>
                </div>
              )}
            </div>

            {/* Estadísticas compactas */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Estadísticas
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total visto:</span>
                  <span className="font-bold">{profileData.stats.totalWatched}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Películas:</span>
                  <span className="font-bold text-blue-400">{profileData.stats.totalMovies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Series:</span>
                  <span className="font-bold text-green-400">{profileData.stats.totalSeries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Horas totales:</span>
                  <span className="font-bold text-yellow-400">{profileData.stats.totalHours}h</span>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">Género favorito:</span>
                  <div className="mt-1">
                    <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-sm">
                      {profileData.stats.favoriteGenre}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Preferencias */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings size={20} />
                Preferencias de Usuario
              </h3>
              
              <div className="space-y-6">
                {/* Géneros favoritos */}
                <div>
                  <label className="block text-sm font-medium mb-3">Géneros Favoritos</label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.preferences.favoriteGenres.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-red-600/20 text-red-300 px-3 py-1 rounded-full text-sm border border-red-500/20"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Configuraciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Idioma preferido</label>
                    <select
                      value={profileData.preferences.preferredLanguage}
                      onChange={(e) => updatePreference('preferredLanguage', e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Calidad de video</label>
                    <select
                      value={profileData.preferences.quality}
                      onChange={(e) => updatePreference('quality', e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="4K">4K Ultra HD</option>
                      <option value="HD">HD (1080p)</option>
                      <option value="SD">SD (720p)</option>
                    </select>
                  </div>
                </div>

                {/* Switches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Reproducción automática</span>
                      <p className="text-sm text-gray-400">Reproduce automáticamente el siguiente episodio</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.autoplay}
                        onChange={(e) => updatePreference('autoplay', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Notificaciones</span>
                      <p className="text-sm text-gray-400">Recibe notificaciones de nuevos contenidos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications}
                        onChange={(e) => updatePreference('notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de demo */}
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mt-6">
              <p className="text-blue-200 text-sm">
                <strong>💡 Demo:</strong> Los cambios en tu perfil se guardan en LocalStorage. 
                Tus preferencias se mantendrán hasta que limpies los datos del navegador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;