# 🎬 MovieFlix Demo

A modern Netflix-inspired web application showcasing a complete movie and TV series management system. Built as a portfolio demonstration project with full functionality and interactive features.

![Demo](https://img.shields.io/badge/Demo-Live-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Live Demo

**[View Live Demo →](https://movie-demo.duckdns.org)**

## ✨ Features

### Core Functionality

- **🎭 Profile Management**: Multiple user profiles with personalized preferences
- **🔍 Advanced Search**: Smart filtering by genre, platform, rating, and release year
- **📚 My List**: Personal watchlist with custom organization
- **⭐ Rating System**: Rate and review movies and TV shows
- **📊 Statistics Dashboard**: View detailed viewing statistics and preferences

### User Experience

- **🌙 Dark Theme**: Professional Netflix-inspired design
- **📱 Mobile Responsive**: Optimized for all screen sizes
- **⚡ Fast Performance**: Optimized React components with lazy loading
- **🎨 Modern UI**: Clean interface with smooth animations

### Technical Features

- **🔄 Real-time Updates**: Dynamic content management
- **🛡️ Security**: Input validation and sanitization
- **📡 API Integration**: Simulated backend with realistic data
- **🎯 SEO Optimized**: Meta tags and semantic HTML

## 🛠️ Tech Stack

### Frontend

- **React 18.2.0** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Responsive Design** - Mobile-first approach

### Backend

- **Node.js 18.x** - JavaScript runtime
- **Express.js** - Fast web framework
- **In-Memory Storage** - Simulated database for demo
- **Helmet.js** - Security middleware

### Development Tools

- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/eChrls/Movieflix-demo.git
cd Movieflix-demo

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Development

```bash
# Start backend server (Terminal 1)
cd backend
npm start

# Start frontend development server (Terminal 2)
cd frontend
npm start
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002

### Production Build

```bash
# Build for production
cd frontend
npm run build

# The build files will be in the 'build' directory
```

## 📱 Usage

### Main Features

1. **Profile Selection**: Choose or create a user profile
2. **Browse Content**: Explore movies and TV shows by category
3. **Search & Filter**: Use advanced search with multiple filters
4. **My List**: Add content to your personal watchlist
5. **Rate & Review**: Rate content and view statistics
6. **Detailed Views**: Access comprehensive information about each title

### Demo Data

The application includes **20 pre-loaded titles** across various genres:

- Action & Adventure movies
- Popular TV series
- Comedy and Drama content
- Different streaming platforms
- Realistic ratings and metadata

## 📁 Project Structure

```
MovieFlix-demo/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── data/              # Demo data and mock database
│   └── package.json       # Backend dependencies
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/       # CSS and styling
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
└── README.md            # This file
```

### Key Components

- **App.js**: Main router and state management
- **Profile.js**: User profile management
- **ContentDetail.js**: Detailed movie/show information
- **Search.js**: Advanced search and filtering
- **Home.js**: Dashboard with trending content

## 🔧 API Reference

### Profiles

- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### Content

- `GET /api/content` - Get all content with filters
- `GET /api/content/:id` - Get specific content details
- `POST /api/content/:id/rate` - Rate content
- `POST /api/mylist/:profileId` - Manage personal watchlist

### Utilities

- `GET /api/genres` - Get available genres
- `GET /api/platforms` - Get streaming platforms
- `GET /api/stats/:profileId` - Get user statistics

## Screenshots

### Home Dashboard

![Home](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=MovieFlix+Home+Dashboard)

### Content Detail View

![Detail](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Content+Detail+View)

### Advanced Search

![Search](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Advanced+Search+Filters)

## 🔒 Security Features

- **Input Sanitization**: All user inputs are validated and sanitized
- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: API endpoints are protected against abuse
- **Error Boundaries**: Graceful error handling in React components
- **Secure Headers**: Security headers implemented via Helmet.js

## 🔒 Seguridad

- **Helmet.js**: Headers de seguridad HTTP
- **Rate Limiting**: Limitación de peticiones
- **CORS**: Control de acceso cruzado
- **Input Validation**: Validación de datos
- **Error Boundaries**: Manejo de errores

## 🎯 Portfolio Purpose

This project demonstrates proficiency in:

- **Full-Stack Development**: Complete React + Node.js application
- **Modern UI/UX**: Netflix-inspired responsive design
- **State Management**: Complex React state and data flow
- **API Design**: RESTful API architecture
- **Code Organization**: Clean, maintainable code structure
- **Performance Optimization**: Lazy loading and efficient rendering

## 🤝 Contributing

This is a portfolio demonstration project. However, contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

Found a bug or have a suggestion?

- **GitHub Issues**: [Create an issue](https://github.com/eChrls/Movieflix-demo/issues)
- **Email**: ecom.jct@gmail.com

## 🔄 Changelog

### v1.0.0 (September 2025)

- ✨ Initial release
- 🎬 Complete movie and TV series management system
- 👥 Multi-profile support
- 📱 Responsive mobile-first design
- � Advanced search and filtering
- ⭐ Rating and review system
- 📊 User statistics dashboard

## Acknowledgments

- Design inspiration from Netflix
- Icons by [Lucide](https://lucide.dev/)
- Built with [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

---

**MovieFlix Demo** - Showcasing modern full-stack development 🎬✨

_This is a portfolio project demonstrating React, Node.js, and modern web development practices._
