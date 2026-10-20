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
    return <div className="text-center py-12 text-slate-500">Memuat saldo tabungan...</div>
  }

  return (
    <div className="space-y-6">
      {/* Saldo Card */}
      <div className="bg-gradient-to-br from-[#0B2C4D] to-[#154675] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-10">💰</div>
        <p className="text-xs uppercase tracking-wider text-slate-300 font-medium">{wallet?.name || 'Tabungan Berdua'}</p>
        <h2 className="text-3xl font-bold mt-2">{formatRupiah(wallet?.balance || 0)}</h2>
        
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-200">
          <div>
            <span className="opacity-75">Partner:</span>{' '}
            <span className="font-semibold">{wallet?.users?.map(u => u.name).join(' & ')}</span>
          </div>
          <Link to="/deposit" className="px-3 py-1.5 bg-[#ff6b35] text-white rounded-xl font-semibold shadow hover:opacity-90 transition">
            + Tambah
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/deposit" className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center space-x-3 hover:border-[#ff6b35] transition">
          <span className="text-3xl">💵</span>
          <div>
            <h3 className="text-sm font-bold text-[#0B2C4D]">Setor Tabungan</h3>
            <p className="text-xs text-slate-500">Tambah saldo bersama</p>
          </div>
        </Link>
        <Link to="/vouchers" className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center space-x-3 hover:border-[#ff6b35] transition">
          <span className="text-3xl">🎟️</span>
          <div>
            <h3 className="text-sm font-bold text-[#0B2C4D]">Katalog Voucher</h3>
            <p className="text-xs text-slate-500">Redeem reward seru</p>
          </div>
        </Link>
      </div>

      {/* Info Card */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 space-y-2">
        <h3 className="text-sm font-bold text-[#0B2C4D]">✨ Tips Menabung Berdua</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Menabung bersama memperkuat komitmen finansial. Gunakan voucher reward setelah mencapai target impian kalian!
        </p>
      </div>
    </div>
  )
}
