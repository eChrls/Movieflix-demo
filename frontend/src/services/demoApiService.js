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

  async createProfile(profileData) {
    await this.delay();
    const data = getDemoData();

    const nextId =
      Math.max(0, ...data.profiles.map((profile) => Number(profile.id) || 0)) +
      1;

    const newProfile = {
      id: nextId,
      name: profileData?.name || `Perfil ${nextId}`,
      avatar: profileData?.avatar || "👤",
      isDefault: false,
      created_at: new Date().toISOString(),
    };

    const updatedProfiles = [...data.profiles, newProfile];
    saveDemoData(STORAGE_KEYS.PROFILES, updatedProfiles);

    return {
      success: true,
      data: newProfile,
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
          item.description.toLowerCase().includes(searchTerm),
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
      profile_id: data.currentProfile?.id || 1,
    };

    // Remove if already exists
    const filteredWatched = data.watchedContent.filter(
      (item) => item.id !== contentId,
    );
    const updatedWatched = [...filteredWatched, watchedItem];

    saveDemoData(STORAGE_KEYS.WATCHED_CONTENT, updatedWatched);

    // Update content status
    const updatedContent = data.content.map((item) =>
      item.id === contentId ? { ...item, status } : item,
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
      (item) => item.id !== contentId,
    );
    saveDemoData(STORAGE_KEYS.WATCHED_CONTENT, updatedWatched);

    // Update content status to pending
    const updatedContent = data.content.map((item) =>
      item.id === contentId ? { ...item, status: "pending" } : item,
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
        (item) => item.id !== contentId,
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
        (item) => item.id !== contentId,
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
        (item) => item.id === contentId,
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

  // Search only in local catalog (static demo, no external API)
  async searchContent(query) {
    await this.delay(100);

    if (!query || query.length < 2) {
      return {
        success: true,
        data: [],
      };
    }

    const data = getDemoData();
    const normalizedQuery = query.trim().toLowerCase();

    const results = data.content
      .filter((item) => {
        const title = (item.title || "").toLowerCase();
        const description = (
          item.description ||
          item.overview ||
          ""
        ).toLowerCase();
        const genre = (item.genre || "").toLowerCase();
        return (
          title.includes(normalizedQuery) ||
          description.includes(normalizedQuery) ||
          genre.includes(normalizedQuery)
        );
      })
      .slice(0, 12)
      .map((item) => ({
        ...item,
        overview:
          item.description || item.overview || "Descripción no disponible",
      }));

    return {
      success: true,
      data: results,
    };
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

      if (data.content.some((item) => item.title === searchResult.title)) {
        return {
          success: false,
          message: "Este contenido ya existe en el catálogo local",
        };
      }

      // Generate new ID
      const newId =
        Math.max(...data.content.map((item) => parseInt(item.id) || 0), 0) + 1;

      const newContent = {
        ...searchResult,
        id: newId,
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
