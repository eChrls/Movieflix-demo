import { Calendar, Clock, Filter, Search, Star, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const Series = ({ currentProfile, isDemoMode }) => {
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    platform: "",
    genre: "",
    sortBy: "rating",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [series, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [seriesResponse, platformsResponse, genresResponse] =
        await Promise.all([
          demoApiService.getContent({ type: "series" }),
          demoApiService.getPlatforms(),
          demoApiService.getGenres(),
        ]);

      if (seriesResponse.success) {
        setSeries(seriesResponse.data || []);
      }

      if (platformsResponse.success) {
        setPlatforms(platformsResponse.data || []);
      }

      if (genresResponse.success) {
        setGenres(genresResponse.data || []);
      }
    } catch (err) {
      console.error("Error loading series:", err);
      setError("Error al cargar las series");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!series || series.length === 0) {
      setFilteredSeries([]);
      return;
    }

    let filtered = [...series];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (serie) =>
          (serie.title && serie.title.toLowerCase().includes(searchTerm)) ||
          (serie.description &&
            serie.description.toLowerCase().includes(searchTerm))
      );
    }

    // Platform filter
    if (filters.platform) {
      filtered = filtered.filter(
        (serie) => serie.platform === filters.platform
      );
    }

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter((serie) => serie.genre === filters.genre);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "year":
          return (b.year || 0) - (a.year || 0);
        case "rating":
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    setFilteredSeries(filtered);
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
      platform: "",
      genre: "",
      sortBy: "rating",
    });
  };

  const handleAddToWatched = async (serie, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await demoApiService.addToWatched(serie.id, "pending");
      if (response.success) {
        // Optionally refresh data or show success message
        console.log("Serie agregada a la lista");
      }
    } catch (err) {
      console.error("Error adding to watched:", err);
    }
  };

  const formatDuration = (serie) => {
    const seasons = serie.seasons || 1;
    const episodeDuration = serie.episode_duration || 45;
    return `${seasons} temp • ${episodeDuration} min/ep`;
  };

  if (loading) {
    return <LoadingSpinner message="Cargando series..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadData}
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-8 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                <Tv className="w-8 h-8" />
                Series
                <span className="text-lg bg-purple-500 px-2 py-1 rounded-full">
                  {filteredSeries.length}
                </span>
              </h1>
              <p className="text-purple-100">
                Explora y administra tu colección de series
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar series..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-800 rounded-lg p-6 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Platform Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Plataforma
                  </label>
                  <select
                    value={filters.platform}
                    onChange={(e) =>
                      handleFilterChange("platform", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Todas las plataformas</option>
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Género
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) =>
                      handleFilterChange("genre", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Todos los géneros</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="rating">Calificación</option>
                    <option value="title">Título</option>
                    <option value="year">Año</option>
                  </select>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Series Grid */}
        {filteredSeries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-bold mb-2">No se encontraron series</h3>
            <p className="text-gray-400 mb-6">
              {filters.search || filters.platform || filters.genre
                ? "Intenta ajustar tus filtros de búsqueda"
                : "No hay series disponibles en este momento"}
            </p>
            {(filters.search || filters.platform || filters.genre) && (
              <button
                onClick={clearFilters}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredSeries.map((serie) => (
              <div
                key={serie.id}
                className="group relative bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-105"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={serie.poster_url}
                    alt={serie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                    }}
                  />

                  {/* Hover overlay with controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => handleAddToWatched(serie, e)}
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                      title="Agregar a mi lista"
                    >
                      <Clock size={16} />
                    </button>
                  </div>
                </div>

                {/* Info section */}
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">
                    {serie.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {serie.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={10} fill="currentColor" />
                      {serie.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDuration(serie)}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-gray-700 px-2 py-1 rounded">
                      {serie.platform}
                    </span>
                    <span className="bg-gray-700 px-2 py-1 rounded">
                      {serie.genre}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Series;
