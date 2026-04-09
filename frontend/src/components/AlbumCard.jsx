import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AlbumCard({ album }) {
  const navigate = useNavigate()

  return (
    <div
      className="flex-shrink-0 w-36 cursor-pointer group"
      onClick={() => navigate(`/albums/${album._id}`)}
    >
      <div className="aspect-square mb-3 rounded-xl overflow-hidden bg-surface-container shadow-lg border border-white/5 relative transition-transform duration-300 group-hover:scale-[1.04]">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-lowest">
          <span
            className="material-symbols-outlined text-4xl text-outline-variant group-hover:text-primary transition-colors duration-200"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            album
          </span>
        </div>
        {/* Inset shine */}
        <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none" />

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            play_circle
          </span>
        </div>
      </div>
      <h3 className="text-sm font-bold text-white leading-tight truncate">{album.title}</h3>
      <p className="text-xs text-on-surface-variant mt-1 truncate">
        {album.musics?.length ?? 0} track{album.musics?.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
