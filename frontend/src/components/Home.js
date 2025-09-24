import {
  Check,
  Clock,
  Eye,
  Film,
  Star,
  Trash2,
  TrendingUp,
  Tv,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const Home = ({ currentProfile, isDemoMode }) => {
  const [myListContent, setMyListContent] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, [currentProfile]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [myListResponse, contentResponse, statsResponse] =
        await Promise.all([
          demoApiService.getWatchedContent(),
          demoApiService.getContent({ sortBy: "year" }),
          demoApiService.getStatistics(),
        ]);

      if (myListResponse.success) {
        setMyListContent(myListResponse.data);
      }

      if (contentResponse.success) {
        // Get recent content (last 4 items for a single row)
        setRecentContent(contentResponse.data.slice(0, 4));
      }

      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }
    } catch (err) {
      console.error("Error loading home data:", err);
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsWatched = async (content, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newStatus =
        content.watched_status === "completed" ? "pending" : "completed";
      const response = await demoApiService.updateWatchStatus(
        content.id,
        newStatus
      );
      if (response.success) {
        loadHomeData(); // Reload to update the list
      }
    } catch (err) {
      console.error("Error updating watch status:", err);
    }
  };

  const handleDelete = async (content, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      window.confirm(
        `¿Seguro que quieres eliminar "${content.title}" de tu lista?`
      )
    ) {
      try {
        const response = await demoApiService.removeFromWatched(content.id);
        if (response.success) {
          loadHomeData(); // Reload to update the list
        }
      } catch (err) {
        console.error("Error deleting content:", err);
      }
    }
  };

  const formatDuration = (content) => {
    if (content.type === "movie") {
      const duration = content.duration || 120;
      return `${duration} min`;
    } else {
      const seasons = content.seasons || 1;
      const episodeDuration = content.episode_duration || 45;
      return `${seasons} temp • ${episodeDuration} min/ep`;
    }
  };

  const getStatusColor = (status) => {
    return status === "completed" ? "text-green-400" : "text-yellow-400";
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? <Eye size={16} /> : <Clock size={16} />;
  };

  const getStatusText = (status) => {
    return status === "completed" ? "Vista" : "Pendiente";
  };

  if (loading) {
    return <LoadingSpinner message="Cargando tu página principal..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadHomeData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header compacto */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-8 mb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            ¡Bienvenido{currentProfile ? `, ${currentProfile.name}` : ""}! 🎬
          </h1>
          <p className="text-red-100 text-sm md:text-base mb-3">
            Descubre y gestiona tu contenido audiovisual favorito
          </p>
          {isDemoMode && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <span className="text-yellow-300">🚀</span>
              <span>Versión Demo - Explora todas las funcionalidades</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Statistics Section */}
        {statistics && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              📊 Tu Actividad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">
                      {statistics.movies.watched}
                    </h3>
                    <p className="text-gray-300">Películas vistas</p>
                    <span className="text-sm text-gray-400">
                      de {statistics.movies.total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-600 rounded-lg">
                    <Tv className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">
                      {statistics.series.watched}
                    </h3>
                    <p className="text-gray-300">Series vistas</p>
                    <span className="text-sm text-gray-400">
                      de {statistics.series.total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">
                      {statistics.completionRate}%
                    </h3>
                    <p className="text-gray-300">Progreso total</p>
                    <span className="text-sm text-gray-400">
                      {statistics.totalWatched} contenidos
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-600 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">
                      {Object.keys(statistics.platforms).length}
                    </h3>
                    <p className="text-gray-300">Plataformas</p>
                    <span className="text-sm text-gray-400">utilizadas</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mi Lista - Contenido Principal */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📝 Mi Lista ({myListContent.length})
            </h2>
            <Link
              to="/my-list"
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Ver todo →
            </Link>
          </div>

          {myListContent.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Tu lista está vacía</h3>
              <p className="text-gray-400 mb-4">
                Agrega películas y series a tu lista para verlas aquí
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/movies"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Explorar Películas
                </Link>
                <Link
                  to="/series"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Explorar Series
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {myListContent.map((content) => (
                <div
                  key={content.id}
                  className="group relative bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={content.poster_url}
                      alt={content.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                      }}
                    />

                    {/* Status overlay */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                        content.watched_status === "completed"
                          ? "bg-green-600/80"
                          : "bg-yellow-600/80"
                      }`}
                    >
                      {getStatusText(content.watched_status)}
                    </div>

                    {/* Hover overlay with controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleMarkAsWatched(content, e)}
                          className={`p-2 rounded-full transition-colors ${
                            content.watched_status === "completed"
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                          title={
                            content.watched_status === "completed"
                              ? "Marcar como pendiente"
                              : "Marcar como vista"
                          }
                        >
                          {content.watched_status === "completed" ? (
                            <Clock size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleDelete(content, e)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                          title="Eliminar de mi lista"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="p-3">
                    <h3 className="font-bold text-sm truncate mb-1">
                      {content.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        {content.rating}
                      </span>
                      <span>{formatDuration(content)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Content - Una sola fila */}
        {recentContent.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🆕 Contenido Reciente
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={content.poster_url}
                      alt={content.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm truncate mb-1">
                      {content.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{content.year}</span>
                      <span className="flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        {content.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            🚀 Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/search"
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                🔍
              </div>
              <h3 className="text-lg font-bold mb-2">Buscar Contenido</h3>
              <p className="text-gray-400 text-sm">
                Encuentra películas y series
              </p>
            </Link>

            <Link
              to="/my-list"
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="text-lg font-bold mb-2">Mi Lista</h3>
              <p className="text-gray-400 text-sm">Gestiona tu contenido</p>
            </Link>

            <Link
              to="/profile"
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-colors group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                👤
              </div>
              <h3 className="text-lg font-bold mb-2">Mi Perfil</h3>
              <p className="text-gray-400 text-sm">Configurar preferencias</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
