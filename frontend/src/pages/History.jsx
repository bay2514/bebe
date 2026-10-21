import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function History() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = () => {
    setLoading(true)
    api.get('/transactions')
      .then((res) => {
        setTransactions(res.data.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return <div className="text-center py-12 text-pink-500 font-medium animate-pulse">🌸 Memuat riwayat transaksi...</div>
  }

  return (
    <div className="space-y-4 animate-fadeIn pb-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-extrabold text-slate-800 flex items-center space-x-2">
          <span>📜</span>
          <span>Riwayat Transaksi Kita</span>
        </h2>
        <button
          onClick={fetchTransactions}
          className="text-xs px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-rose-700 font-bold rounded-xl transition flex items-center space-x-1 active:scale-95"
        >
          <span>🔄 Segarkan</span>
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-100 text-center text-slate-400 text-xs">
          Belum ada riwayat transaksi. Yuk mulai menabung atau redeem voucher! 🐷✨
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4.5 rounded-3xl shadow-lg border border-pink-100 flex items-center justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center space-x-3.5">
                <span className="text-3xl bg-pink-50 p-3 rounded-2xl shadow-sm transform hover:rotate-6 transition">
                  {tx.type === 'deposit' ? '💵' : tx.type === 'redeem' ? '🎟️' : '🔄'}
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 capitalize">{tx.type}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{tx.note || '-'}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(tx.occurred_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-extrabold ${tx.direction === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.direction === 'in' ? '+' : '-'}{formatRupiah(tx.amount)}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Sisa: {formatRupiah(tx.balance_after)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
