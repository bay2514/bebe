import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col max-w-md mx-auto shadow-2xl relative pb-20">
      {/* Top Header */}
      <header className="bg-[#0B2C4D] text-white p-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-lg font-bold">💕 Tabungan Berdua</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto shadow-lg z-20 flex justify-around p-2">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            isActive('/') ? 'text-[#ff6b35] font-semibold' : 'text-slate-500 hover:text-[#0B2C4D]'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-xs mt-1">Beranda</span>
        </Link>
        <Link
          to="/deposit"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            isActive('/deposit') ? 'text-[#ff6b35] font-semibold' : 'text-slate-500 hover:text-[#0B2C4D]'
          }`}
        >
          <span className="text-xl">💰</span>
          <span className="text-xs mt-1">Tambah</span>
        </Link>
        <Link
          to="/history"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            isActive('/history') ? 'text-[#ff6b35] font-semibold' : 'text-slate-500 hover:text-[#0B2C4D]'
          }`}
        >
          <span className="text-xl">📜</span>
          <span className="text-xs mt-1">Riwayat</span>
        </Link>
        <Link
          to="/vouchers"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            isActive('/vouchers') ? 'text-[#ff6b35] font-semibold' : 'text-slate-500 hover:text-[#0B2C4D]'
          }`}
        >
          <span className="text-xl">🎟️</span>
          <span className="text-xs mt-1">Voucher</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            isActive('/profile') ? 'text-[#ff6b35] font-semibold' : 'text-slate-500 hover:text-[#0B2C4D]'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </nav>
    </div>
  )
}
