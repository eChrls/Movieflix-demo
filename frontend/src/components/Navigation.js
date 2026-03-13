import {
  Bookmark,
  Film,
  Home as HomeIcon,
  Menu,
  Search,
  Tv,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = ({
  currentProfile,
  profiles,
  onProfileChange,
  isDemoMode,
}) => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    { path: "/", label: "Inicio", icon: HomeIcon },
    { path: "/movies", label: "Películas", icon: Film },
    { path: "/series", label: "Series", icon: Tv },
    { path: "/my-list", label: "Mi Lista", icon: Bookmark },
    { path: "/search", label: "Buscar", icon: Search },
    { path: "/profile", label: "Perfil", icon: User },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🎬</span>
            <span className="brand-text">MovieFlix</span>
            {isDemoMode && <span className="demo-badge">DEMO</span>}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="nav-menu desktop-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile Info */}
        <div className="nav-profile">
          {currentProfile && (
            <div className="profile-info">
              <User size={18} />
              <span className="profile-name">{currentProfile.name}</span>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="mobile-nav-overlay">
          <ul className="mobile-nav-menu">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`mobile-nav-link ${
                      isActive(item.path) ? "active" : ""
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style jsx>{`
        .navigation {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          border-bottom: 2px solid #e50914;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 64px;
        }

        .nav-brand .brand-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }

        .brand-icon {
          font-size: 24px;
        }

        .demo-badge {
          background: #e50914;
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          text-transform: uppercase;
        }

        .desktop-nav {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          text-decoration: none;
          color: #ccc;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-link.active {
          color: #e50914;
          background: rgba(229, 9, 20, 0.1);
        }

        .nav-profile {
          display: flex;
          align-items: center;
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 14px;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
        }

        .mobile-nav-overlay {
          display: none;
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 99;
        }

        .mobile-nav-menu {
          list-style: none;
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          text-decoration: none;
          color: white;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(229, 9, 20, 0.2);
          color: #e50914;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .mobile-nav-overlay {
            display: block;
          }

          .profile-info .profile-name {
            display: none;
          }

          .nav-container {
            padding: 0 16px;
          }

          .brand-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            height: 56px;
          }

          .brand-link {
            font-size: 18px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
