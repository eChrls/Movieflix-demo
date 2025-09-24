import {
  Calendar,
  Check,
  Filter,
  Play,
  Plus,
  Search,
  Star,
  Tv,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    status: "",
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
        setSeries(seriesResponse.data);
      }

      if (platformsResponse.success) {
        setPlatforms(platformsResponse.data);
      }

      if (genresResponse.success) {
        setGenres(genresResponse.data);
      }
    } catch (err) {
      console.error("Error loading series:", err);
      setError("Error al cargar las series");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...series];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (serie) =>
          serie.title.toLowerCase().includes(searchTerm) ||
          serie.description.toLowerCase().includes(searchTerm)
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

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((serie) => serie.status === filters.status);
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
      status: "",
      sortBy: "rating",
    });
  };

  const toggleWatchStatus = async (serieId, currentStatus) => {
    try {
      const newStatus = currentStatus === "pending" ? "watched" : "pending";
      const response = await demoApiService.updateWatchStatus(
        serieId,
        newStatus
      );

      if (response.success) {
        // Update local state
        setSeries((prev) =>
          prev.map((serie) =>
            serie.id === serieId ? { ...serie, status: newStatus } : serie
          )
        );
      }
    } catch (err) {
      console.error("Error updating watch status:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando series..." />;
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
    <div className="series-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            📺 Series
            <span className="count-badge">{filteredSeries.length}</span>
          </h1>
          <p className="page-subtitle">
            Explora y administra tu colección de series
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
              placeholder="Buscar series..."
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

      {/* Series Grid */}
      <div className="series-grid">
        {filteredSeries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h3>No se encontraron series</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
            <button onClick={clearFilters} className="reset-button">
              Mostrar todas las series
            </button>
          </div>
        ) : (
          filteredSeries.map((serie) => (
            <div key={serie.id} className="serie-card">
              <Link to={`/content/${serie.id}`} className="serie-link">
                <div className="serie-poster">
                  <img
                    src={serie.poster_url}
                    alt={serie.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                    }}
                  />
                  <div className="poster-overlay">
                    <Play size={24} />
                  </div>
                  {serie.seasons && (
                    <div className="seasons-badge">
                      <Tv size={12} />
                      {serie.seasons} temporadas
                    </div>
                  )}
                </div>
              </Link>

              <div className="serie-info">
                <Link to={`/content/${serie.id}`} className="serie-title-link">
                  <h3 className="serie-title">{serie.title}</h3>
                </Link>

                <div className="serie-meta">
                  <div className="serie-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{serie.rating}</span>
                  </div>
                  <div className="serie-year">
                    <Calendar size={14} />
                    <span>{serie.year}</span>
                  </div>
                </div>

                <div className="serie-details">
                  <span className="serie-genre">{serie.genre}</span>
                  <span className="serie-platform">{serie.platform}</span>
                </div>

                {serie.seasons && serie.episodes_per_season && (
                  <div className="serie-episodes">
                    <small>
                      {serie.episodes_per_season.reduce((a, b) => a + b, 0)}{" "}
                      episodios totales
                    </small>
                  </div>
                )}

                <p className="serie-description">
                  {serie.description.length > 100
                    ? `${serie.description.substring(0, 100)}...`
                    : serie.description}
                </p>

                <div className="serie-actions">
                  <button
                    className={`watch-button ${serie.status}`}
                    onClick={() => toggleWatchStatus(serie.id, serie.status)}
                  >
                    {serie.status === "watched" ? (
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
            📺 <strong>Demo:</strong> Esta página muestra {series.length} series
            de demostración. En la versión completa, podrías gestionar
            temporadas y episodios individualmente.
          </p>
        </div>
      )}

      <style jsx>{`
        .series-page {
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

        .series-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .serie-card {
          background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .serie-card:hover {
          transform: translateY(-4px);
          border-color: rgba(229, 9, 20, 0.5);
        }

        .serie-link {
          text-decoration: none;
          color: inherit;
        }

        .serie-poster {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .serie-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .serie-card:hover .serie-poster img {
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

        .serie-card:hover .poster-overlay {
          opacity: 1;
        }

        .poster-overlay svg {
          color: white;
        }

        .seasons-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .serie-info {
          padding: 16px;
        }

        .serie-title-link {
          text-decoration: none;
          color: inherit;
        }

        .serie-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          transition: color 0.3s ease;
        }

        .serie-title-link:hover .serie-title {
          color: #e50914;
        }

        .serie-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .serie-rating,
        .serie-year {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .serie-rating {
          color: #fbbf24;
        }

        .serie-year {
          color: #ccc;
        }

        .serie-details {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .serie-genre,
        .serie-platform {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .serie-genre {
          background: rgba(229, 9, 20, 0.2);
          color: #e50914;
        }

        .serie-platform {
          background: rgba(255, 255, 255, 0.1);
          color: #ccc;
        }

        .serie-episodes {
          margin-bottom: 8px;
        }

        .serie-episodes small {
          color: #999;
          font-size: 12px;
        }

        .serie-description {
          color: #ccc;
          font-size: 14px;
          line-height: 1.4;
          margin: 0 0 16px 0;
        }

        .serie-actions {
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
          .series-page {
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

          .series-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Series;
