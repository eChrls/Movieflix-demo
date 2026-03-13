const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

console.log("🎬 Iniciando MovieFlix Demo Server...");

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://movie-demo.duckdns.org"],
    credentials: true,
  })
);

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mode: "demo",
    version: "1.0.0",
  });
});

// Datos demo
const demoContent = [
  {
    id: 1,
    title: "The Matrix",
    type: "movie",
    genre: "Ciencia Ficción",
    platform: "Netflix",
    year: 1999,
    rating: 8.7,
  },
  {
    id: 2,
    title: "Breaking Bad",
    type: "series",
    genre: "Drama",
    platform: "Netflix",
    year: 2008,
    rating: 9.5,
  },
  {
    id: 3,
    title: "Inception",
    type: "movie",
    genre: "Ciencia Ficción",
    platform: "HBO Max",
    year: 2010,
    rating: 8.8,
  },
  {
    id: 4,
    title: "Stranger Things",
    type: "series",
    genre: "Ciencia Ficción",
    platform: "Netflix",
    year: 2016,
    rating: 8.7,
  },
  {
    id: 5,
    title: "The Dark Knight",
    type: "movie",
    genre: "Acción",
    platform: "HBO Max",
    year: 2008,
    rating: 9.0,
  },
];

// API Routes
app.get("/api/content", (req, res) => {
  res.json({ success: true, data: demoContent });
});

app.get("/api/content/:id", (req, res) => {
  const content = demoContent.find(
    (item) => item.id === parseInt(req.params.id)
  );
  if (content) {
    res.json({ success: true, data: content });
  } else {
    res.status(404).json({ success: false, error: "Contenido no encontrado" });
  }
});

app.get("/api/genres", (req, res) => {
  res.json({
    success: true,
    data: ["Acción", "Drama", "Ciencia Ficción", "Terror", "Romance"],
  });
});

app.get("/api/platforms", (req, res) => {
  res.json({
    success: true,
    data: ["Netflix", "HBO Max", "Disney+", "Prime Video"],
  });
});

// Simulaciones
app.get("/api/mylist", (req, res) => res.json({ success: true, data: [] }));
app.post("/api/mylist/:id", (req, res) =>
  res.json({ success: true, message: "Demo: Añadido a lista" })
);
app.delete("/api/mylist/:id", (req, res) =>
  res.json({ success: true, message: "Demo: Eliminado de lista" })
);

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ success: false, error: "Error interno" });
});

// 404
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: "Endpoint no encontrado" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
