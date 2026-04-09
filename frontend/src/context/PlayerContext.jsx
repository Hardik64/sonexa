import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef(new Audio())

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = volume

    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onEnded = () => playNext()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [queue])

  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  const playTrack = (track, trackQueue = []) => {
    if (trackQueue.length > 0) setQueue(trackQueue)
    if (currentTrack?._id === track._id) {
      togglePlay()
      return
    }
    audioRef.current.src = track.uri
    audioRef.current.play().catch(() => {})
    setCurrentTrack(track)
    setIsPlaying(true)
    setProgress(0)
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (!currentTrack || queue.length === 0) return
    const idx = queue.findIndex((t) => t._id === currentTrack._id)
    const next = queue[idx + 1]
    if (next) playTrack(next, queue)
  }

  const playPrev = () => {
    if (!currentTrack || queue.length === 0) return
    const idx = queue.findIndex((t) => t._id === currentTrack._id)
    const prev = queue[idx - 1]
    if (prev) playTrack(prev, queue)
  }

  const seek = (time) => {
    audioRef.current.currentTime = time
    setProgress(time)
  }

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack, isPlaying, progress, duration,
        volume, setVolume, playTrack, togglePlay,
        playNext, playPrev, seek, formatTime, queue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
