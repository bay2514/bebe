import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/me')
      .then((res) => {
        setProfile(res.data.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (e) {
      // ignore
    } finally {
      logout()
      navigate('/login')
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Memuat profil...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-center space-y-3">
        <div className="w-16 h-16 bg-[#0B2C4D] text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto shadow">
          {profile?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0B2C4D]">{profile?.name}</h2>
          <p className="text-xs text-slate-500">{profile?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-50 text-red-600 font-semibold text-sm rounded-xl border border-red-200 hover:bg-red-100 transition mt-4"
        >
          Keluar (Logout)
        </button>
      </div>
    </div>
  )
}
