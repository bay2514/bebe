import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Home() {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/wallet')
      .then((res) => {
        setWallet(res.data.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return <div className="text-center py-16 text-pink-500 font-medium animate-pulse">🐷 Lagi nyiapin celengan babi gemes kita...</div>
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Saldo Card Cuteness */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden transform hover:scale-[1.01] transition duration-300">
        <div className="absolute right-[-15px] bottom-[-15px] text-8xl opacity-20 rotate-12">🐷💖</div>
        <div className="flex items-center space-x-2">
          <span className="bg-white/30 text-white text-[11px] px-3 py-1 rounded-full font-bold backdrop-blur-sm">
            ✨ Celengan Berdua
          </span>
        </div>
        <p className="text-xs uppercase tracking-wider text-pink-100 font-medium mt-3">{wallet?.name || 'Tabungan Cinta Kita'}</p>
        <h2 className="text-4xl font-extrabold mt-1 tracking-tight drop-shadow-sm">{formatRupiah(wallet?.balance || 0)}</h2>
        
        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-xs text-white">
          <div className="flex items-center space-x-1.5">
            <span className="text-lg">👩‍❤️‍👨</span>
            <span className="font-semibold tracking-wide">{wallet?.users?.map(u => u.name).join(' & ')}</span>
          </div>
          <Link to="/deposit" className="px-4 py-2 bg-white text-rose-600 rounded-2xl font-bold shadow-md hover:bg-pink-50 active:scale-95 transition flex items-center space-x-1">
            <span>🌸 Setor</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions Cute Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/deposit" className="bg-white p-4 rounded-3xl shadow-lg border border-pink-100 flex items-center space-x-3 hover:border-pink-300 hover:shadow-xl transition transform hover:-translate-y-0.5">
          <span className="text-3xl bg-pink-50 p-2 rounded-2xl shadow-inner">🍯</span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Setor Tabungan</h3>
            <p className="text-[11px] text-slate-400">Tambah celengan yuk</p>
          </div>
        </Link>
        <Link to="/vouchers" className="bg-white p-4 rounded-3xl shadow-lg border border-pink-100 flex items-center space-x-3 hover:border-pink-300 hover:shadow-xl transition transform hover:-translate-y-0.5">
          <span className="text-3xl bg-amber-50 p-2 rounded-2xl shadow-inner">🎟️</span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Voucher Hadiah</h3>
            <p className="text-[11px] text-slate-400">Katalog reward seru</p>
          </div>
        </Link>
      </div>

      {/* Cute Info / Quote Card */}
      <div className="bg-gradient-to-r from-pink-50 to-amber-50 p-5 rounded-3xl shadow-md border border-pink-200/60 space-y-2 relative overflow-hidden">
        <div className="absolute right-2 top-2 text-2xl opacity-40">✨🌷</div>
        <h3 className="text-sm font-bold text-rose-700 flex items-center space-x-1.5">
          <span>💡</span>
          <span>Tips Menabung Imut Hari Ini</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          "Sedikit demi sedikit, lama-lama jadi bukit impian kita berdua! Jangan lupa senyum hari ini ya sayang~ 💖"
        </p>
      </div>
    </div>
  )
}
