# 🎵 Sonexa — Frontend

React + Tailwind CSS frontend for the Spotify-inspired Sonexa app.

## Tech Stack
- **React 18** with React Router v6
- **Tailwind CSS** (custom Sonic Obsidian design system)
- **Axios** for API calls (cookies sent automatically)
- **Vite** for dev server and bundling

## Project Structure
```
src/
├── App.jsx                  # Root router + providers
├── main.jsx                 # Entry point
├── index.css                # Global styles + design tokens
├── context/
│   ├── AuthContext.jsx      # Login/logout state
│   ├── PlayerContext.jsx    # Music player (Audio API)
│   └── ToastContext.jsx     # Global notifications
├── services/
│   └── api.js               # All backend API calls
├── components/
│   ├── BottomNav.jsx        # Mobile bottom navigation
│   ├── TopBar.jsx           # Top header bar
│   ├── MusicPlayer.jsx      # Fixed player bar
│   ├── SongCard.jsx         # Song card (horizontal scroll)
│   ├── AlbumCard.jsx        # Album card
│   ├── ProtectedRoute.jsx   # Auth + role guard
│   └── Spinner.jsx          # Loading spinner
└── pages/
    ├── LandingPage.jsx      # / — welcome screen
    ├── LoginPage.jsx        # /login
    ├── RegisterPage.jsx     # /register
    ├── HomePage.jsx         # /home — songs + albums feed
    ├── AlbumsPage.jsx       # /albums — all albums grid
    ├── AlbumDetailPage.jsx  # /albums/:id — tracklist
    ├── ArtistStudioPage.jsx # /studio — upload + create album (artist only)
    └── ProfilePage.jsx      # /profile — user info + logout
```

## Setup

### 1. Make sure your backend is running
```bash
cd spotify-backend
npm run dev   # runs on http://localhost:3000
```

### 2. Install dependencies
```bash
cd sonic-curator
npm install
```

### 3. Run the frontend dev server
```bash
npm run dev   # runs on http://localhost:5173
```

The Vite proxy in `vite.config.js` forwards all `/api` requests to `http://localhost:3000` automatically — no CORS issues.

## Routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Landing |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/home` | Logged in | Home feed |
| `/albums` | Logged in | All albums |
| `/albums/:id` | Logged in | Album detail |
| `/profile` | Logged in | Profile + logout |
| `/studio` | Artist only | Upload music + create album |
