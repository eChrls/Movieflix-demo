import {
  ArrowLeft,
  Calendar,
  Clock,
  Film,
  Globe,
  Share2,
  Star,
  Tv,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import demoApiService from "../services/demoApiService";
import LoadingSpinner from "./LoadingSpinner";

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContentDetail();
  }, [id]);

  const loadContentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await demoApiService.getContentById(id);
      if (response && response.success !== false) {
        setContent(response);
      } else {
        setError("Contenido no encontrado");
      }
    } catch (error) {
      console.error("Error cargando detalle:", error);
      setError("Error al cargar el contenido");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: `¡Mira ${content.title} en MovieFlix!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Enlace copiado al portapapeles');
      }).catch(() => {
        alert(`Comparte este enlace: ${url}`);
      });
    }
  };

  const formatDuration = (content) => {
    if (content.type === "movie") {
      const duration = content.duration || content.runtime || 120;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    } else {
      const seasons = content.seasons || content.number_of_seasons || 1;
      const episodeDuration = content.episode_duration || content.episode_run_time?.[0] || 45;
      return `${seasons} temporada${seasons > 1 ? 's' : ''} • ${episodeDuration} min/ep`;
    }
  };

  const formatGenres = (genres) => {
    if (Array.isArray(genres)) {
      return genres.map(g => g.name || g).join(', ');
    }
    return genres || 'Sin género';
  };

  if (loading) {
    return <LoadingSpinner message="Cargando detalles..." />;
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2 text-white">{error || "Contenido no encontrado"}</h2>
          <p className="text-gray-400 mb-6">No se pudo cargar la información solicitada</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Volver
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        {content.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <img
              src={`https://image.tmdb.org/t/p/original${content.backdrop_path}`}
              alt={content.title}
              className="w-full h-full object-cover opacity-20"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] max-w-md mx-auto lg:mx-0">
                <img
                  src={content.poster_url || content.poster_path ? `https://image.tmdb.org/t/p/w500${content.poster_path}` : "https://via.placeholder.com/300x450/333/fff?text=No+Image"}
                  alt={content.title}
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x450/333/fff?text=No+Image";
                  }}
                />
              </div>
            </div>

            {/* Content Info */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Title and basic info */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                    {content.title || content.name}
                  </h1>
                  {content.tagline && (
                    <p className="text-xl text-gray-300 italic mb-4">
                      "{content.tagline}"
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      {content.type === 'movie' ? <Film size={16} /> : <Tv size={16} />}
                      <span className="capitalize">{content.type === 'movie' ? 'Película' : 'Serie'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{content.year || content.first_air_date?.split('-')[0] || content.release_date?.split('-')[0] || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{formatDuration(content)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star size={16} fill="currentColor" className="text-yellow-400" />
                      <span>{content.rating || content.vote_average?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sinopsis</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {content.description || content.overview || 'Sin descripción disponible.'}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users size={16} />
                      Géneros
                    </h4>
                    <p className="text-gray-300">{formatGenres(content.genres || content.genre)}</p>
                  </div>
                  
                  {content.platform && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Globe size={16} />
                        Plataforma
                      </h4>
                      <p className="text-gray-300">{content.platform}</p>
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <div className="pt-6">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Share2 size={20} />
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      {(content.production_companies?.length > 0 || content.spoken_languages?.length > 0) && (
        <div className="max-w-6xl mx-auto px-4 py-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.production_companies?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Productoras</h3>
                <div className="space-y-2">
                  {content.production_companies.slice(0, 3).map((company) => (
                    <p key={company.id} className="text-gray-300">{company.name}</p>
                  ))}
                </div>
              </div>
            )}
            
            {content.spoken_languages?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Idiomas</h3>
                <div className="space-y-2">
                  {content.spoken_languages.map((lang) => (
                    <p key={lang.iso_639_1} className="text-gray-300">{lang.english_name}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetail;