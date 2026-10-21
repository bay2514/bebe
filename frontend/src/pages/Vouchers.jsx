import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [redeemingId, setRedeemingId] = useState(null)
  const [message, setMessage] = useState(null)

  // Form state for creating new voucher
  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('reward')
  const [emoji, setEmoji] = useState('🌸')
  const [price, setPrice] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchVouchers = () => {
    api.get('/vouchers')
      .then((res) => {
        setVouchers(res.data.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  const handleRedeem = async (id, title) => {
    if (!window.confirm(`Yakin ingin redeem voucher "${title}"? ✨`)) return

    setRedeemingId(id)
    setMessage(null)

    try {
      await api.post(`/vouchers/${id}/redeem`)
      setMessage({ type: 'success', text: `Berhasil redeem voucher "${title}"! 💖 Yeay!` })
      fetchVouchers()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal redeem voucher. Saldo mungkin kurang~' })
    } finally {
      setRedeemingId(null)
    }
  }

  const handleCreateVoucher = async (e) => {
    e.preventDefault()
    setCreating(true)
    setMessage(null)

    try {
      await api.post('/vouchers', {
        title,
        description,
        category,
        emoji,
        price: parseInt(price, 10),
        is_recurring: false,
      })
      setMessage({ type: 'success', text: 'Voucher baru berhasil ditambahkan! 🐷✨' })
      setTitle('')
      setDescription('')
      setPrice('')
      setShowAddForm(false)
      fetchVouchers()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal membuat voucher baru.' })
    } finally {
      setCreating(false)
    }
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return <div className="text-center py-12 text-pink-500 font-medium animate-pulse">🌸 Memuat katalog voucher gemes...</div>
  }

  return (
    <div className="space-y-6 pb-6 animate-fadeIn">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center space-x-2">
            <span>🎟️</span>
            <span>Katalog Voucher Reward</span>
          </h2>
          <p className="text-xs text-slate-400">Tukar tabunganmu atau bikin voucher baru untuk pasangan 💖</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 active:scale-95 hover:shadow-lg hover:from-pink-600 hover:to-rose-600 transition transform hover:-translate-y-0.5"
        >
          {showAddForm ? 'Tutup ✕' : '+ Buat Voucher 🌸'}
        </button>
      </div>

      {message && (
        <div className={`p-3.5 rounded-2xl text-xs font-semibold border transition-all animate-bounce ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
          {message.text}
        </div>
      )}

      {/* Add Voucher Form Modal / Box with transition */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-pink-200 space-y-4 transform transition-all duration-300 animate-fadeIn">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center space-x-2">
            <span>✨</span>
            <span>Bikin Voucher Hadiah Baru</span>
          </h3>

          <form onSubmit={handleCreateVoucher} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Judul Voucher</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Pijat Punggung 15 Menit 🌸"
                className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Emoji / Simbol</label>
                <input
                  type="text"
                  required
                  maxLength="5"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 text-xs text-center focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="25000"
                  className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berlaku kapanpun pas lagi capek~"
                className="w-full px-4 py-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-pink-500/20 active:scale-98 transition disabled:opacity-50"
            >
              {creating ? 'Menyimpan Voucher... 🐷' : 'Simpan & Pasang Voucher 🎟️'}
            </button>
          </form>
        </div>
      )}

      {vouchers.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-100 text-center text-slate-400 text-xs">
          Belum ada voucher tersedia. Yuk buat voucher pertamamu! 🐷✨
        </div>
      ) : (
        <div className="space-y-3">
          {vouchers.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-3xl shadow-lg border border-pink-100 flex items-center justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center space-x-3.5">
                <span className="text-3xl bg-pink-50 p-3 rounded-2xl shadow-sm transform hover:rotate-6 transition">{v.emoji || '🎁'}</span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800">{v.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{v.description || 'Voucher spesial kesayangan 💖'}</p>
                  <p className="text-xs font-bold text-rose-500 mt-1">{formatRupiah(v.price)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(v.id, v.title)}
                disabled={redeemingId === v.id}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 hover:from-pink-600 hover:to-rose-600 transition active:scale-95 disabled:opacity-50 transform hover:scale-105"
              >
                {redeemingId === v.id ? 'Menukar...' : 'Redeem 🎟️'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
