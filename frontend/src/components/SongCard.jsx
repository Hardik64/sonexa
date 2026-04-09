import React from 'react'
import { usePlayer } from '../context/PlayerContext'

export default function SongCard({ track, queue = [] }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer()
  const isActive = currentTrack?._id === track._id

  return (
    <div className="flex-shrink-0 w-44 group cursor-pointer" onClick={() => playTrack(track, queue)}>
      <div
        className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-surface-container shadow-2xl transition-transform duration-300 group-hover:scale-[1.03]"
        style={isActive ? { boxShadow: '0 0 0 2px #72fe8f, 0 0 20px rgba(114,254,143,0.3)' } : {}}
      >
        {/* Cover art placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high">
          <span
            className="material-symbols-outlined text-5xl"
            style={{ fontVariationSettings: "'FILL' 1", color: isActive ? '#72fe8f' : '#484847' }}
          >
            music_note
          </span>
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button className="w-12 h-12 rounded-full flex items-center justify-center sonic-gradient shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            <span
              className="material-symbols-outlined text-2xl text-on-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isActive && isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>

        {/* Playing indicator */}
        {isActive && isPlaying && (
          <div className="absolute bottom-2 right-2 flex items-end gap-[2px] h-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[3px] bg-primary rounded-full"
                style={{
                  animation: `soundbar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                  height: `${40 + i * 20}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <h3
        className={`font-bold truncate text-sm ${isActive ? 'text-primary text-glow' : 'text-white'}`}
      >
        {track.title}
      </h3>
      <p className="text-xs text-on-surface-variant truncate mt-0.5">
        {track.artist?.username || 'Unknown Artist'}
      </p>

      <style>{`
        @keyframes soundbar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}
