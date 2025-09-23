import { AlertTriangle, Info, RotateCcw, X } from "lucide-react";
import { useState } from "react";

const DemoInfo = ({ onResetDemo }) => {
  const [showInfo, setShowInfo] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!showInfo) {
    return (
      <button
        className="demo-info-toggle"
        onClick={() => setShowInfo(true)}
        title="Mostrar información del demo"
      >
        <Info size={20} />
      </button>
    );
  }

  return (
    <div className={`demo-info-banner ${isExpanded ? "expanded" : ""}`}>
      <div className="demo-info-header">
        <div className="demo-info-icon">
          <AlertTriangle size={20} />
        </div>

        <div className="demo-info-title">
          <strong>🎬 MovieFlix Demo</strong>
          <span className="demo-badge">VERSIÓN DEMO</span>
        </div>

        <div className="demo-info-actions">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-button"
            title={isExpanded ? "Contraer" : "Expandir información"}
          >
            {isExpanded ? "Menos info" : "Más info"}
          </button>

          <button
            onClick={onResetDemo}
            className="reset-button"
            title="Reiniciar datos demo"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={() => setShowInfo(false)}
            className="close-button"
            title="Cerrar banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="demo-info-content">
          <div className="demo-info-grid">
            <div className="demo-info-section">
              <h4>📱 Funcionalidades</h4>
              <ul>
                <li>✅ Gestión completa de películas y series</li>
                <li>✅ Lista personal y estados de visualización</li>
                <li>✅ Estadísticas detalladas</li>
                <li>✅ Búsqueda y filtros avanzados</li>
                <li>✅ Interfaz responsive</li>
              </ul>
            </div>

            <div className="demo-info-section">
              <h4>🔧 Tecnologías</h4>
              <ul>
                <li>React.js con Hooks</li>
                <li>React Router para navegación</li>
                <li>LocalStorage para persistencia</li>
                <li>CSS3 con animaciones</li>
                <li>Lucide React para iconos</li>
              </ul>
            </div>

            <div className="demo-info-section">
              <h4>📊 Datos Demo</h4>
              <ul>
                <li>20 contenidos precargados</li>
                <li>8 plataformas de streaming</li>
                <li>10 géneros cinematográficos</li>
                <li>Datos persistentes en navegador</li>
                <li>API simulada con delays realistas</li>
              </ul>
            </div>

            <div className="demo-info-section">
              <h4>⚠️ Limitaciones</h4>
              <ul>
                <li>Solo frontend - Sin base de datos</li>
                <li>Datos locales al navegador</li>
                <li>Sin autenticación real</li>
                <li>Contenido de demostración únicamente</li>
              </ul>
            </div>
          </div>

          <div className="demo-info-footer">
            <p>
              Esta es una versión de demostración que utiliza{" "}
              <strong>LocalStorage</strong> para simular una base de datos. Los
              datos se mantienen en tu navegador y se reinician al limpiar el
              almacenamiento local.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .demo-info-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: #e50914;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .demo-info-toggle:hover {
          background: #f40612;
          transform: scale(1.1);
        }

        .demo-info-banner {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-bottom: 2px solid #e50914;
          color: white;
          padding: 12px 20px;
          position: relative;
          z-index: 999;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .demo-info-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .demo-info-icon {
          color: #fbbf24;
        }

        .demo-info-title {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .demo-badge {
          background: #e50914;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .demo-info-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .expand-button,
        .reset-button,
        .close-button {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .expand-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .reset-button:hover {
          background: #fbbf24;
          color: #1a1a1a;
          border-color: #fbbf24;
        }

        .close-button:hover {
          background: #ef4444;
          border-color: #ef4444;
        }

        .demo-info-content {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .demo-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 16px;
        }

        .demo-info-section h4 {
          margin: 0 0 8px 0;
          color: #fbbf24;
          font-size: 14px;
        }

        .demo-info-section ul {
          margin: 0;
          padding-left: 16px;
          list-style: none;
        }

        .demo-info-section li {
          padding: 2px 0;
          font-size: 12px;
          position: relative;
        }

        .demo-info-section li:before {
          content: "▶";
          color: #e50914;
          position: absolute;
          left: -16px;
        }

        .demo-info-footer {
          padding: 12px;
          background: rgba(229, 9, 20, 0.1);
          border-radius: 6px;
          border-left: 3px solid #e50914;
        }

        .demo-info-footer p {
          margin: 0;
          font-size: 13px;
          line-height: 1.4;
          color: #ccc;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .demo-info-banner {
            padding: 8px 16px;
          }

          .demo-info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .demo-info-title strong {
            font-size: 14px;
          }

          .demo-info-actions {
            gap: 4px;
          }

          .expand-button {
            padding: 4px 8px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default DemoInfo;
