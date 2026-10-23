import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      const status = err.response?.status
      if (status === 401 || status === 422) {
        setError('Email atau password salah')
      } else if (status === 419) {
        setError('Sesi kedaluwarsa, muat ulang halaman')
      } else if (!status || status >= 500) {
        setError('Server belum bisa dihubungi, coba lagi sebentar')
      } else {
        setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password ya~ 🧸')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 px-4 font-sans">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-pink-200/60 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-10">🐷💖</div>
        
        <div className="text-center mb-8">
          <span className="text-5xl inline-block animate-bounce">🐷✨</span>
          <h1 className="text-2xl font-extrabold text-slate-800 mt-3 tracking-tight">Tabungan Kita Berdua</h1>
          <p className="text-xs text-slate-400 mt-1">Masuk yuk untuk wujudkan impian manis kita bersama 🌸</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-2xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Kamu / Pasangan</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="bebe@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Password Rahasia</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-pink-500/30 active:scale-98 transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Masuk ke celengan babi... 🐷' : 'Masuk Sekarang ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}
