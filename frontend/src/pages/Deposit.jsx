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

  const quickAmounts = [20000, 50000, 100000, 200000]

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
        note: note || 'Setor tabungan berdua ✨',
      }, {
        headers: {
          'X-Idempotency-Key': 'deposit-' + Date.now()
        }
      })
      setSuccess(true)
      setAmount('')
      setNote('')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan setoran. 🧸')
    } finally {
      setLoading(false)
    }
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-100 relative overflow-hidden">
        <div className="absolute right-[-10px] top-[-10px] text-7xl opacity-15">🌸🍯</div>
        
        <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
          <span>🐷</span>
          <span>Setor Tabungan Berdua</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">Yuk tambah celengan babi buat masa depan kita berdua ✨</p>

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl font-semibold">
            🎉 Yeay! Setoran berhasil disimpan ke celengan babi kita! Mengalihkan... 💖
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-2xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Nominal Setoran (Rp)</label>
            <input
              type="number"
              min="1000"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Contoh: 50000"
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-2">Nominal Cepat Gemes 🌸</span>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAdd(val)}
                  className="py-2.5 px-3 bg-pink-50/80 hover:bg-pink-100 text-rose-700 text-xs font-bold rounded-2xl border border-pink-200/60 transition active:scale-95"
                >
                  + {formatRupiah(val)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Catatan Romantis (Opsional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Misal: Nabung buat jajan boba weekend ini 🧋"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-pink-500/30 active:scale-98 transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan celengan babi... 🐷' : 'Simpan Setoran Sekarang ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}
