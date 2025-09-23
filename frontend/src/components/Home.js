import { Clock, Film, Star, TrendingUp, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const Home = ({ currentProfile, isDemoMode }) => {
  const [topContent, setTopContent] = useState({ movies: [], series: [] });
  const [recentContent, setRecentContent] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState("movies");

  useEffect(() => {
    loadHomeData();
  }, [currentProfile]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [topResponse, contentResponse, statsResponse] = await Promise.all([
        demoApiService.getTopContent(),
        demoApiService.getContent({ sortBy: "year" }),
        demoApiService.getStatistics(),
      ]);

      if (topResponse.success) {
        setTopContent(topResponse.data);
      }

      if (contentResponse.success) {
        // Get recent content (last 6 items)
        setRecentContent(contentResponse.data.slice(0, 6));
      }

      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }
    } catch (err) {
      console.error("Error loading home data:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando inicio..." />;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={loadHomeData}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            ¡Bienvenido{currentProfile ? `, ${currentProfile.name}` : ""}! 🎬
          </h1>
          <p className="hero-subtitle">
            Descubre y gestiona tu contenido audiovisual favorito
          </p>
          {isDemoMode && (
            <div className="demo-notice">
              <span className="demo-icon">🚀</span>
              <span>Versión Demo - Explora todas las funcionalidades</span>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      {statistics && (
        <section className="stats-section">
          <h2 className="section-title">📊 Tu Actividad</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Film />
              </div>
              <div className="stat-info">
                <h3>{statistics.movies.watched}</h3>
                <p>Películas vistas</p>
                <span className="stat-total">de {statistics.movies.total}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Tv />
              </div>
              <div className="stat-info">
                <h3>{statistics.series.watched}</h3>
                <p>Series vistas</p>
                <span className="stat-total">de {statistics.series.total}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp />
              </div>
              <div className="stat-info">
                <h3>{statistics.completionRate}%</h3>
                <p>Progreso total</p>
                <span className="stat-total">
                  {statistics.totalWatched} contenidos
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Star />
              </div>
              <div className="stat-info">
                <h3>{Object.keys(statistics.platforms).length}</h3>
                <p>Plataformas</p>
                <span className="stat-total">utilizadas</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Content Section */}
      <section className="top-content-section">
        <div className="section-header">
          <h2 className="section-title">🏆 Top 3 Recomendado</h2>
          <div className="top-tabs">
            <button
              className={`top-tab ${activeTopTab === "movies" ? "active" : ""}`}
              onClick={() => setActiveTopTab("movies")}
            >
              <Film size={16} />
              Películas
            </button>
            <button
              className={`top-tab ${activeTopTab === "series" ? "active" : ""}`}
              onClick={() => setActiveTopTab("series")}
            >
              <Tv size={16} />
              Series
            </button>
          </div>
        </div>

        <div className="top-content-grid">
          {topContent[activeTopTab]?.map((content, index) => (
            <Link
              key={content.id}
              to={`/content/${content.id}`}
              className="top-content-card"
            >
              <div className="rank-badge">#{index + 1}</div>
              <div className="content-poster">
                <img
                  src={content.poster_url}
                  alt={content.title}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                  }}
                />
              </div>
              <div className="content-info">
                <h3>{content.title}</h3>
                <div className="content-meta">
                  <span className="rating">
                    <Star size={14} fill="currentColor" />
                    {content.rating}
                  </span>
                  <span className="year">{content.year}</span>
                </div>
                <p className="content-genre">{content.genre}</p>
                <p className="content-platform">{content.platform}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Content Section */}
      <section className="recent-content-section">
        <div className="section-header">
          <h2 className="section-title">
            <Clock size={20} />
            Contenido Reciente
          </h2>
          <Link to="/movies" className="see-all-link">
            Ver todo →
          </Link>
        </div>

        <div className="content-grid">
          {recentContent.map((content) => (
            <Link
              key={content.id}
              to={`/content/${content.id}`}
              className="content-card"
            >
              <div className="card-poster">
                <img
                  src={content.poster_url}
                  alt={content.title}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/200x300/333/fff?text=No+Image";
                  }}
                />
                <div className="card-overlay">
                  <div className="card-type">
                    {content.type === "movie" ? "🎬" : "📺"}
                  </div>
                </div>
              </div>
              <div className="card-info">
                <h4>{content.title}</h4>
                <div className="card-meta">
                  <span className="card-rating">
                    <Star size={12} fill="currentColor" />
                    {content.rating}
                  </span>
                  <span className="card-year">{content.year}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h2 className="section-title">🚀 Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/search" className="action-card">
            <div className="action-icon">🔍</div>
            <h3>Buscar Contenido</h3>
            <p>Encuentra películas y series</p>
          </Link>

          <Link to="/my-list" className="action-card">
            <div className="action-icon">📝</div>
            <h3>Mi Lista</h3>
            <p>Gestiona tu contenido</p>
          </Link>

          <Link to="/profile" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Estadísticas</h3>
            <p>Ve tu progreso</p>
          </Link>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: white;
          padding: 20px;
        }

        .hero-section {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(45deg, #e50914, #f40612);
          border-radius: 12px;
          margin-bottom: 40px;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 20px;
          opacity: 0.9;
        }

        .demo-notice {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
        }

        .section-title {
          font-size: 1.8rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stats-section {
          margin-bottom: 40px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
          padding: 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(229, 9, 20, 0.2);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          background: #e50914;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info h3 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
          color: #e50914;
        }

        .stat-info p {
          margin: 4px 0;
          color: #ccc;
        }

        .stat-total {
          font-size: 12px;
          color: #999;
        }

        .top-content-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .top-tabs {
          display: flex;
          gap: 8px;
        }

        .top-tab {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
        }

        .top-tab.active {
          background: #e50914;
          border-color: #e50914;
        }

        .top-content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .top-content-card {
          background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: white;
          transition: transform 0.3s ease;
          position: relative;
        }

        .top-content-card:hover {
          transform: scale(1.02);
        }

        .rank-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #e50914;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          z-index: 2;
        }

        .content-poster {
          height: 200px;
          overflow: hidden;
        }

        .content-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content-info {
          padding: 16px;
        }

        .content-info h3 {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
        }

        .content-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #fbbf24;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }

        .content-card {
          text-decoration: none;
          color: white;
          transition: transform 0.3s ease;
        }

        .content-card:hover {
          transform: scale(1.05);
        }

        .card-poster {
          position: relative;
          height: 250px;
          border-radius: 8px;
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
          right: 8px;
        }

        .card-type {
          background: rgba(0, 0, 0, 0.8);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .card-info {
          padding: 12px 0;
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
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #fbbf24;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: linear-gradient(135deg, #1f1f1f, #2a2a2a);
          padding: 24px;
          border-radius: 12px;
          text-decoration: none;
          color: white;
          text-align: center;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .action-card:hover {
          transform: translateY(-4px);
          border-color: #e50914;
        }

        .action-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .action-card h3 {
          margin: 0 0 8px 0;
          color: #e50914;
        }

        .action-card p {
          margin: 0;
          color: #ccc;
          font-size: 14px;
        }

        .see-all-link {
          color: #e50914;
          text-decoration: none;
          font-weight: 500;
        }

        .see-all-link:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .home-page {
            padding: 16px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .top-content-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
