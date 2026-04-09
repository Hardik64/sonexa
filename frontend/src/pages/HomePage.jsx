import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllMusics, getAllAlbums } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { usePlayer } from '../context/PlayerContext'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import MusicPlayer from '../components/MusicPlayer'
import SongCard from '../components/SongCard'
import AlbumCard from '../components/AlbumCard'

function SkeletonCard({ wide = false }) {
  return (
    <div className={`flex-shrink-0 ${wide ? 'w-44' : 'w-36'} animate-pulse`}>
      <div className="aspect-square rounded-xl bg-surface-container mb-3" />
      <div className="h-3 bg-surface-container rounded w-3/4 mb-2" />
      <div className="h-2 bg-surface-container rounded w-1/2" />
    </div>
  )
}

function QuickTile({ track, queue }) {
  const { playTrack, currentTrack } = usePlayer()
  const isActive = currentTrack?._id === track._id
  return (
    <div
      onClick={() => playTrack(track, queue)}
      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container hover:bg-surface-container-highest'
      }`}
    >
      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex-shrink-0 flex items-center justify-center">
        <span className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: "'FILL' 1", color: isActive ? '#72fe8f' : '#484847' }}>
          music_note
        </span>
      </div>
      <span className={`text-xs font-bold truncate ${isActive ? 'text-primary' : 'text-white'}`}>
        {track.title}
      </span>
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, albumsRes] = await Promise.all([getAllMusics(), getAllAlbums()])
        setSongs(songsRes.data.musics || [])
        setAlbums(albumsRes.data.albums || [])
      } catch {
        addToast('Failed to load content.', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-40">
      <TopBar
        rightSlot={
          <button onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
          </button>
        }
      />
      <main className="pt-16 px-4 fade-in">
        <section className="py-8">
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">
            {greeting()}, {user?.username} 👋
          </h1>
          <p className="text-on-surface-variant text-sm font-medium">Ready for your sonic experience?</p>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold tracking-tight border-l-4 border-primary pl-3">All Songs</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{songs.length} tracks</span>
          </div>
          {loading ? (
            <div className="flex gap-5 overflow-x-auto hide-scrollbar -mx-4 px-4 pt-4 pb-8 -mt-4">
              {[1,2,3,4].map(i => <SkeletonCard key={i} wide />)}
            </div>
          ) : songs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-3"
                style={{ fontVariationSettings: "'FILL' 1" }}>music_off</span>
              <p className="text-on-surface-variant font-medium">No songs yet.</p>
              {user?.role === 'artist' && (
                <button onClick={() => navigate('/studio')}
                  className="mt-4 px-5 py-2 rounded-full sonic-gradient text-on-primary-container text-sm font-bold">
                  Upload your first track
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto hide-scrollbar -mx-4 px-4 pt-4 pb-8 -mt-4">
              {songs.map(track => <SongCard key={track._id} track={track} queue={songs} />)}
            </div>
          )}
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold tracking-tight border-l-4 border-primary pl-3">Albums</h2>
            <button onClick={() => navigate('/albums')}
              className="text-xs font-bold uppercase tracking-widest text-primary">View All</button>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pt-4 pb-8 -mt-4">
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : albums.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-3"
                style={{ fontVariationSettings: "'FILL' 1" }}>album</span>
              <p className="text-on-surface-variant font-medium">No albums yet.</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pt-4 pb-8 -mt-4">
              {albums.map(album => <AlbumCard key={album._id} album={album} />)}
            </div>
          )}
        </section>

        {songs.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold tracking-tight border-l-4 border-primary pl-3 mb-5">Quick Play</h2>
            <div className="grid grid-cols-2 gap-3">
              {songs.slice(0, 4).map(track => <QuickTile key={track._id} track={track} queue={songs} />)}
            </div>
          </section>
        )}
      </main>
      <MusicPlayer />
      <BottomNav />
    </div>
  )
}
