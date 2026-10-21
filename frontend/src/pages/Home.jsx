import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'
import bunga1 from '../assets/bunga/bunga/pngtree-romantic-pink-rose-bouquet-png-image_15405574.png'
import bunga2 from '../assets/bunga/bunga/pngtree-pink-rose-decoration-png-image_10013932.png'
import bunga3 from '../assets/bunga/bunga/pngtree-pink-tulip-soft-in-formal-garden-decoration-in-valentine-day-png-image_11409830.png'
import bunga4 from '../assets/bunga/bunga/pngtree-bouquet-of-white-tulips-png-image_12860769.png'
import bunga5 from '../assets/bunga/bunga/pngtree-3d-lily-white-flower-petals-delicate-bloom-nature-elegant-png-image_16291567.png'
import { RefreshIcon, DepositIcon, RedeemIcon, HistoryIcon, ProfileIcon, GiftIcon } from '../components/Icons'

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
        setTimeout(() => setPulsing(false), 600)
      })
  }

  useEffect(() => {
    fetchWallet()
  }, [])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center animate-bounce">
          <img src={bunga1} alt="Bunga" className="w-10 h-10 object-contain animate-spin" />
        </div>
        <p className="text-xs text-pink-600 font-bold tracking-wide">Merangkai celengan cinta kita... 🌸</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      {/* Saldo Card dengan bunga dan tombol refresh interaktif */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden transform hover:scale-[1.01] transition duration-300">
        <img src={bunga1} alt="Bunga" className="absolute right-[-30px] bottom-[-30px] w-48 h-48 opacity-25 rotate-12 object-contain pointer-events-none animate-pulse" />
        
        <div className="flex items-center justify-between z-10 relative">
          <span className="bg-white/25 text-white text-[11px] px-3.5 py-1.5 rounded-2xl font-extrabold backdrop-blur-md shadow-sm border border-white/20">
            ✨ Celengan Berdua Kita
          </span>
          <button 
            onClick={fetchWallet}
            className={`p-2.5 bg-white/25 hover:bg-white/35 rounded-2xl backdrop-blur-md transition shadow-sm border border-white/20 active:scale-95 ${pulsing ? 'animate-spin' : ''}`}
            title="Refresh Saldo"
          >
            <RefreshIcon className="w-4 h-4 text-white" />
          </button>
        </div>

        <p className="text-xs uppercase tracking-wider text-pink-100 font-bold mt-4 z-10 relative">{wallet?.name || 'Tabungan Cinta Kita'}</p>
        <h2 className={`text-4xl font-extrabold mt-1.5 tracking-tight drop-shadow-md transition-all duration-300 z-10 relative ${pulsing ? 'scale-105 opacity-80' : 'scale-100 opacity-100'}`}>
          {formatRupiah(wallet?.balance || 0)}
        </h2>
        
        <div className="mt-6 pt-4 border-t border-white/25 flex justify-between items-center text-xs text-white z-10 relative">
          <div className="flex items-center space-x-2">
            <span className="text-xl bg-white/20 p-1.5 rounded-xl backdrop-blur-sm">👩‍❤️‍👨</span>
            <span className="font-bold tracking-wide">{wallet?.users?.map(u => u.name).join(' & ')}</span>
          </div>
          <Link to="/deposit" className="px-4.5 py-2.5 bg-white text-rose-600 rounded-2xl font-extrabold shadow-lg hover:bg-pink-50 active:scale-95 transition flex items-center space-x-1.5 transform hover:scale-105">
            <DepositIcon className="w-4 h-4 text-rose-600" />
            <span>Setor Saldo</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions dengan bunga */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/deposit" className="bg-white p-4.5 rounded-3xl shadow-xl border border-pink-100/80 flex items-center space-x-3.5 hover:border-pink-300 hover:shadow-2xl transition transform hover:-translate-y-1 active:scale-95 group">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition">
            <img src={bunga2} alt="Bunga" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-800">Setor Tabungan</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Tambah celengan yuk</p>
          </div>
        </Link>
        
        <Link to="/vouchers" className="bg-white p-4.5 rounded-3xl shadow-xl border border-pink-100/80 flex items-center space-x-3.5 hover:border-pink-300 hover:shadow-2xl transition transform hover:-translate-y-1 active:scale-95 group">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition">
            <img src={bunga3} alt="Bunga" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-800">Voucher Hadiah</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Katalog reward seru</p>
          </div>
        </Link>
      </div>

      {/* Menu Navigasi Tambahan Cepat */}
      <div className="bg-white p-4 rounded-3xl shadow-xl border border-pink-100/80 space-y-3">
        <h4 className="text-xs font-extrabold text-slate-700 px-1">Menu Kilat Romantis 🌸</h4>
        <div className="grid grid-cols-3 gap-2.5">
          <Link to="/history" className="flex flex-col items-center p-3 rounded-2xl bg-pink-50/50 hover:bg-pink-100/80 border border-pink-100 transition active:scale-95 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-rose-500 mb-1 group-hover:rotate-12 transition">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Riwayat</span>
          </Link>
          
          <Link to="/vouchers" className="flex flex-col items-center p-3 rounded-2xl bg-pink-50/50 hover:bg-pink-100/80 border border-pink-100 transition active:scale-95 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-rose-500 mb-1 group-hover:rotate-12 transition">
              <GiftIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Voucher</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center p-3 rounded-2xl bg-pink-50/50 hover:bg-pink-100/80 border border-pink-100 transition active:scale-95 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-rose-500 mb-1 group-hover:rotate-12 transition">
              <ProfileIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Profil</span>
          </Link>
        </div>
      </div>

      {/* Cute Info / Quote Card dengan bunga */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-5 rounded-3xl shadow-xl border border-pink-200/80 space-y-2 relative overflow-hidden transform hover:scale-[1.01] transition">
        <img src={bunga4} alt="Bunga" className="absolute right-2 top-2 w-14 h-14 object-contain opacity-35 animate-bounce pointer-events-none" />
        <h3 className="text-xs font-extrabold text-rose-700 flex items-center space-x-2">
          <img src={bunga5} alt="Bunga" className="w-5 h-5 object-contain" />
          <span>Tips Menabung Imut Hari Ini</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          "Sedikit demi sedikit, lama-lama jadi bukit impian kita berdua! Jangan lupa senyum hari ini ya bebe~ 🌸💖"
        </p>
      </div>
    </div>
  )
}
