import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import bunga1 from '../assets/bunga/bunga/pngtree-romantic-pink-rose-bouquet-png-image_15405574.png'
import bunga2 from '../assets/bunga/bunga/pngtree-pink-rose-decoration-png-image_10013932.png'
import bunga3 from '../assets/bunga/bunga/pngtree-pink-tulip-soft-in-formal-garden-decoration-in-valentine-day-png-image_11409830.png'
import bunga4 from '../assets/bunga/bunga/pngtree-bouquet-of-white-tulips-png-image_12860769.png'
import bunga5 from '../assets/bunga/bunga/pngtree-3d-lily-white-flower-petals-delicate-bloom-nature-elegant-png-image_16291567.png'

export default function Home() {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pulsing, setPulsing] = useState(false)

  const fetchWallet = () => {
    setPulsing(true)
    api.get('/wallet')
      .then((res) => {
        setWallet(res.data.data)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false)
        setTimeout(() => setPulsing(false), 500)
      })
  }

  useEffect(() => {
    fetchWallet()
  }, [])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return <div className="text-center py-16 text-pink-500 font-medium animate-pulse">Lagi nyiapin celengan kita... 🌸</div>
  }

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Saldo Card dengan bunga dan tombol refresh interaktif */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden transform hover:scale-[1.01] transition duration-300">
        <img src={bunga1} alt="Bunga" className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-30 rotate-12 object-contain pointer-events-none animate-pulse" />
        
        <div className="flex items-center justify-between">
          <span className="bg-white/30 text-white text-[11px] px-3 py-1 rounded-full font-bold backdrop-blur-sm">
            Celengan Berdua ✨
          </span>
          <button 
            onClick={fetchWallet}
            className={`p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition ${pulsing ? 'animate-spin' : ''}`}
            title="Refresh Saldo"
          >
            🔄
          </button>
        </div>

        <p className="text-xs uppercase tracking-wider text-pink-100 font-medium mt-3">{wallet?.name || 'Tabungan Cinta Kita'}</p>
        <h2 className={`text-4xl font-extrabold mt-1 tracking-tight drop-shadow-sm transition-all duration-300 ${pulsing ? 'scale-105 opacity-80' : 'scale-100 opacity-100'}`}>
          {formatRupiah(wallet?.balance || 0)}
        </h2>
        
        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-xs text-white">
          <div className="flex items-center space-x-1.5">
            <span className="text-lg">👩‍❤️‍👨</span>
            <span className="font-semibold tracking-wide">{wallet?.users?.map(u => u.name).join(' & ')}</span>
          </div>
          <Link to="/deposit" className="px-4 py-2 bg-white text-rose-600 rounded-2xl font-bold shadow-md hover:bg-pink-50 active:scale-95 transition flex items-center space-x-1 transform hover:scale-105">
            <span>Setor Saldo 💰</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions dengan bunga */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/deposit" className="bg-white p-4 rounded-3xl shadow-lg border border-pink-100 flex items-center space-x-3 hover:border-pink-300 hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95">
          <img src={bunga2} alt="Bunga" className="w-10 h-10 object-contain rounded-xl" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Setor Tabungan</h3>
            <p className="text-[11px] text-slate-400">Tambah celengan yuk</p>
          </div>
        </Link>
        <Link to="/vouchers" className="bg-white p-4 rounded-3xl shadow-lg border border-pink-100 flex items-center space-x-3 hover:border-pink-300 hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95">
          <img src={bunga3} alt="Bunga" className="w-10 h-10 object-contain rounded-xl" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">Voucher Hadiah</h3>
            <p className="text-[11px] text-slate-400">Katalog reward seru</p>
          </div>
        </Link>
      </div>

      {/* Cute Info / Quote Card dengan bunga */}
      <div className="bg-gradient-to-r from-pink-50 to-amber-50 p-5 rounded-3xl shadow-md border border-pink-200/60 space-y-2 relative overflow-hidden transform hover:scale-[1.01] transition">
        <img src={bunga4} alt="Bunga" className="absolute right-2 top-2 w-12 h-12 object-contain opacity-40 animate-bounce" />
        <h3 className="text-sm font-bold text-rose-700 flex items-center space-x-1.5">
          <img src={bunga5} alt="Bunga" className="w-5 h-5 object-contain" />
          <span>Tips Menabung Imut Hari Ini</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          "Sedikit demi sedikit, lama-lama jadi bukit impian kita berdua! Jangan lupa senyum hari ini ya sayang~ 🌸💖"
        </p>
      </div>
    </div>
  )
}
