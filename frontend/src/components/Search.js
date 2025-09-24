import {
  Film,
  Loader2,
  Plus,
  Search as SearchIcon,
  Star,
  Tv,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const Search = () => {
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Estados principales
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // Estados de contenido local
  const [localContent, setLocalContent] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados de filtros
  const [filters, setFilters] = useState({
    type: "",
    genre: "",
    year: "",
  });

  // Cargar contenido local al iniciar
  useEffect(() => {
    loadLocalContent();
  }, []);

  // Búsqueda de sugerencias con debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadLocalContent = async () => {
    try {
      setLoading(true);
      const response = await demoApiService.getContent();
      if (response.success) {
        setLocalContent(response.data);
      }
    } catch (error) {
      console.error("Error loading local content:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchSuggestions = async (query) => {
    try {
      setSearchLoading(true);
      const response = await demoApiService.searchContent(query);
      if (response.success) {
        setSuggestions(response.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error searching suggestions:", error);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          selectSuggestion(suggestions[selectedSuggestion]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
      default:
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  };

  const addToMyList = async (suggestion, e) => {
    e.stopPropagation();
    try {
      const response = await demoApiService.addContentFromSearch(suggestion);
      if (response.success) {
        alert(`"${suggestion.title}" añadido a tu lista`);
        loadLocalContent(); // Recargar contenido local
      } else {
        alert("Error al añadir contenido: " + response.message);
      }
    } catch (error) {
      console.error("Error adding to list:", error);
      alert("Error al añadir contenido");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const filteredLocalContent = localContent.filter((item) => {
    const matchesType = !filters.type || item.type === filters.type;
    const matchesGenre =
      !filters.genre || (item.genres && item.genres.includes(filters.genre));
    const matchesYear = !filters.year || item.year?.toString() === filters.year;
    const matchesSearch =
      !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title_en?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesGenre && matchesYear && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner message="Cargando búsqueda..." />;
  }

  return (
    <div className="search-page">
      {/* Header de búsqueda */}
      <div className="search-header">
        <h1 className="page-title">
          <SearchIcon size={24} />
          Buscar Contenido
        </h1>

        {/* Barra de búsqueda principal con dropdown */}
        <div className="search-container" ref={dropdownRef}>
          <div className="search-input-wrapper">
            <SearchIcon size={20} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              placeholder="Busca películas y series..."
              className="search-input"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search">
                <X size={16} />
              </button>
            )}
            {searchLoading && (
              <div className="search-loading">
                <Loader2 size={16} className="animate-spin" />
              </div>
            )}
          </div>

          {/* Dropdown de sugerencias */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`suggestion-item ${
                    index === selectedSuggestion ? "selected" : ""
                  }`}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <div className="suggestion-poster">
                    <img
                      src={suggestion.poster_url}
                      alt={suggestion.title}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/50x75/333/fff?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="suggestion-info">
                    <div className="suggestion-title">{suggestion.title}</div>
                    <div className="suggestion-meta">
                      <span className="suggestion-year">{suggestion.year}</span>
                      <span className="suggestion-type">
                        {suggestion.type === "movie" ? (
                          <Film size={12} />
                        ) : (
                          <Tv size={12} />
                        )}
                        {suggestion.type === "movie" ? "Película" : "Serie"}
                      </span>
                      <span className="suggestion-rating">
                        <Star size={12} fill="currentColor" />
                        {suggestion.rating}
                      </span>
                    </div>
                    {suggestion.overview && (
                      <div className="suggestion-overview">
                        {suggestion.overview.slice(0, 100)}...
                      </div>
                    )}
                  </div>
                  <button
                    className="add-to-list-btn"
                    onClick={(e) => addToMyList(suggestion, e)}
                    title="Añadir a mi lista"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="quick-filters">
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">Todos los tipos</option>
            <option value="movie">Películas</option>
            <option value="series">Series</option>
          </select>

          <select
            value={filters.genre}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, genre: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">Todos los géneros</option>
            <option value="Acción">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="Comedia">Comedia</option>
            <option value="Drama">Drama</option>
            <option value="Terror">Terror</option>
            <option value="Ciencia Ficción">Ciencia Ficción</option>
            <option value="Romance">Romance</option>
            <option value="Thriller">Thriller</option>
          </select>

          <input
            type="number"
            placeholder="Año"
            value={filters.year}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, year: e.target.value }))
            }
            className="filter-input"
            min="1900"
            max="2030"
          />
        </div>
      </div>

      {/* Resultados del contenido local */}
      {filteredLocalContent.length > 0 && (
        <div className="local-results">
          <h2 className="results-title">
            Tu Contenido ({filteredLocalContent.length})
          </h2>
          <div className="content-grid">
            {filteredLocalContent.map((item) => (
              <div key={item.id} className="content-card">
                <div className="card-poster">
                  <img
                    src={item.poster_url || item.poster_path}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x300/333/fff?text=No+Image";
                    }}
                  />
                  <div className="card-overlay">
                    <div className="card-type">
                      {item.type === "movie" ? (
                        <Film size={16} />
                      ) : (
                        <Tv size={16} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-info">
                  <h4>{item.title}</h4>
                  <div className="card-meta">
                    <span className="card-rating">
                      <Star size={12} fill="currentColor" />
                      {item.rating}
                    </span>
                    <span className="card-year">{item.year}</span>
                  </div>
                  <div className="card-duration">
                    {item.type === "movie" ? (
                      <span>{item.runtime || "120"} min</span>
                    ) : (
                      <span>
                        {item.seasons || "1"} temp. • {item.runtime || "45"}{" "}
                        min/ep
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {searchTerm &&
        filteredLocalContent.length === 0 &&
        suggestions.length === 0 &&
        !searchLoading && (
          <div className="no-results">
            <SearchIcon size={48} />
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        )}

      <style jsx>{`
        .search-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-header {
          margin-bottom: 32px;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 600;
          color: #e50914;
          margin-bottom: 24px;
        }

        .search-container {
          position: relative;
          margin-bottom: 20px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 16px 50px 16px 50px;
          font-size: 16px;
          background: #2a2a2a;
          border: 2px solid #404040;
          border-radius: 8px;
          color: white;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #e50914;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #ccc;
        }

        .clear-search {
          position: absolute;
          right: 48px;
          background: none;
          border: none;
          color: #ccc;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .clear-search:hover {
          color: white;
          background: #404040;
        }

        .search-loading {
          position: absolute;
          right: 16px;
          color: #e50914;
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #2a2a2a;
          border: 1px solid #404040;
          border-radius: 8px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          margin-top: 4px;
        }

        .suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border-bottom: 1px solid #404040;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .suggestion-item:hover,
        .suggestion-item.selected {
          background: #404040;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-poster {
          width: 50px;
          height: 75px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .suggestion-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .suggestion-info {
          flex: 1;
          min-width: 0;
        }

        .suggestion-title {
          font-weight: 600;
          margin-bottom: 4px;
          color: white;
        }

        .suggestion-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #ccc;
          margin-bottom: 4px;
        }

        .suggestion-type {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .suggestion-rating {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #fbbf24;
        }

        .suggestion-overview {
          font-size: 12px;
          color: #999;
          line-height: 1.4;
        }

        .add-to-list-btn {
          background: #e50914;
          border: none;
          color: white;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }

        .add-to-list-btn:hover {
          background: #cc0c1c;
        }

        .quick-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-select,
        .filter-input {
          padding: 8px 12px;
          background: #2a2a2a;
          border: 1px solid #404040;
          border-radius: 4px;
          color: white;
          font-size: 14px;
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: #e50914;
        }

        .results-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: white;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .content-card {
          background: #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .content-card:hover {
          transform: translateY(-4px);
        }

        .card-poster {
          position: relative;
          aspect-ratio: 2/3;
          overflow: hidden;
        }

        .card-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-overlay {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.8);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .card-type {
          display: flex;
          align-items: center;
          gap: 4px;
          color: white;
          font-size: 12px;
        }

        .card-info {
          padding: 12px;
        }

        .card-info h4 {
          margin: 0 0 8px 0;
          font-size: 0.9rem;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #ccc;
          margin-bottom: 4px;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #fbbf24;
        }

        .card-duration {
          font-size: 11px;
          color: #999;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #ccc;
        }

        .no-results svg {
          opacity: 0.5;
          margin-bottom: 20px;
        }

        .no-results h3 {
          margin: 0 0 8px 0;
          color: white;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .search-page {
            padding: 16px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .quick-filters {
            flex-direction: column;
          }

          .content-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Search;
