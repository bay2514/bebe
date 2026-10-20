import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Deposit() {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleQuickAdd = (val) => {
    setAmount(val.toString())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await api.post('/wallet/deposit', {
        amount: parseInt(amount, 10),
        note: note || 'Setor tabungan',
      })
      setSuccess(true)
      setAmount('')
      setNote('')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan setoran.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-lg font-bold text-[#0B2C4D] mb-4">💰 Setor Tabungan Berdua</h2>

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
            Berhasil setor tabungan! Mengalihkan ke beranda...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              min="1000"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B2C4D]"
              placeholder="Contoh: 50000"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => handleQuickAdd(20000)} className="py-2 bg-slate-100 text-xs font-semibold rounded-xl hover:bg-slate-200 transition">Rp 20.000</button>
            <button type="button" onClick={() => handleQuickAdd(50000)} className="py-2 bg-slate-100 text-xs font-semibold rounded-xl hover:bg-slate-200 transition">Rp 50.000</button>
            <button type="button" onClick={() => handleQuickAdd(100000)} className="py-2 bg-slate-100 text-xs font-semibold rounded-xl hover:bg-slate-200 transition">Rp 100.000</button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Catatan (Opsional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B2C4D]"
              placeholder="Contoh: Nabung jajan minggu ini"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0B2C4D] text-white font-semibold rounded-xl shadow-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Setor Sekarang'}
          </button>
        </form>
      </div>
    </div>
  )
}
