import {
  Calendar,
  Film,
  Filter,
  Grid,
  List,
  Play,
  Plus,
  Search as SearchIcon,
  Star,
  Tv,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados principales
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' o 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Estados de filtros
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    genre: searchParams.get("genre") || "",
    platform: searchParams.get("platform") || "",
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
    status: searchParams.get("status") || "", // 'watched', 'mylist', 'all'
  });

  // Opciones para filtros
  const filterOptions = {
    types: [
      { value: "", label: "Todos los tipos" },
      { value: "movie", label: "Películas" },
      { value: "series", label: "Series" },
    ],
    genres: [
      { value: "", label: "Todos los géneros" },
      { value: "Acción", label: "Acción" },
      { value: "Aventura", label: "Aventura" },
      { value: "Comedia", label: "Comedia" },
      { value: "Drama", label: "Drama" },
      { value: "Ciencia Ficción", label: "Ciencia Ficción" },
      { value: "Terror", label: "Terror" },
      { value: "Romance", label: "Romance" },
      { value: "Thriller", label: "Thriller" },
      { value: "Fantasía", label: "Fantasía" },
      { value: "Animación", label: "Animación" },
    ],
    platforms: [
      { value: "", label: "Todas las plataformas" },
      { value: "Netflix", label: "Netflix" },
      { value: "Disney+", label: "Disney+" },
      { value: "Prime Video", label: "Prime Video" },
      { value: "HBO Max", label: "HBO Max" },
      { value: "Apple TV+", label: "Apple TV+" },
      { value: "Hulu", label: "Hulu" },
      { value: "Paramount+", label: "Paramount+" },
      { value: "Crunchyroll", label: "Crunchyroll" },
    ],
    years: [
      { value: "", label: "Todos los años" },
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
      { value: "2021", label: "2021" },
      { value: "2020", label: "2020" },
    ],
    ratings: [
      { value: "", label: "Todas las calificaciones" },
      { value: "9", label: "9+ ⭐" },
      { value: "8", label: "8+ ⭐" },
      { value: "7", label: "7+ ⭐" },
      { value: "6", label: "6+ ⭐" },
    ],
    statuses: [
      { value: "", label: "Todo el contenido" },
      { value: "watched", label: "Ya visto" },
      { value: "mylist", label: "En mi lista" },
      { value: "unwatched", label: "Sin ver" },
    ],
  };

  // Cargar contenido inicial
  useEffect(() => {
    loadContent();
  }, []);

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (filters.type) params.set("type", filters.type);
    if (filters.genre) params.set("genre", filters.genre);
    if (filters.platform) params.set("platform", filters.platform);
    if (filters.year) params.set("year", filters.year);
    if (filters.rating) params.set("rating", filters.rating);
    if (filters.status) params.set("status", filters.status);

    setSearchParams(params);
  }, [searchTerm, filters, setSearchParams]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const allContent = await demoApiService.getAllContent();
      setContent(allContent);
    } catch (error) {
      console.error("Error cargando contenido:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar contenido
  const filteredContent = useMemo(() => {
    let result = [...content];

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.genre.toLowerCase().includes(term) ||
          item.platform.toLowerCase().includes(term)
      );
    }

    // Filtro por tipo
    if (filters.type) {
      result = result.filter((item) => item.type === filters.type);
    }

    // Filtro por género
    if (filters.genre) {
      result = result.filter((item) => item.genre === filters.genre);
    }

    // Filtro por plataforma
    if (filters.platform) {
      result = result.filter((item) => item.platform === filters.platform);
    }

    // Filtro por año
    if (filters.year) {
      result = result.filter((item) => item.year.toString() === filters.year);
    }

    // Filtro por calificación
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      result = result.filter((item) => item.rating >= minRating);
    }

    // Filtro por estado
    if (filters.status) {
      const myList = JSON.parse(
        localStorage.getItem("movieflix_mylist") || "[]"
      );
      const watched = JSON.parse(
        localStorage.getItem("movieflix_watched") || "[]"
      );

      switch (filters.status) {
        case "watched":
          result = result.filter((item) =>
            watched.some((w) => w.id === item.id)
          );
          break;
        case "mylist":
          result = result.filter((item) =>
            myList.some((m) => m.id === item.id)
          );
          break;
        case "unwatched":
          result = result.filter(
            (item) => !watched.some((w) => w.id === item.id)
          );
          break;
      }
    }

    return result;
  }, [content, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      genre: "",
      platform: "",
      year: "",
      rating: "",
      status: "",
    });
    setSearchTerm("");
  };

  const handleAddToList = async (contentId) => {
    try {
      await demoApiService.addToMyList(contentId);
      // Recargar contenido para actualizar estado
      loadContent();
    } catch (error) {
      console.error("Error añadiendo a Mi Lista:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <SearchIcon className="w-8 h-8 text-red-500" />
            Buscar Contenido
          </h1>

          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar películas, series, géneros, plataformas..."
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Controles */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>

              {(Object.values(filters).some((f) => f) || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {filteredContent.length} resultados
              </span>
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-red-600" : "hover:bg-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-red-600" : "hover:bg-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="bg-gray-800 p-6 rounded-xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de contenido
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                >
                  {filterOptions.types.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por género */}
              <div>
                <label className="block text-sm font-medium mb-2">Género</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                >
                  {filterOptions.genres.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por plataforma */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Plataforma
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) =>
                    handleFilterChange("platform", e.target.value)
                  }
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                >
                  {filterOptions.platforms.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por año */}
              <div>
                <label className="block text-sm font-medium mb-2">Año</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                >
                  {filterOptions.years.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por calificación */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Calificación mínima
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                >
                  {filterOptions.ratings.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium mb-2">Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                >
                  {filterOptions.statuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-400 mb-4">
              Intenta ajustar los filtros o el término de búsqueda
            </p>
            {(Object.values(filters).some((f) => f) || searchTerm) && (
              <button
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                : "space-y-4"
            }
          >
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer ${
                  viewMode === "list" ? "flex gap-4 p-4" : ""
                }`}
                onClick={() => navigate(`/content/${item.id}`)}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className={`object-cover ${
                    viewMode === "grid"
                      ? "w-full aspect-[2/3]"
                      : "w-20 h-28 rounded-lg"
                  }`}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x450/374151/ffffff?text=Sin+Imagen";
                  }}
                />

                <div className={viewMode === "grid" ? "p-4" : "flex-1"}>
                  <div className="flex items-center gap-2 mb-2">
                    {item.type === "movie" ? (
                      <Film className="w-4 h-4 text-red-500" />
                    ) : (
                      <Tv className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-xs text-gray-400 uppercase font-semibold">
                      {item.type === "movie" ? "Película" : "Serie"}
                    </span>
                  </div>

                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{item.rating}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{item.year}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                      {item.genre}
                    </span>
                    <span className="bg-red-600 px-2 py-1 rounded text-xs">
                      {item.platform}
                    </span>
                  </div>

                  {viewMode === "list" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/content/${item.id}`);
                        }}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        Ver
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToList(item.id);
                        }}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Lista
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
