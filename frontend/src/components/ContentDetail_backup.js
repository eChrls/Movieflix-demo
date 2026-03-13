import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Eye,
  EyeOff,
  Film,
  Globe,
  Play,
  Plus,
  Share2,
  Star,
  Tv,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import demoApiService from "../services/demoApiService";

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInMyList, setIsInMyList] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingSelector, setShowRatingSelector] = useState(false);
  const [relatedContent, setRelatedContent] = useState([]);

  useEffect(() => {
    loadContentDetail();
    checkMyListStatus();
    checkWatchedStatus();
    loadRelatedContent();
  }, [id]);

  const loadContentDetail = async () => {
    try {
      setLoading(true);
      const data = await demoApiService.getContentById(id);
      setContent(data);
    } catch (error) {
      console.error("Error cargando detalle:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkMyListStatus = () => {
    try {
      const myList = JSON.parse(
        localStorage.getItem("movieflix_mylist") || "[]"
      );
      setIsInMyList(myList.some((item) => item.id === parseInt(id)));
    } catch (error) {
      console.error("Error verificando Mi Lista:", error);
    }
  };

  const checkWatchedStatus = () => {
    try {
      const watched = JSON.parse(
        localStorage.getItem("movieflix_watched") || "[]"
      );
      const watchedItem = watched.find((item) => item.id === parseInt(id));
      setIsWatched(!!watchedItem);
      setUserRating(watchedItem?.userRating || 0);
    } catch (error) {
      console.error("Error verificando estado visto:", error);
    }
  };

  const loadRelatedContent = async () => {
    try {
      const allContent = await demoApiService.getAllContent();
      // Filtrar contenido relacionado por género o tipo
      const related = allContent
        .filter(
          (item) =>
            item.id !== parseInt(id) &&
            (item.genre === content?.genre || item.type === content?.type)
        )
        .slice(0, 6);
      setRelatedContent(related);
    } catch (error) {
      console.error("Error cargando contenido relacionado:", error);
    }
  };

  const toggleMyList = async () => {
    try {
      if (isInMyList) {
        await demoApiService.removeFromMyList(id);
      } else {
        await demoApiService.addToMyList(id);
      }
      setIsInMyList(!isInMyList);
    } catch (error) {
      console.error("Error actualizando Mi Lista:", error);
    }
  };

  const toggleWatched = async () => {
    try {
      if (isWatched) {
        await demoApiService.removeFromWatched(id);
        setUserRating(0);
      } else {
        await demoApiService.markAsWatched(id);
      }
      setIsWatched(!isWatched);
      checkWatchedStatus();
    } catch (error) {
      console.error("Error actualizando estado visto:", error);
    }
  };

  const handleRating = async (rating) => {
    try {
      await demoApiService.rateContent(id, rating);
      setUserRating(rating);
      setShowRatingSelector(false);

      // Si no estaba marcado como visto, marcarlo automáticamente
      if (!isWatched) {
        await demoApiService.markAsWatched(id);
        setIsWatched(true);
      }
    } catch (error) {
      console.error("Error guardando calificación:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: `Mira "${content.title}" en MovieFlix Demo`,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contenido no encontrado</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header con imagen de fondo */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(17,24,39,0.9)), url(${content.poster})`,
        }}
      >
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              {content.type === "movie" ? (
                <Film className="w-8 h-8 text-red-500" />
              ) : (
                <Tv className="w-8 h-8 text-blue-500" />
              )}
              <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                {content.type === "movie" ? "Película" : "Serie"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {content.title}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>{content.rating}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{content.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{content.duration || "120 min"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Botones de acción */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors font-semibold">
                <Play className="w-5 h-5" />
                Reproducir (Demo)
              </button>

              <button
                onClick={toggleMyList}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold ${
                  isInMyList
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {isInMyList ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {isInMyList ? "En Mi Lista" : "Añadir a Mi Lista"}
              </button>

              <button
                onClick={toggleWatched}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold ${
                  isWatched
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {isWatched ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
                {isWatched ? "Visto" : "Marcar como Visto"}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Compartir
              </button>
            </div>

            {/* Calificación del usuario */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Tu Calificación</h3>
              {userRating > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          star <= userRating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-400"
                        }`}
                        onClick={() => setShowRatingSelector(true)}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-500 font-semibold">
                    {userRating}/5
                  </span>
                  <button
                    onClick={() => setShowRatingSelector(true)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowRatingSelector(true)}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5" />
                  Calificar
                </button>
              )}

              {showRatingSelector && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <p className="mb-3">Selecciona tu calificación:</p>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        <Star className="w-8 h-8" />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowRatingSelector(false)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Sinopsis</h3>
              <p className="text-gray-300 leading-relaxed">
                {content.description ||
                  "Una emocionante historia que te mantendrá al borde del asiento desde el primer minuto hasta el último. Con actuaciones extraordinarias y una cinematografía impecable, esta obra maestra del entretenimiento redefine los límites del género."}
              </p>
            </div>
          </div>

          {/* Información lateral */}
          <div className="space-y-6">
            {/* Poster */}
            <div className="bg-gray-800 p-4 rounded-xl">
              <img
                src={content.poster}
                alt={content.title}
                className="w-full rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x450/374151/ffffff?text=Sin+Imagen";
                }}
              />
            </div>

            {/* Detalles */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Detalles</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-400">Género:</span>
                    <span className="ml-2 text-white">{content.genre}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-400">Plataforma:</span>
                    <span className="ml-2 text-white">{content.platform}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-400">Año:</span>
                    <span className="ml-2 text-white">{content.year}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-400">Calificación:</span>
                    <span className="ml-2 text-yellow-500 font-semibold">
                      {content.rating}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido relacionado */}
        {relatedContent.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Contenido Relacionado</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedContent.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer transform hover:scale-105 transition-transform"
                  onClick={() => navigate(`/content/${item.id}`)}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x300/374151/ffffff?text=Sin+Imagen";
                    }}
                  />
                  <h4 className="mt-2 text-sm font-semibold text-center">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetail;
