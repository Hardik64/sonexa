import React, { useEffect, useRef, useState } from 'react'
import { uploadMusic, createAlbum, getAllMusics } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import MusicPlayer from '../components/MusicPlayer'
import Spinner from '../components/Spinner'

export default function ArtistStudioPage() {
  const { user } = useAuth()
  const { addToast } = useToast()

  // Upload state
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef()
  const [dragging, setDragging] = useState(false)

  // Album state
  const [albumTitle, setAlbumTitle] = useState('')
  const [songs, setSongs] = useState([])
  const [selectedTracks, setSelectedTracks] = useState([])
  const [creatingAlbum, setCreatingAlbum] = useState(false)
  const [loadingSongs, setLoadingSongs] = useState(true)

  useEffect(() => {
    getAllMusics()
      .then(res => setSongs(res.data.filter(s => s.artist?._id === user?.id || s.artist === user?.id)))
      .catch(() => {})
      .finally(() => setLoadingSongs(false))
  }, [])

  const refreshSongs = () => {
    getAllMusics()
      .then(res => setSongs(res.data.filter(s => s.artist?._id === user?.id || s.artist === user?.id)))
      .catch(() => {})
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('audio/')) setFile(f)
    else addToast('Please drop an audio file.', 'error')
  }

  const handleFileInput = (e) => {
    const f = e.target.files[0]
    if (f) setFile(f)
  }

  const handleUpload = async () => {
    if (!title.trim()) { addToast('Enter a track title.', 'error'); return }
    if (!file) { addToast('Select an audio file.', 'error'); return }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('music', file)

    setUploading(true)
    setUploadProgress(0)

    // Simulate progress (real progress requires onUploadProgress in axios)
    const interval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 10, 90))
    }, 300)

    try {
      await uploadMusic(formData)
      clearInterval(interval)
      setUploadProgress(100)
      addToast(`"${title}" uploaded successfully!`)
      setTitle('')
      setFile(null)
      setTimeout(() => setUploadProgress(0), 1500)
      refreshSongs()
    } catch (err) {
      clearInterval(interval)
      setUploadProgress(0)
      addToast(err.response?.data?.message || 'Upload failed.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const toggleTrack = (id) => {
    setSelectedTracks(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleCreateAlbum = async () => {
    if (!albumTitle.trim()) { addToast('Enter an album title.', 'error'); return }
    if (selectedTracks.length === 0) { addToast('Select at least one track.', 'error'); return }
    setCreatingAlbum(true)
    try {
      await createAlbum({ title: albumTitle, musics: selectedTracks })
      addToast(`Album "${albumTitle}" created!`)
      setAlbumTitle('')
      setSelectedTracks([])
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create album.', 'error')
    } finally {
      setCreatingAlbum(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-40">
      <TopBar title="Artist Studio" />

      <main className="pt-16 px-4 fade-in">
        <section className="py-8">
          <h1 className="text-4xl font-black tracking-tighter text-white mb-1">Artist Studio</h1>
          <p className="text-on-surface-variant font-medium">Manage your sonic legacy.</p>
        </section>

        {/* Upload Music */}
        <section className="bg-surface-container rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Upload Music</h2>
            <span className="material-symbols-outlined text-primary">cloud_upload</span>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Track Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter track title..."
                className="w-full bg-surface-container-lowest rounded-xl p-4 text-white placeholder-outline focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                dragging
                  ? 'border-primary bg-primary/10'
                  : file
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-outline-variant hover:bg-white/5 hover:border-primary/40'
              }`}
            >
              <span className={`material-symbols-outlined text-4xl transition-colors ${
                file ? 'text-primary' : 'text-on-surface-variant'
              }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {file ? 'audio_file' : 'music_note'}
              </span>
              {file ? (
                <>
                  <p className="text-primary font-bold text-sm">{file.name}</p>
                  <p className="text-on-surface-variant text-xs">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-on-surface-variant font-medium text-sm">
                    Drag & drop or <span className="text-primary">browse</span>
                  </p>
                  <p className="text-[10px] text-outline uppercase tracking-widest">
                    WAV, FLAC, or MP3 (Max 50MB)
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Progress bar */}
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                    {uploadProgress === 100 ? 'Complete!' : 'Uploading...'}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%`, boxShadow: '0 0 8px rgba(114,254,143,0.5)' }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-4 rounded-full sonic-gradient font-black text-on-primary-container active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {uploading ? <Spinner size="sm" /> : (
                <>
                  <span className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}>upload</span>
                  Upload Track
                </>
              )}
            </button>
          </div>
        </section>

        {/* Create Album */}
        <section className="bg-surface-container rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Create Album</h2>
            <span className="material-symbols-outlined text-primary">album</span>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Album Title
              </label>
              <input
                type="text"
                value={albumTitle}
                onChange={e => setAlbumTitle(e.target.value)}
                placeholder="e.g. Neon Horizons"
                className="w-full bg-surface-container-lowest rounded-xl p-4 text-white placeholder-outline focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Select Your Tracks
              </label>
              {loadingSongs ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner />
                </div>
              ) : songs.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant text-sm">
                  Upload some tracks first to add them to an album.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                  {songs.map(track => {
                    const selected = selectedTracks.includes(track._id)
                    return (
                      <div
                        key={track._id}
                        onClick={() => toggleTrack(track._id)}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          selected
                            ? 'bg-primary/10 border border-primary/30'
                            : 'bg-surface-container-high hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="material-symbols-outlined text-xl transition-colors"
                            style={{
                              fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0",
                              color: selected ? '#72fe8f' : '#767575',
                            }}
                          >
                            {selected ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className={`font-medium text-sm ${selected ? 'text-white' : 'text-on-surface-variant'}`}>
                            {track.title}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant text-base">
                          music_note
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              {selectedTracks.length > 0 && (
                <p className="text-xs text-primary font-bold">{selectedTracks.length} track(s) selected</p>
              )}
            </div>

            <button
              onClick={handleCreateAlbum}
              disabled={creatingAlbum}
              className="w-full py-4 rounded-full border border-primary text-primary font-black active:scale-95 transition-all hover:bg-primary/5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {creatingAlbum ? <Spinner size="sm" /> : (
                <>
                  <span className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}>library_add</span>
                  Create Album
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      <MusicPlayer />
      <BottomNav />
    </div>
  )
}
