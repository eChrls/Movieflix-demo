// Demo API Service - Simulates backend API calls using localStorage
import {
  DEMO_GENRES,
  DEMO_PLATFORMS,
  DEMO_TOP_CONTENT,
  getDemoData,
  initializeDemoData,
  saveDemoData,
  STORAGE_KEYS,
} from "../data/demoData.js";

class DemoApiService {
  constructor() {
    // Initialize demo data on first load
    initializeDemoData();
  }

  // Simulate API delay
  async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Initialize demo data
  async initializeDemoData() {
    await this.delay(100);
    initializeDemoData();
    return {
      success: true,
      message: "Demo data initialized",
    };
  }

  // Profiles API
  async getProfiles() {
    await this.delay();
    const data = getDemoData();
    return {
      success: true,
      data: data.profiles,
    };
  }

  async getCurrentProfile() {
    await this.delay();
    const data = getDemoData();
    return {
      success: true,
      data: data.currentProfile,
    };
  }

  async setCurrentProfile(profileId) {
    await this.delay();
    const data = getDemoData();
    const profile = data.profiles.find((p) => p.id === profileId);
    if (profile) {
      saveDemoData(STORAGE_KEYS.CURRENT_PROFILE, profile);
      return {
        success: true,
        data: profile,
      };
    }
    return {
      success: false,
      message: "Perfil no encontrado",
    };
  }

  // Content API
  async getContent(filters = {}) {
    await this.delay();
    const data = getDemoData();
    let content = [...data.content];

    // Apply filters
    if (filters.type) {
      content = content.filter((item) => item.type === filters.type);
    }

    if (filters.genre) {
      content = content.filter((item) => item.genre === filters.genre);
    }

    if (filters.platform) {
      content = content.filter((item) => item.platform === filters.platform);
    }

    if (filters.status) {
      content = content.filter((item) => item.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      content = content.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by rating (highest first) or year (newest first)
    content.sort((a, b) => {
      if (filters.sortBy === "year") {
        return b.year - a.year;
      }
      return b.rating - a.rating;
    });

    return {
      success: true,
      data: content,
      pagination: {
        total: content.length,
        page: 1,
        totalPages: 1,
      },
    };
  }

  async getContentById(id) {
    await this.delay();
    const data = getDemoData();
    const content = data.content.find((item) => item.id === parseInt(id));

    if (content) {
      return {
        success: true,
        data: content,
      };
    }

    return {
      success: false,
      message: "Contenido no encontrado",
    };
  }

  async getTopContent() {
    await this.delay();
    return {
      success: true,
      data: DEMO_TOP_CONTENT,
    };
  }

  // Watchlist API
  async getWatchedContent() {
    await this.delay();
    const data = getDemoData();
    return {
      success: true,
      data: data.watchedContent,
    };
  }

  async addToWatched(contentId, status = "watched") {
    await this.delay();
    const data = getDemoData();
    const content = data.content.find((item) => item.id === contentId);

    if (!content) {
      return {
        success: false,
        message: "Contenido no encontrado",
      };
    }

    const watchedItem = {
      ...content,
      watched_status: status,
      watched_date: new Date().toISOString(),
      profile_id: data.currentProfile.id,
    };

    // Remove if already exists
    const filteredWatched = data.watchedContent.filter(
      (item) => item.id !== contentId
    );
    const updatedWatched = [...filteredWatched, watchedItem];

    saveDemoData(STORAGE_KEYS.WATCHED_CONTENT, updatedWatched);

    // Update content status
    const updatedContent = data.content.map((item) =>
      item.id === contentId ? { ...item, status } : item
    );
    saveDemoData(STORAGE_KEYS.CONTENT, updatedContent);

    return {
      success: true,
      data: watchedItem,
    };
  }

  async removeFromWatched(contentId) {
    await this.delay();
    const data = getDemoData();

    const updatedWatched = data.watchedContent.filter(
      (item) => item.id !== contentId
    );
    saveDemoData(STORAGE_KEYS.WATCHED_CONTENT, updatedWatched);

    // Update content status to pending
    const updatedContent = data.content.map((item) =>
      item.id === contentId ? { ...item, status: "pending" } : item
    );
    saveDemoData(STORAGE_KEYS.CONTENT, updatedContent);

    return {
      success: true,
      message: "Eliminado de la lista",
    };
  }

  async updateWatchStatus(contentId, status) {
    await this.delay();
    return this.addToWatched(contentId, status);
  }

  // Statistics API
  async getStatistics() {
    await this.delay();
    const data = getDemoData();

    const watchedContent = data.watchedContent;
    const totalContent = data.content.length;

    const movieStats = {
      total: data.content.filter((item) => item.type === "movie").length,
      watched: watchedContent.filter((item) => item.type === "movie").length,
    };

    const seriesStats = {
      total: data.content.filter((item) => item.type === "series").length,
      watched: watchedContent.filter((item) => item.type === "series").length,
    };

    // Platform distribution
    const platformStats = {};
    watchedContent.forEach((item) => {
      platformStats[item.platform] = (platformStats[item.platform] || 0) + 1;
    });

    // Genre distribution
    const genreStats = {};
    watchedContent.forEach((item) => {
      genreStats[item.genre] = (genreStats[item.genre] || 0) + 1;
    });

    return {
      success: true,
      data: {
        totalContent,
        totalWatched: watchedContent.length,
        movies: movieStats,
        series: seriesStats,
        platforms: platformStats,
        genres: genreStats,
        completionRate:
          totalContent > 0
            ? Math.round((watchedContent.length / totalContent) * 100)
            : 0,
      },
    };
  }

  // Platform and Genre data
  async getPlatforms() {
    await this.delay();
    return {
      success: true,
      data: DEMO_PLATFORMS,
    };
  }

  async getGenres() {
    await this.delay();
    return {
      success: true,
      data: DEMO_GENRES,
    };
  }

  // Demo-specific methods
  resetDemoData() {
    // Clear all localStorage data
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Reinitialize with fresh data
    initializeDemoData();

    return {
      success: true,
      message: "Datos demo reiniciados",
    };
  }

  async exportDemoData() {
    await this.delay();
    const data = getDemoData();
    return {
      success: true,
      data: {
        profiles: data.profiles,
        content: data.content,
        watchedContent: data.watchedContent,
        exportDate: new Date().toISOString(),
      },
    };
  }

  async importDemoData(importData) {
    await this.delay();

    try {
      if (importData.profiles) {
        saveDemoData(STORAGE_KEYS.PROFILES, importData.profiles);
      }

      if (importData.content) {
        saveDemoData(STORAGE_KEYS.CONTENT, importData.content);
      }

      if (importData.watchedContent) {
        saveDemoData(STORAGE_KEYS.WATCHED_CONTENT, importData.watchedContent);
      }

      return {
        success: true,
        message: "Datos importados exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al importar datos: " + error.message,
      };
    }
  }

  // Delete content
  async deleteContent(contentId) {
    await this.delay();
    try {
      const data = getDemoData();
      const updatedContent = data.content.filter(
        (item) => item.id !== contentId
      );
      saveDemoData(STORAGE_KEYS.CONTENT, updatedContent);

      return {
        success: true,
        message: "Contenido eliminado correctamente",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al eliminar contenido: " + error.message,
      };
    }
  }

  // Mark content as watched
  async markAsWatched(contentId) {
    await this.delay();
    try {
      const data = getDemoData();
      const content = data.content.find((item) => item.id === contentId);

      if (!content) {
        return {
          success: false,
          message: "Contenido no encontrado",
        };
      }

      // Remove from pending content
      const updatedContent = data.content.filter(
        (item) => item.id !== contentId
      );
      saveDemoData(STORAGE_KEYS.CONTENT, updatedContent);

      // Add to watched content
      const watchedContent = data.watchedContent || [];
      const watchedItem = {
        ...content,
        watchedAt: new Date().toISOString(),
        userRating: content.rating, // Keep original rating as user rating
      };

      watchedContent.push(watchedItem);
      saveDemoData(STORAGE_KEYS.WATCHED_CONTENT, watchedContent);

      return {
        success: true,
        message: "Marcado como visto",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al marcar como visto: " + error.message,
      };
    }
  }

  // Update content
  async updateContent(contentId, updatedData) {
    await this.delay();
    try {
      const data = getDemoData();
      const contentIndex = data.content.findIndex(
        (item) => item.id === contentId
      );

      if (contentIndex === -1) {
        return {
          success: false,
          message: "Contenido no encontrado",
        };
      }

      data.content[contentIndex] = {
        ...data.content[contentIndex],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      saveDemoData(STORAGE_KEYS.CONTENT, data.content);

      return {
        success: true,
        data: data.content[contentIndex],
        message: "Contenido actualizado correctamente",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al actualizar contenido: " + error.message,
      };
    }
  }

  // Search content using TMDB API
  async searchContent(query) {
    await this.delay(100);

    if (!query || query.length < 2) {
      return {
        success: true,
        data: [],
      };
    }

    try {
      // Use TMDB search endpoint
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          query
        )}&api_key=a2e351c494039319d6d537923a7d972a&language=es-ES`
      );

      if (!response.ok) {
        throw new Error("Error en la búsqueda");
      }

      const tmdbData = await response.json();

      // Transform TMDB data to our format
      const transformedResults = tmdbData.results.slice(0, 10).map((item) => ({
        id: `tmdb_${item.id}`,
        title: item.title || item.name,
        title_en: item.original_title || item.original_name,
        year: new Date(
          item.release_date || item.first_air_date || "2024"
        ).getFullYear(),
        type: item.media_type === "tv" ? "series" : "movie",
        rating: item.vote_average ? item.vote_average.toFixed(1) : "7.0",
        runtime: item.media_type === "tv" ? "45" : "120",
        seasons: item.media_type === "tv" ? item.number_of_seasons || 1 : null,
        genres: item.genre_ids
          ? item.genre_ids.slice(0, 3).map((id) => this.getGenreNameById(id))
          : [],
        overview: item.overview || "Descripción no disponible",
        poster_path: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
        poster_url: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : "https://via.placeholder.com/200x300/333/fff?text=No+Image",
        backdrop_path: item.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
          : null,
        imdb_id: null,
        tmdb_id: item.id,
        platform_id: "",
        popularity: item.popularity,
        vote_count: item.vote_count,
      }));

      return {
        success: true,
        data: transformedResults,
      };
    } catch (error) {
      console.error("Search error:", error);
      return {
        success: false,
        message: "Error al buscar contenido: " + error.message,
        data: [],
      };
    }
  }

  // Helper function to get genre name by ID
  getGenreNameById(genreId) {
    const genreMap = {
      28: "Acción",
      12: "Aventura",
      16: "Animación",
      35: "Comedia",
      80: "Crimen",
      99: "Documental",
      18: "Drama",
      10751: "Familiar",
      14: "Fantasía",
      36: "Historia",
      27: "Terror",
      10402: "Música",
      9648: "Misterio",
      10749: "Romance",
      878: "Ciencia Ficción",
      10770: "Película de TV",
      53: "Thriller",
      10752: "Guerra",
      37: "Western",
      10759: "Acción y Aventura",
      10762: "Infantil",
      10763: "Noticias",
      10764: "Reality",
      10765: "Ciencia Ficción y Fantasía",
      10766: "Telenovela",
      10767: "Talk Show",
      10768: "Guerra y Política",
    };
    return genreMap[genreId] || "Desconocido";
  }

  // Add content from search
  async addContentFromSearch(searchResult) {
    await this.delay();
    try {
      const data = getDemoData();

      // Generate new ID
      const newId =
        Math.max(...data.content.map((item) => parseInt(item.id) || 0), 0) + 1;

      const newContent = {
        ...searchResult,
        id: newId.toString(),
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      data.content.push(newContent);
      saveDemoData(STORAGE_KEYS.CONTENT, data.content);

      return {
        success: true,
        data: newContent,
        message: "Contenido añadido correctamente",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error al añadir contenido: " + error.message,
      };
    }
  }
}

// Create singleton instance
const demoApiService = new DemoApiService();

export default demoApiService;
