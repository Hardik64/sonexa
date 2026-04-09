import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAlbumById } from '../services/api'
import { useToast } from '../context/ToastContext'
import { usePlayer } from '../context/PlayerContext'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import MusicPlayer from '../components/MusicPlayer'

export default function AlbumDetailPage() {
  const { albumId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAlbumById(albumId)
      .then(res => setAlbum(res.data.album))
      .catch(() => {
        addToast('Album not found.', 'error')
        navigate('/albums')
      })
      .finally(() => setLoading(false))
  }, [albumId])

  const tracks = album?.musics || []

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    playTrack(tracks[0], tracks)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-5xl spin">progress_activity</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-40">
      <TopBar showBack />

      <main className="pt-14">
        {/* Hero */}
        <section className="relative px-4 py-10 album-gradient overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'rgba(114,254,143,0.08)', filter: 'blur(80px)' }} />

          <div className="flex gap-6 items-end relative z-10">
            {/* Album art */}
            <div className="w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container shadow-2xl border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant"
                style={{ fontVariationSettings: "'FILL' 1" }}>album</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold mb-2">
                Album
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-tight mb-2">
                {album?.title}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {tracks.length} song{tracks.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handlePlayAll}
                  disabled={tracks.length === 0}
                  className="px-6 py-2.5 rounded-full sonic-gradient text-on-primary-container font-bold text-sm flex items-center gap-2 active:scale-95 transition-all primary-glow disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  Play All
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tracklist */}
        <section className="px-4 mt-4">
          {/* Header row */}
          <div className="grid grid-cols-[40px_1fr_60px] gap-3 px-3 py-2 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold border-b border-white/5 mb-2">
            <div className="text-center">#</div>
            <div>Title</div>
            <div className="text-right">
              <span className="material-symbols-outlined text-sm">schedule</span>
            </div>
          </div>

          {tracks.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2"
                style={{ fontVariationSettings: "'FILL' 1" }}>music_off</span>
              <p className="text-on-surface-variant text-sm">No tracks in this album yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {tracks.map((track, idx) => {
                const isActive = currentTrack?._id === track._id
                return (
                  <div
                    key={track._id}
                    onClick={() => playTrack(track, tracks)}
                    className={`grid grid-cols-[40px_1fr_60px] gap-3 px-3 py-3 rounded-xl items-center cursor-pointer transition-all duration-200 group ${
                      isActive ? 'bg-primary/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isActive ? (
                        <span className="material-symbols-outlined text-primary text-lg"
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isPlaying ? 'graphic_eq' : 'play_arrow'}
                        </span>
                      ) : (
                        <>
                          <span className="text-on-surface-variant text-sm group-hover:hidden">{idx + 1}</span>
                          <span className="material-symbols-outlined text-white text-lg hidden group-hover:block"
                            style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        </>
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-sm truncate ${isActive ? 'text-primary text-glow' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {track.artist?.username || 'Unknown Artist'}
                      </p>
                    </div>
                    <div className="text-right text-xs text-on-surface-variant tabular-nums">
                      —
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <MusicPlayer />
      <BottomNav />
    </div>
  )
}
