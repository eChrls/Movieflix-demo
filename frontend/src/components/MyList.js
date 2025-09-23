import {
  Bookmark,
  Calendar,
  Clock,
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
        setError(response.message || "Error al cargar el contenido");
      }
    } catch (err) {
      console.error("Error loading watched content:", err);
      setError("Error al cargar tu lista personal");
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
          item.description.toLowerCase().includes(searchTerm) ||
          item.platform.toLowerCase().includes(searchTerm) ||
          item.genre.toLowerCase().includes(searchTerm)
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

    // Sort
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "watched":
        return <Eye size={14} />;
      case "watching":
        return <Clock size={14} />;
      default:
        return <Bookmark size={14} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "watched":
        return "#22c55e";
      case "watching":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner message="Cargando tu lista..." />;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={loadWatchedContent}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="my-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            📝 Mi Lista Personal
            <span className="count-badge">{filteredContent.length}</span>
          </h1>
          <p className="page-subtitle">
            {currentProfile
              ? `Lista de ${currentProfile.name}`
              : "Tu contenido marcado"}
          </p>
        </div>
      </div>

      {watchedContent.length === 0 ? (
        <div className="empty-list">
          <div className="empty-icon">📝</div>
          <h2>Tu lista está vacía</h2>
          <p>
            Comienza agregando películas y series que hayas visto o quieras ver
          </p>
          <div className="empty-actions">
            <Link to="/movies" className="cta-button">
              Explorar Películas
            </Link>
            <Link to="/series" className="cta-button">
              Explorar Series
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="filters-section">
            <div className="filters-header">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar en tu lista..."
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
                      Object.values(filters).filter(
                        (v) => v && v !== "watched_date"
                      ).length
                    }
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="filters-panel">
                <div className="filters-grid">
                  <div className="filter-group">
                    <label>Tipo de contenido</label>
                    <select
                      value={filters.type}
                      onChange={(e) =>
                        handleFilterChange("type", e.target.value)
                      }
                    >
                      <option value="">Películas y Series</option>
                      <option value="movie">Solo Películas</option>
                      <option value="series">Solo Series</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Estado</label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="">Todos los estados</option>
                      <option value="watched">Visto</option>
                      <option value="watching">Viendo</option>
                      <option value="pending">Pendiente</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Ordenar por</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value)
                      }
                    >
                      <option value="watched_date">Fecha agregado</option>
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

          {/* Content List */}
          <div className="content-list">
            {filteredContent.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No se encontraron resultados</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
                <button onClick={clearFilters} className="reset-button">
                  Mostrar todo el contenido
                </button>
              </div>
            ) : (
              <div className="content-grid">
                {filteredContent.map((item) => (
                  <div key={item.id} className="content-item">
                    <Link to={`/content/${item.id}`} className="content-link">
                      <div className="content-poster">
                        <img
                          src={item.poster_url}
                          alt={item.title}
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

                    <div className="content-info">
                      <div className="content-header">
                        <Link
                          to={`/content/${item.id}`}
                          className="content-title-link"
                        >
                          <h3 className="content-title">{item.title}</h3>
                        </Link>

                        <button
                          className="remove-button"
                          onClick={() => removeFromList(item.id)}
                          title="Eliminar de mi lista"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="content-meta">
                        <div className="content-rating">
                          <Star size={14} fill="currentColor" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="content-year">
                          <Calendar size={14} />
                          <span>{item.year}</span>
                        </div>
                        <div className="content-type">
                          {item.type === "movie" ? "🎬" : "📺"}
                        </div>
                      </div>

                      <div className="content-details">
                        <span className="content-genre">{item.genre}</span>
                        <span className="content-platform">
                          {item.platform}
                        </span>
                      </div>

                      <div className="watched-info">
                        <div
                          className="status-badge"
                          style={{
                            background: getStatusColor(item.watched_status),
                          }}
                        >
                          {getStatusIcon(item.watched_status)}
                          <span>
                            {item.watched_status === "watched"
                              ? "Visto"
                              : item.watched_status === "watching"
                              ? "Viendo"
                              : "Pendiente"}
                          </span>
                        </div>
                        <span className="watched-date">
                          Agregado: {formatDate(item.watched_date)}
                        </span>
                      </div>

                      <div className="content-actions">
                        <select
                          value={item.watched_status}
                          onChange={(e) =>
                            updateWatchStatus(item.id, e.target.value)
                          }
                          className="status-select"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="watching">Viendo</option>
                          <option value="watched">Visto</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {isDemoMode && (
        <div className="demo-note">
          <p>
            📝 <strong>Demo:</strong> Esta lista utiliza LocalStorage para
            persistir tus datos. Los cambios se guardan automáticamente en tu
            navegador.
          </p>
        </div>
      )}

      <style jsx>{`
        .my-list-page {
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

        .empty-list {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 24px;
        }

        .empty-list h2 {
          font-size: 2rem;
          margin-bottom: 16px;
          color: #e50914;
        }

        .empty-list p {
          font-size: 1.1rem;
          color: #ccc;
          margin-bottom: 32px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .empty-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          background: #e50914;
          color: white;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .cta-button:hover {
          background: #f40612;
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

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .content-item {
          background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .content-item:hover {
          transform: translateY(-4px);
          border-color: rgba(229, 9, 20, 0.5);
        }

        .content-link {
          text-decoration: none;
          color: inherit;
        }

        .content-poster {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .content-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .content-item:hover .content-poster img {
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

        .content-item:hover .poster-overlay {
          opacity: 1;
        }

        .poster-overlay svg {
          color: white;
        }

        .content-info {
          padding: 16px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .content-title-link {
          text-decoration: none;
          color: inherit;
          flex: 1;
        }

        .content-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          transition: color 0.3s ease;
        }

        .content-title-link:hover .content-title {
          color: #e50914;
        }

        .remove-button {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #ef4444;
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-button:hover {
          background: #ef4444;
          color: white;
        }

        .content-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .content-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #fbbf24;
        }

        .content-year {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ccc;
        }

        .content-type {
          font-size: 16px;
        }

        .content-details {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .content-genre,
        .content-platform {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .content-genre {
          background: rgba(229, 9, 20, 0.2);
          color: #e50914;
        }

        .content-platform {
          background: rgba(255, 255, 255, 0.1);
          color: #ccc;
        }

        .watched-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 12px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-weight: 500;
        }

        .watched-date {
          color: #999;
        }

        .content-actions {
          display: flex;
        }

        .status-select {
          flex: 1;
          padding: 6px 8px;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 4px;
          color: white;
          font-size: 12px;
        }

        .status-select:focus {
          outline: none;
          border-color: #e50914;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .no-results h3 {
          margin: 0 0 8px 0;
          color: #ccc;
        }

        .no-results p {
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
          .my-list-page {
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

          .content-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 16px;
          }

          .empty-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MyList;
