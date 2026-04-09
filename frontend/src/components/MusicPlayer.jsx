import React from 'react'
import { usePlayer } from '../context/PlayerContext'

export default function MusicPlayer() {
  const {
    currentTrack, isPlaying, progress, duration,
    volume, setVolume, togglePlay, playNext, playPrev,
    seek, formatTime,
  } = usePlayer()

  if (!currentTrack) return null

  const progressPct = duration ? (progress / duration) * 100 : 0

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 slide-up">
      <div
        className="mx-2 md:mx-0 mb-2 md:mb-0 rounded-xl md:rounded-none border border-white/5 md:border-x-0 md:border-b-0"
        style={{
          background: 'rgba(20,20,20,0.97)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Progress bar */}
        <div className="relative h-1 w-full bg-white/10 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            seek(pct * duration)
          }}
        >
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${progressPct}%`,
              boxShadow: '0 0 8px #72fe8f',
            }}
          />
        </div>

        <div className="flex items-center px-4 md:px-6 h-16 gap-4">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-72">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <span className="material-symbols-outlined text-primary text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
              <p className="text-xs text-on-surface-variant truncate">
                {currentTrack.artist?.username || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 md:gap-6 flex-1 justify-center">
            <button
              onClick={playPrev}
              className="text-on-surface-variant hover:text-white transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl">skip_previous</span>
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black active:scale-90 transition-transform shadow-lg"
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button
              onClick={playNext}
              className="text-on-surface-variant hover:text-white transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl">skip_next</span>
            </button>
          </div>

          {/* Time + Volume (desktop) */}
          <div className="hidden md:flex items-center gap-4 w-72 justify-end">
            <span className="text-xs text-on-surface-variant tabular-nums">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
