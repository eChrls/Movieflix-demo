const LoadingSpinner = ({ message = "Cargando...", size = "medium" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className={`spinner ${sizeClasses[size]}`}></div>
        <p className="loading-message">{message}</p>
      </div>

      <style jsx>{`
        .loading-spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          width: 100%;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #e50914;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-message {
          color: #fff;
          font-size: 14px;
          margin: 0;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Full screen loading */
        .loading-spinner-container.full-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          z-index: 9999;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
