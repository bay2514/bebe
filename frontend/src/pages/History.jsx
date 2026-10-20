import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function History() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/transactions')
      .then((res) => {
        setTransactions(res.data.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Memuat riwayat transaksi...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[#0B2C4D] px-1">📜 Riwayat Transaksi</h2>

      {transactions.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-md text-center text-slate-500 text-sm">
          Belum ada riwayat transaksi.
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {tx.type === 'deposit' ? '💵' : tx.type === 'redeem' ? '🎟️' : '🔄'}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#0B2C4D] capitalize">{tx.type}</h3>
                  <p className="text-xs text-slate-500">{tx.note || '-'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(tx.occurred_at).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${tx.direction === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {tx.direction === 'in' ? '+' : '-'}{formatRupiah(tx.amount)}
                </span>
                <p className="text-[10px] text-slate-400">Sisa: {formatRupiah(tx.balance_after)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
