import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import HomePage         from './pages/HomePage'
import AlbumsPage       from './pages/AlbumsPage'
import AlbumDetailPage  from './pages/AlbumDetailPage'
import ArtistStudioPage from './pages/ArtistStudioPage'
import ProfilePage      from './pages/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/"         element={<LandingPage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected — any logged in user */}
              <Route path="/home" element={
                <ProtectedRoute><HomePage /></ProtectedRoute>
              } />
              <Route path="/albums" element={
                <ProtectedRoute><AlbumsPage /></ProtectedRoute>
              } />
              <Route path="/albums/:albumId" element={
                <ProtectedRoute><AlbumDetailPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />

              {/* Protected — artist only */}
              <Route path="/studio" element={
                <ProtectedRoute artistOnly><ArtistStudioPage /></ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </PlayerProvider>
    </AuthProvider>
  )
}
