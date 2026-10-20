import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-pink-50/40 flex flex-col max-w-md mx-auto shadow-2xl relative pb-24 font-sans">
      {/* Top Cute Header */}
      <header className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white p-4 shadow-lg sticky top-0 z-10 flex items-center justify-between rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <span className="text-xl animate-bounce">💖</span>
          <h1 className="text-base font-extrabold tracking-wide">Tabungan Kita Berdua</h1>
        </div>
        <span className="text-xs bg-white/25 px-2.5 py-1 rounded-full font-bold backdrop-blur-sm">v2.0 🌸</span>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Floating Cute Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border border-pink-100 fixed bottom-3 left-4 right-4 max-w-[calc(28rem-2rem)] mx-auto shadow-2xl rounded-3xl z-20 flex justify-around p-2">
        <Link
          to="/"
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition ${
            isActive('/') ? 'bg-pink-100 text-rose-600 font-bold shadow-sm scale-105' : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] mt-0.5">Beranda</span>
        </Link>
        <Link
          to="/deposit"
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition ${
            isActive('/deposit') ? 'bg-pink-100 text-rose-600 font-bold shadow-sm scale-105' : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <span className="text-xl">🍯</span>
          <span className="text-[10px] mt-0.5">Setor</span>
        </Link>
        <Link
          to="/history"
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition ${
            isActive('/history') ? 'bg-pink-100 text-rose-600 font-bold shadow-sm scale-105' : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <span className="text-xl">📜</span>
          <span className="text-[10px] mt-0.5">Riwayat</span>
        </Link>
        <Link
          to="/vouchers"
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition ${
            isActive('/vouchers') ? 'bg-pink-100 text-rose-600 font-bold shadow-sm scale-105' : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <span className="text-xl">🎟️</span>
          <span className="text-[10px] mt-0.5">Voucher</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition ${
            isActive('/profile') ? 'bg-pink-100 text-rose-600 font-bold shadow-sm scale-105' : 'text-slate-400 hover:text-rose-500'
          }`}
        >
          <span className="text-xl">🧸</span>
          <span className="text-[10px] mt-0.5">Profil</span>
        </Link>
      </nav>
    </div>
  )
}
