import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [redeemingId, setRedeemingId] = useState(null)
  const [message, setMessage] = useState(null)

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
    if (!window.confirm(`Yakin ingin redeem voucher "${title}"?`)) return

    setRedeemingId(id)
    setMessage(null)

    try {
      await api.post(`/vouchers/${id}/redeem`)
      setMessage({ type: 'success', text: `Berhasil redeem voucher "${title}"!` })
      fetchVouchers()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal redeem voucher.' })
    } finally {
      setRedeemingId(null)
    }
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Memuat katalog voucher...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[#0B2C4D] px-1">🎟️ Katalog Voucher Reward</h2>

      {message && (
        <div className={`p-3 rounded-xl text-sm border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {vouchers.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-md text-center text-slate-500 text-sm">
          Belum ada voucher tersedia.
        </div>
      ) : (
        <div className="space-y-3">
          {vouchers.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{v.emoji || '🎁'}</span>
                <div>
                  <h3 className="text-sm font-bold text-[#0B2C4D]">{v.title}</h3>
                  <p className="text-xs text-slate-500">{v.description || '-'}</p>
                  <p className="text-xs font-semibold text-[#ff6b35] mt-1">{formatRupiah(v.price)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(v.id, v.title)}
                disabled={redeemingId === v.id}
                className="px-3 py-1.5 bg-[#0B2C4D] text-white text-xs font-semibold rounded-xl shadow hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {redeemingId === v.id ? 'Memproses...' : 'Redeem'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
