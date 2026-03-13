/**
 * 🎭 useDemoMode Hook
 * Hook personalizado para gestionar el estado del modo demo
 *
 * Características:
 * - Detección automática de URL demo
 * - Gestión de estado persistente (sessionStorage)
 * - Códigos de acceso específicos para demo
 * - Rate limiting y validaciones
 */

import { useState, useEffect, useCallback } from "react";
import React, { createContext, useContext } from "react";

// Configuración demo desde variables de entorno
const DEMO_CONFIG = {
  enabled: process.env.REACT_APP_DEMO_ENABLED === "true",
  urlPath: process.env.REACT_APP_DEMO_URL_PATH || "/movieflix-demo",
  code: process.env.REACT_APP_DEMO_CODE || "demo",
  storageKey: process.env.REACT_APP_DEMO_STORAGE_KEY || "movieflix_demo",
  // CLAVE: API base diferente para demo
  apiBase: process.env.REACT_APP_DEMO_API_BASE || "/api/demo",
  productionApiBase: "/api",
  sessionWarningTime:
    parseInt(process.env.REACT_APP_DEMO_SESSION_WARNING_TIME) || 1800000,
};

/**
 * Hook principal para modo demo
 */
export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoSession, setDemoSession] = useState(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(null);

  // Detectar si estamos en URL demo
  const detectDemoMode = useCallback(() => {
    if (!DEMO_CONFIG.enabled) return false;

    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    // Detectar por URL path o parámetro demo
    return (
      currentPath.includes(DEMO_CONFIG.urlPath) ||
      searchParams.has("demo") ||
      searchParams.get("mode") === "demo"
    );
  }, []);

  // Inicializar sesión demo
  const initializeDemoSession = useCallback(() => {
    const sessionId = `demo_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const session = {
      id: sessionId,
      started: Date.now(),
      lastActivity: Date.now(),
      authenticated: false,
      profilesCount: 0,
      contentCount: 0,
    };

    sessionStorage.setItem(DEMO_CONFIG.storageKey, JSON.stringify(session));
    setDemoSession(session);
    return session;
  }, []);

  // Recuperar sesión demo existente
  const loadDemoSession = useCallback(() => {
    try {
      const saved = sessionStorage.getItem(DEMO_CONFIG.storageKey);
      if (saved) {
        const session = JSON.parse(saved);

        // Verificar si la sesión no ha expirado (4 horas máximo)
        const maxAge = 4 * 60 * 60 * 1000; // 4 horas
        const now = Date.now();

        if (now - session.started < maxAge) {
          // Actualizar última actividad
          session.lastActivity = now;
          sessionStorage.setItem(
            DEMO_CONFIG.storageKey,
            JSON.stringify(session)
          );
          setDemoSession(session);
          return session;
        } else {
          // Sesión expirada, limpiar
          sessionStorage.removeItem(DEMO_CONFIG.storageKey);
        }
      }
    } catch (error) {
      console.warn("Error loading demo session:", error);
      sessionStorage.removeItem(DEMO_CONFIG.storageKey);
    }
    return null;
  }, []);

  // Autenticar en modo demo
  const authenticateDemo = useCallback(
    (code) => {
      if (!isDemoMode) return false;

      if (code === DEMO_CONFIG.code) {
        const session = demoSession || initializeDemoSession();
        session.authenticated = true;
        session.lastActivity = Date.now();

        sessionStorage.setItem(DEMO_CONFIG.storageKey, JSON.stringify(session));
        setDemoSession(session);
        return true;
      }

      return false;
    },
    [isDemoMode, demoSession, initializeDemoSession]
  );

  // Actualizar estadísticas de sesión
  const updateDemoStats = useCallback(
    (stats) => {
      if (!isDemoMode || !demoSession) return;

      const updatedSession = {
        ...demoSession,
        ...stats,
        lastActivity: Date.now(),
      };

      sessionStorage.setItem(
        DEMO_CONFIG.storageKey,
        JSON.stringify(updatedSession)
      );
      setDemoSession(updatedSession);
    },
    [isDemoMode, demoSession]
  );

  // Limpiar sesión demo
  const clearDemoSession = useCallback(() => {
    sessionStorage.removeItem(DEMO_CONFIG.storageKey);
    setDemoSession(null);
    setSessionTimeRemaining(null);
  }, []);

  // Obtener API base según modo
  const getApiBase = useCallback(() => {
    if (isDemoMode) {
      return DEMO_CONFIG.apiBase; // /api/demo
    }
    // Producción siempre usa /api (routing a backend 3001)
    return DEMO_CONFIG.productionApiBase; // /api
  }, [isDemoMode]);

  // Verificar límites demo
  const checkDemoLimits = useCallback((type, count) => {
    const limits = {
      profiles: parseInt(process.env.REACT_APP_DEMO_MAX_PROFILES) || 5,
      content:
        parseInt(process.env.REACT_APP_DEMO_MAX_CONTENT_PER_PROFILE) || 50,
    };

    return count < (limits[type] || 100);
  }, []);

  // Inicialización del hook
  useEffect(() => {
    const demoDetected = detectDemoMode();
    setIsDemoMode(demoDetected);

    if (demoDetected) {
      console.log("🎭 Demo mode detected");
      const existingSession = loadDemoSession();
      if (!existingSession) {
        initializeDemoSession();
      }
    }
  }, [detectDemoMode, loadDemoSession, initializeDemoSession]);

  // Timer para avisos de sesión
  useEffect(() => {
    if (!isDemoMode || !demoSession) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - demoSession.started;
      const remaining = DEMO_CONFIG.sessionWarningTime - elapsed;

      setSessionTimeRemaining(Math.max(0, remaining));

      // Auto-cleanup si la sesión es muy antigua
      if (elapsed > 4 * 60 * 60 * 1000) {
        // 4 horas
        clearDemoSession();
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(timer);
  }, [isDemoMode, demoSession, clearDemoSession]);

  return {
    // Estado
    isDemoMode,
    demoSession,
    sessionTimeRemaining,
    isAuthenticated: demoSession?.authenticated || false,

    // Configuración
    demoConfig: DEMO_CONFIG,

    // Métodos
    authenticateDemo,
    updateDemoStats,
    clearDemoSession,
    getApiBase,
    checkDemoLimits,

    // Utilidades
    getDemoCode: () => DEMO_CONFIG.code,
    formatTimeRemaining: (ms) => {
      const minutes = Math.floor(ms / 60000);
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    },
  };
};

/**
 * Context Provider para modo demo
 */
const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  const demoState = useDemoMode();

  return (
    <DemoContext.Provider value={demoState}>{children}</DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemoContext must be used within DemoProvider");
  }
  return context;
};

/**
 * Utilidades adicionales para modo demo
 */
export const demoUtils = {
  // Verificar si una URL es de demo
  isDemoUrl: (url = window.location.href) => {
    return (
      url.includes(DEMO_CONFIG.urlPath) || new URL(url).searchParams.has("demo")
    );
  },

  // Generar URL demo
  generateDemoUrl: (baseUrl = window.location.origin) => {
    return `${baseUrl}${DEMO_CONFIG.urlPath}`;
  },

  // Limpiar URLs de parámetros demo
  cleanUrl: () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("demo");
    url.searchParams.delete("mode");
    window.history.replaceState({}, "", url.toString());
  },

  // Headers específicos para requests demo
  getDemoHeaders: () => ({
    "X-Demo-Mode": "true",
    "X-Demo-Session": sessionStorage.getItem(DEMO_CONFIG.storageKey) || "",
  }),
};

export default useDemoMode;
