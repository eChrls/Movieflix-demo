import {
  Calendar,
  Check,
  Filter,
  Play,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const Movies = ({ currentProfile, isDemoMode }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    platform: "",
    genre: "",
    status: "",
    sortBy: "rating",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [movies, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [moviesResponse, platformsResponse, genresResponse] =
        await Promise.all([
          demoApiService.getContent({ type: "movie" }),
          demoApiService.getPlatforms(),
          demoApiService.getGenres(),
        ]);

      if (moviesResponse.success) {
        setMovies(moviesResponse.data);
      }

      if (platformsResponse.success) {
        setPlatforms(platformsResponse.data);
      }

      if (genresResponse.success) {
        setGenres(genresResponse.data);
      }
    } catch (err) {
      console.error("Error loading movies:", err);
      setError("Error al cargar las películas");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...movies];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.description.toLowerCase().includes(searchTerm)
      );
    }

    // Platform filter
    if (filters.platform) {
      filtered = filtered.filter(
        (movie) => movie.platform === filters.platform
      );
    }

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter((movie) => movie.genre === filters.genre);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((movie) => movie.status === filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return b.year - a.year;
        case "rating":
        default:
          return b.rating - a.rating;
      }
    });

    setFilteredMovies(filtered);
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
      status: "",
      sortBy: "rating",
    });
  };

  const toggleWatchStatus = async (movieId, currentStatus) => {
    try {
      const newStatus = currentStatus === "pending" ? "watched" : "pending";
      const response = await demoApiService.updateWatchStatus(
        movieId,
        newStatus
      );

      if (response.success) {
        // Update local state
        setMovies((prev) =>
          prev.map((movie) =>
            movie.id === movieId ? { ...movie, status: newStatus } : movie
          )
        );
      }
    } catch (err) {
      console.error("Error updating watch status:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando películas..." />;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={loadData}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="movies-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            🎬 Películas
            <span className="count-badge">{filteredMovies.length}</span>
          </h1>
          <p className="page-subtitle">
            Descubre y gestiona tu colección de películas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar películas..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <button
            className={`filters-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filtros
            {showFilters && (
              <span className="filter-count">
                {
                  Object.values(filters).filter((v) => v && v !== "rating")
                    .length
                }
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Plataforma</label>
                <select
                  value={filters.platform}
                  onChange={(e) =>
                    handleFilterChange("platform", e.target.value)
                  }
                >
                  <option value="">Todas las plataformas</option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Género</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                >
                  <option value="">Todos los géneros</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Estado</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="watched">Vistas</option>
                  <option value="watching">Viendo</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Ordenar por</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="rating">Calificación</option>
                  <option value="year">Año</option>
                  <option value="title">Título</option>
                </select>
              </div>
            </div>

            <div className="filters-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <div className="movies-grid">
        {filteredMovies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No se encontraron películas</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
            <button onClick={clearFilters} className="reset-button">
              Mostrar todas las películas
            </button>
          </div>
        ) : (
          filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/content/${movie.id}`} className="movie-link">
                <div className="movie-poster">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                    }}
                  />
                  <div className="poster-overlay">
                    <Play size={24} />
                  </div>
                </div>
              </Link>

              <div className="movie-info">
                <Link to={`/content/${movie.id}`} className="movie-title-link">
                  <h3 className="movie-title">{movie.title}</h3>
                </Link>

                <div className="movie-meta">
                  <div className="movie-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{movie.rating}</span>
                  </div>
                  <div className="movie-year">
                    <Calendar size={14} />
                    <span>{movie.year}</span>
                  </div>
                </div>

                <div className="movie-details">
                  <span className="movie-genre">{movie.genre}</span>
                  <span className="movie-platform">{movie.platform}</span>
                </div>

                <p className="movie-description">
                  {movie.description.length > 100
                    ? `${movie.description.substring(0, 100)}...`
                    : movie.description}
                </p>

                <div className="movie-actions">
                  <button
                    className={`watch-button ${movie.status}`}
                    onClick={() => toggleWatchStatus(movie.id, movie.status)}
                  >
                    {movie.status === "watched" ? (
                      <>
                        <Check size={16} />
                        Vista
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Marcar como vista
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isDemoMode && (
        <div className="demo-note">
          <p>
            🎬 <strong>Demo:</strong> Esta página muestra {movies.length}{" "}
            películas de demostración. En la versión completa, podrías agregar,
            editar y eliminar contenido.
          </p>
        </div>
      )}

      <style jsx>{`
        .movies-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: white;
          padding: 20px;
        }

        .page-header {
          text-align: center;
          padding: 40px 20px;
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .count-badge {
          background: #e50914;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #ccc;
          margin: 0;
        }

        .filters-section {
          margin-bottom: 30px;
        }

        .filters-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 16px;
        }

        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          color: #666;
        }

        .search-box input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          color: white;
          font-size: 14px;
        }

        .search-box input:focus {
          outline: none;
          border-color: #e50914;
        }

        .filters-toggle {
          background: #2a2a2a;
          border: 1px solid #444;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .filters-toggle.active {
          background: #e50914;
          border-color: #e50914;
        }

        .filter-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
        }

        .filters-panel {
          background: #1f1f1f;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 20px;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 14px;
          color: #ccc;
          font-weight: 500;
        }

        .filter-group select {
          padding: 8px 12px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 6px;
          color: white;
          font-size: 14px;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #e50914;
        }

        .filters-actions {
          display: flex;
          justify-content: flex-end;
        }

        .clear-filters-btn {
          background: transparent;
          border: 1px solid #666;
          color: #ccc;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-filters-btn:hover {
          border-color: #e50914;
          color: #e50914;
        }

        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .movie-card {
          background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .movie-card:hover {
          transform: translateY(-4px);
          border-color: rgba(229, 9, 20, 0.5);
        }

        .movie-link {
          text-decoration: none;
          color: inherit;
        }

        .movie-poster {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .movie-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .movie-card:hover .movie-poster img {
          transform: scale(1.05);
        }

        .poster-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .movie-card:hover .poster-overlay {
          opacity: 1;
        }

        .poster-overlay svg {
          color: white;
        }

        .movie-info {
          padding: 16px;
        }

        .movie-title-link {
          text-decoration: none;
          color: inherit;
        }

        .movie-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          transition: color 0.3s ease;
        }

        .movie-title-link:hover .movie-title {
          color: #e50914;
        }

        .movie-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .movie-rating,
        .movie-year {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .movie-rating {
          color: #fbbf24;
        }

        .movie-year {
          color: #ccc;
        }

        .movie-details {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .movie-genre,
        .movie-platform {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .movie-genre {
          background: rgba(229, 9, 20, 0.2);
          color: #e50914;
        }

        .movie-platform {
          background: rgba(255, 255, 255, 0.1);
          color: #ccc;
        }

        .movie-description {
          color: #ccc;
          font-size: 14px;
          line-height: 1.4;
          margin: 0 0 16px 0;
        }

        .movie-actions {
          display: flex;
          gap: 8px;
        }

        .watch-button {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #444;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .watch-button.pending {
          background: transparent;
          color: white;
        }

        .watch-button.pending:hover {
          background: #e50914;
          border-color: #e50914;
        }

        .watch-button.watched {
          background: #22c55e;
          border-color: #22c55e;
          color: white;
        }

        .watch-button.watched:hover {
          background: #16a34a;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #ccc;
        }

        .empty-state p {
          color: #999;
          margin: 0 0 20px 0;
        }

        .reset-button {
          background: #e50914;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .demo-note {
          margin-top: 40px;
          padding: 16px;
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 8px;
          text-align: center;
        }

        .demo-note p {
          margin: 0;
          color: #ccc;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .movies-page {
            padding: 16px;
          }

          .page-title {
            font-size: 2rem;
            flex-direction: column;
            gap: 8px;
          }

          .filters-header {
            flex-direction: column;
            align-items: stretch;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .movies-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Movies;
