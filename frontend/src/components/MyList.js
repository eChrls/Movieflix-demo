import {
  Bookmark,
  Calendar,
  Eye,
  Filter,
  Play,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const MyList = ({ currentProfile, isDemoMode }) => {
  const [watchedContent, setWatchedContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    sortBy: "watched_date",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadWatchedContent();
  }, [currentProfile]);

  useEffect(() => {
    applyFilters();
  }, [watchedContent, filters]);

  const loadWatchedContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await demoApiService.getWatchedContent();

      if (response.success) {
        setWatchedContent(response.data);
      } else {
        setError("Error al cargar el contenido");
      }
    } catch (err) {
      console.error("Error loading watched content:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...watchedContent];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.genre.toLowerCase().includes(searchTerm) ||
          item.platform.toLowerCase().includes(searchTerm)
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (item) => item.watched_status === filters.status
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return b.rating - a.rating;
        case "year":
          return b.year - a.year;
        case "watched_date":
        default:
          return new Date(b.watched_date) - new Date(a.watched_date);
      }
    });

    setFilteredContent(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      status: "",
      sortBy: "watched_date",
    });
  };

  const removeFromList = async (contentId) => {
    try {
      const response = await demoApiService.removeFromWatched(contentId);

      if (response.success) {
        setWatchedContent((prev) =>
          prev.filter((item) => item.id !== contentId)
        );
      }
    } catch (err) {
      console.error("Error removing from list:", err);
    }
  };

  const updateWatchStatus = async (contentId, status) => {
    try {
      const response = await demoApiService.updateWatchStatus(
        contentId,
        status
      );

      if (response.success) {
        setWatchedContent((prev) =>
          prev.map((item) =>
            item.id === contentId
              ? {
                  ...item,
                  watched_status: status,
                  watched_date: new Date().toISOString(),
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error updating watch status:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando tu lista personal..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadWatchedContent}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Separar contenido por estado
  const watchedItems = filteredContent.filter(
    (item) =>
      item.watched_status === "completed" || item.watched_status === "watched"
  );

  const pendingItems = filteredContent.filter(
    (item) =>
      item.watched_status === "pending" ||
      item.watched_status === "watchlist" ||
      !item.watched_status
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            📝 Mi Lista Personal
            <span className="bg-white/20 px-3 py-1 rounded-full text-lg">
              {filteredContent.length}
            </span>
          </h1>
          <p className="text-red-100 text-lg">
            {currentProfile
              ? `Lista de ${currentProfile.name}`
              : "Tu contenido marcado"}
          </p>
        </div>
      </div>

      {watchedContent.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">📝</div>
          <h2 className="text-2xl font-bold mb-4">Tu lista está vacía</h2>
          <p className="text-gray-400 mb-8">
            Comienza agregando películas y series que hayas visto o quieras ver
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explorar Películas
            </Link>
            <Link
              to="/series"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Explorar Series
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Filtros y búsqueda</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-red-400 hover:text-red-300"
              >
                <Filter size={20} />
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar en tu lista..."
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  <option value="movie">Películas</option>
                  <option value="series">Series</option>
                </select>

                <select
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="completed">Visto</option>
                  <option value="pending">Pendiente</option>
                </select>

                <select
                  className="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="watched_date">Fecha agregado</option>
                  <option value="rating">Calificación</option>
                  <option value="year">Año</option>
                  <option value="title">Título</option>
                </select>
              </div>
            )}

            {(filters.search || filters.type || filters.status) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-red-400 hover:text-red-300 text-sm"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-400 mb-4">
                Intenta ajustar los filtros de búsqueda
              </p>
              <button
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Mostrar todo el contenido
              </button>
            </div>
          ) : (
            <>
              {/* Sección: Ya Visto */}
              {watchedItems.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-green-500 rounded"></div>
                    <h2 className="text-2xl font-bold text-white">
                      ✅ Ya Visto ({watchedItems.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {watchedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                      >
                        <div className="block relative">
                          <img
                            src={item.poster_url}
                            alt={item.title}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-sm mb-2 truncate">
                            {item.title}
                          </h3>

                          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <Star size={12} fill="currentColor" />
                              {item.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {item.year}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">
                              ✅ Completado
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  updateWatchStatus(item.id, "pending")
                                }
                                className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                                title="Marcar como pendiente"
                              >
                                <Bookmark size={14} />
                              </button>
                              <button
                                onClick={() => removeFromList(item.id)}
                                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                title="Eliminar de mi lista"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección: Pendientes de Ver */}
              {pendingItems.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-yellow-500 rounded"></div>
                    <h2 className="text-2xl font-bold text-white">
                      ⏳ Pendientes de Ver ({pendingItems.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {pendingItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                      >
                        <div className="block relative">
                          <img
                            src={item.poster_url}
                            alt={item.title}
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-sm mb-2 truncate">
                            {item.title}
                          </h3>

                          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                              <Star size={12} fill="currentColor" />
                              {item.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {item.year}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-xs">
                              ⏳ Pendiente
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  updateWatchStatus(item.id, "completed")
                                }
                                className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                                title="Marcar como visto"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => removeFromList(item.id)}
                                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                title="Eliminar de mi lista"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isDemoMode && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 text-center">
            <p className="text-blue-200">
              📝 <strong>Demo:</strong> Esta lista utiliza LocalStorage para
              persistir tus datos. Los cambios se guardan automáticamente en tu
              navegador.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyList;
