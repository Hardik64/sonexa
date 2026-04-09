import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // sends cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Auth ────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser    = (data) => api.post('/auth/login', data)
export const logoutUser   = ()     => api.post('/auth/logout')

// ─── Music ───────────────────────────────────────────────
export const getAllMusics  = ()          => api.get('/music/')
export const uploadMusic  = (formData)  =>
  api.post('/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// ─── Albums ──────────────────────────────────────────────
export const getAllAlbums   = ()          => api.get('/music/albums')
export const getAlbumById  = (albumId)   => api.get(`/music/albums/${albumId}`)
export const createAlbum   = (data)      => api.post('/music/album', data)

export default api
