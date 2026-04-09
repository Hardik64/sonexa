import React, { useEffect, useState } from 'react'
import { getAllAlbums } from '../services/api'
import { useToast } from '../context/ToastContext'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import MusicPlayer from '../components/MusicPlayer'
import AlbumCard from '../components/AlbumCard'

export default function AlbumsPage() {
  const { addToast } = useToast()
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllAlbums()
      .then(res => setAlbums(res.data.albums || []))
      .catch(() => addToast('Failed to load albums.', 'error'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-40">
      <TopBar title="Albums" showBack />
      <main className="pt-16 px-4 fade-in">
        <section className="py-8">
          <h1 className="text-3xl font-black tracking-tighter text-white mb-1">Albums</h1>
          <p className="text-on-surface-variant text-sm">{albums.length} collections</p>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-surface-container mb-3" />
                <div className="h-3 bg-surface-container rounded w-3/4 mb-2" />
                <div className="h-2 bg-surface-container rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4"
              style={{ fontVariationSettings: "'FILL' 1" }}>album</span>
            <p className="text-on-surface-variant font-medium text-lg">No albums yet</p>
            <p className="text-on-surface-variant/60 text-sm mt-1">Albums created by artists will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {albums.map(album => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        )}
      </main>
      <MusicPlayer />
      <BottomNav />
    </div>
  )
}
