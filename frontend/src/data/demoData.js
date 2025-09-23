// Demo data for MovieFlix - Complete frontend version
// This data simulates the backend and uses localStorage for persistence

// Demo Profiles
export const DEMO_PROFILES = [
  {
    id: 1,
    name: "Mi Perfil Demo",
    created_at: "2024-01-01T00:00:00.000Z",
  },
];

// Demo Platforms
export const DEMO_PLATFORMS = [
  { id: 1, name: "Netflix" },
  { id: 2, name: "Amazon Prime Video" },
  { id: 3, name: "Disney+" },
  { id: 4, name: "HBO Max" },
  { id: 5, name: "Apple TV+" },
  { id: 6, name: "Paramount+" },
  { id: 7, name: "Hulu" },
  { id: 8, name: "Crunchyroll" },
];

// Demo Genres
export const DEMO_GENRES = [
  { id: 1, name: "Acción" },
  { id: 2, name: "Drama" },
  { id: 3, name: "Comedia" },
  { id: 4, name: "Terror" },
  { id: 5, name: "Ciencia Ficción" },
  { id: 6, name: "Romance" },
  { id: 7, name: "Thriller" },
  { id: 8, name: "Animación" },
  { id: 9, name: "Documental" },
  { id: 10, name: "Aventura" },
];

// Demo Movies (10 famous movies)
export const DEMO_MOVIES = [
  {
    id: 1,
    title: "Avengers: Endgame",
    type: "movie",
    genre: "Acción",
    platform: "Disney+",
    rating: 8.4,
    year: 2019,
    poster_url:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    description:
      "Después de los eventos devastadores de 'Avengers: Infinity War', el universo está en ruinas. Los Vengadores restantes se unen una vez más para intentar deshacer las acciones de Thanos y restaurar el orden.",
    status: "pending",
  },
  {
    id: 2,
    title: "The Dark Knight",
    type: "movie",
    genre: "Acción",
    platform: "HBO Max",
    rating: 9.0,
    year: 2008,
    poster_url:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description:
      "Batman se enfrenta a su mayor desafío cuando el Joker emerge como una nueva amenaza, sembrando el caos y el terror en Gotham City.",
    status: "pending",
  },
  {
    id: 3,
    title: "Inception",
    type: "movie",
    genre: "Ciencia Ficción",
    platform: "Netflix",
    rating: 8.8,
    year: 2010,
    poster_url:
      "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    description:
      "Dom Cobb es un ladrón con la extraña habilidad de entrar en los sueños de la gente y robar secretos de sus subconscientes.",
    status: "pending",
  },
  {
    id: 4,
    title: "Parasite",
    type: "movie",
    genre: "Thriller",
    platform: "Hulu",
    rating: 8.6,
    year: 2019,
    poster_url:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    description:
      "Una familia pobre se las ingenia para trabajar en la casa de una familia adinerada, pero su plan se complica de manera inesperada.",
    status: "pending",
  },
  {
    id: 5,
    title: "The Godfather",
    type: "movie",
    genre: "Drama",
    platform: "Amazon Prime Video",
    rating: 9.2,
    year: 1972,
    poster_url:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    description:
      "La historia de la familia Corleone, una de las familias de la mafia más poderosas de Nueva York.",
    status: "pending",
  },
  {
    id: 6,
    title: "Spider-Man: Into the Spider-Verse",
    type: "movie",
    genre: "Animación",
    platform: "Netflix",
    rating: 8.4,
    year: 2018,
    poster_url:
      "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    description:
      "Miles Morales se convierte en Spider-Man y conoce a otros Spider-People de diferentes dimensiones.",
    status: "pending",
  },
  {
    id: 7,
    title: "La La Land",
    type: "movie",
    genre: "Romance",
    platform: "Amazon Prime Video",
    rating: 8.0,
    year: 2016,
    poster_url:
      "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    description:
      "Una historia de amor entre una aspirante a actriz y un músico de jazz en Los Ángeles.",
    status: "pending",
  },
  {
    id: 8,
    title: "Get Out",
    type: "movie",
    genre: "Terror",
    platform: "HBO Max",
    rating: 7.7,
    year: 2017,
    poster_url:
      "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    description:
      "Un joven afroamericano visita la finca de la familia de su novia blanca y descubre secretos perturbadores.",
    status: "pending",
  },
  {
    id: 9,
    title: "Mad Max: Fury Road",
    type: "movie",
    genre: "Acción",
    platform: "Netflix",
    rating: 8.1,
    year: 2015,
    poster_url:
      "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    description:
      "En un mundo post-apocalíptico, Max se une a Furiosa para escapar de un señor de la guerra tiránico.",
    status: "pending",
  },
  {
    id: 10,
    title: "The Grand Budapest Hotel",
    type: "movie",
    genre: "Comedia",
    platform: "Disney+",
    rating: 8.1,
    year: 2014,
    poster_url:
      "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    description:
      "Las aventuras de Gustave H, un conserje legendario en un famoso hotel europeo, y Zero Moustafa, el botones que se convierte en su protegido.",
    status: "pending",
  },
];

// Demo Series (10 famous series)
export const DEMO_SERIES = [
  {
    id: 11,
    title: "Breaking Bad",
    type: "series",
    genre: "Drama",
    platform: "Netflix",
    rating: 9.5,
    year: 2008,
    poster_url:
      "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    description:
      "Un profesor de química de secundaria se convierte en fabricante de metanfetaminas después de ser diagnosticado con cáncer.",
    status: "pending",
    seasons: 5,
    episodes_per_season: [7, 13, 13, 13, 16],
  },
  {
    id: 12,
    title: "Stranger Things",
    type: "series",
    genre: "Ciencia Ficción",
    platform: "Netflix",
    rating: 8.7,
    year: 2016,
    poster_url:
      "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    description:
      "Un grupo de niños en los años 80 se enfrenta a fenómenos sobrenaturales en su pequeño pueblo de Indiana.",
    status: "pending",
    seasons: 4,
    episodes_per_season: [8, 9, 8, 9],
  },
  {
    id: 13,
    title: "The Office",
    type: "series",
    genre: "Comedia",
    platform: "Amazon Prime Video",
    rating: 8.9,
    year: 2005,
    poster_url:
      "https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    description:
      "Un falso documental sobre los empleados de una empresa de papel en Scranton, Pennsylvania.",
    status: "pending",
    seasons: 9,
    episodes_per_season: [6, 22, 25, 19, 28, 26, 26, 24, 25],
  },
  {
    id: 14,
    title: "Game of Thrones",
    type: "series",
    genre: "Drama",
    platform: "HBO Max",
    rating: 9.2,
    year: 2011,
    poster_url:
      "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQy0Wt6YV.jpg",
    description:
      "Familias nobles luchan por el control del Trono de Hierro en los Siete Reinos de Westeros.",
    status: "pending",
    seasons: 8,
    episodes_per_season: [10, 10, 10, 10, 10, 10, 7, 6],
  },
  {
    id: 15,
    title: "The Crown",
    type: "series",
    genre: "Drama",
    platform: "Netflix",
    rating: 8.6,
    year: 2016,
    poster_url:
      "https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg",
    description:
      "La vida de la Reina Isabel II desde los años 1940 hasta los tiempos modernos.",
    status: "pending",
    seasons: 6,
    episodes_per_season: [10, 10, 10, 10, 10, 10],
  },
  {
    id: 16,
    title: "Attack on Titan",
    type: "series",
    genre: "Animación",
    platform: "Crunchyroll",
    rating: 9.0,
    year: 2013,
    poster_url:
      "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    description:
      "La humanidad vive en ciudades rodeadas de enormes muros debido a los Titanes, gigantes humanoides que devoran humanos.",
    status: "pending",
    seasons: 4,
    episodes_per_season: [25, 12, 22, 28],
  },
  {
    id: 17,
    title: "Friends",
    type: "series",
    genre: "Comedia",
    platform: "HBO Max",
    rating: 8.9,
    year: 1994,
    poster_url:
      "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    description:
      "Seis amigos navegan por la vida y el amor en Manhattan durante los años 90.",
    status: "pending",
    seasons: 10,
    episodes_per_season: [24, 24, 25, 24, 24, 25, 24, 24, 24, 18],
  },
  {
    id: 18,
    title: "The Mandalorian",
    type: "series",
    genre: "Ciencia Ficción",
    platform: "Disney+",
    rating: 8.6,
    year: 2019,
    poster_url:
      "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    description:
      "Un cazarrecompensas mandaloriano navega por los confines de la galaxia, lejos de la autoridad de la Nueva República.",
    status: "pending",
    seasons: 3,
    episodes_per_season: [8, 8, 8],
  },
  {
    id: 19,
    title: "Sherlock",
    type: "series",
    genre: "Thriller",
    platform: "Netflix",
    rating: 9.1,
    year: 2010,
    poster_url:
      "https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG5R9d0y7JGqfzV5.jpg",
    description:
      "Una versión moderna de las aventuras de Sherlock Holmes en el Londres del siglo XXI.",
    status: "pending",
    seasons: 4,
    episodes_per_season: [3, 3, 3, 1],
  },
  {
    id: 20,
    title: "The Boys",
    type: "series",
    genre: "Acción",
    platform: "Amazon Prime Video",
    rating: 8.7,
    year: 2019,
    poster_url:
      "https://image.tmdb.org/t/p/w500/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg",
    description:
      "Un grupo de vigilantes lucha contra superhéroes corruptos que abusan de sus superpoderes.",
    status: "pending",
    seasons: 4,
    episodes_per_season: [8, 8, 8, 8],
  },
];

// Combine all content
export const DEMO_CONTENT = [...DEMO_MOVIES, ...DEMO_SERIES];

// Top 3 content for each category
export const DEMO_TOP_CONTENT = {
  movies: [
    DEMO_MOVIES.find((m) => m.title === "The Godfather"),
    DEMO_MOVIES.find((m) => m.title === "The Dark Knight"),
    DEMO_MOVIES.find((m) => m.title === "Inception"),
  ],
  series: [
    DEMO_SERIES.find((s) => s.title === "Breaking Bad"),
    DEMO_SERIES.find((s) => s.title === "Game of Thrones"),
    DEMO_SERIES.find((s) => s.title === "Sherlock"),
  ],
};

// LocalStorage keys
export const STORAGE_KEYS = {
  PROFILES: "movieflix_demo_profiles",
  CURRENT_PROFILE: "movieflix_demo_current_profile",
  CONTENT: "movieflix_demo_content",
  WATCHED_CONTENT: "movieflix_demo_watched_content",
};

// Initialize demo data in localStorage
export const initializeDemoData = () => {
  // Only initialize if no data exists or if data is empty
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(DEMO_PROFILES));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE)) {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_PROFILE,
      JSON.stringify(DEMO_PROFILES[0])
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(DEMO_CONTENT));
  }

  if (!localStorage.getItem(STORAGE_KEYS.WATCHED_CONTENT)) {
    localStorage.setItem(STORAGE_KEYS.WATCHED_CONTENT, JSON.stringify([]));
  }
};

// Get data from localStorage
export const getDemoData = () => {
  return {
    profiles: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROFILES) ||
        JSON.stringify(DEMO_PROFILES)
    ),
    currentProfile: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE) ||
        JSON.stringify(DEMO_PROFILES[0])
    ),
    content: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CONTENT) || JSON.stringify(DEMO_CONTENT)
    ),
    watchedContent: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.WATCHED_CONTENT) || "[]"
    ),
  };
};

// Save data to localStorage
export const saveDemoData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
