'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Investor } from '@/types/investor'
import InvestorTable from '@/components/InvestorTable'
import InvestorPanel from '@/components/InvestorPanel'
import AddInvestorModal from '@/components/AddInvestorModal'
import { STATUS_CONFIG, STAGE_OPTIONS, REGION_OPTIONS } from '@/lib/utils'

const PAGE_SIZE = 50

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterRegion, setFilterRegion] = useState('')
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [search])

  const fetchInvestors = useCallback(async () => {
    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
      .from('investors')
      .select('*', { count: 'exact' })
      .order('name')
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

    if (debouncedSearch) query = query.ilike('name', `%${debouncedSearch}%`)
    if (filterStatus) query = query.eq('outreach_status', filterStatus)
    if (filterStage) query = query.contains('investment_stages', [filterStage])
    if (filterRegion) query = query.contains('regions', [filterRegion])

    const { data, count, error } = await query
    if (!error) {
      setInvestors(data ?? [])
      setTotal(count ?? 0)
    }
    setLoading(false)
  }, [page, debouncedSearch, filterStatus, filterStage, filterRegion])

  useEffect(() => { fetchInvestors() }, [fetchInvestors])

  const handleUpdate = (updated: Investor) => {
    setInvestors(prev => prev.map(inv => (inv.id === updated.id ? updated : inv)))
    setSelectedInvestor(updated)
  }

  const handleAdd = (added: Investor) => {
    setShowAdd(false)
    fetchInvestors()
    setSelectedInvestor(added)
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ${selectedInvestor ? 'mr-[520px]' : ''}`}>
        <div className="px-8 pt-8 pb-3 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900 mb-0.5">Investor Outreach</h1>
          <p className="text-sm text-gray-400">Family offices and investors for Ohere fundraising</p>
        </div>
        <div className="px-8 py-3 flex items-center gap-3 border-b border-gray-200">
          <div className="relative w-72">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..." className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
            <option value="">All Statuses</option>
            {(Object.entries(STATUS_CONFIG) as [string, { label: string }][]).map(([v, cfg]) => <option key={v} value={v}>{cfg.label}</option>)}
          </select>
          <select value={filterStage} onChange={e => { setFilterStage(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
            <option value="">All Stages</option>
            {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterRegion} onChange={e => { setFilterRegion(e.target.value); setPage(1) }} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
            <option value="">All Regions</option>
            {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-400">{total.toLocaleString()} investor{total !== 1 ? 's' : ''}</span>
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 bg-gray-900 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-gray-700 transition-colors"><Plus size={14} />Add Investor</button>
          </div>
        </div>
        <InvestorTable investors={investors} loading={loading} onSelect={setSelectedInvestor} selectedId={selectedInvestor?.id} />
        {totalPages > 1 && (
          <div className="px-8 py-3 border-t border-gray-200 flex items-center justify-between shrink-0">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-40 transition-colors"><ChevronLeft size={14} /> Previous</button>
            <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-40 transition-colors">Next <ChevronRight size={14} /></button>
          </div>
        )}
      </div>
      {selectedInvestor && <InvestorPanel investor={selectedInvestor} onClose={() => setSelectedInvestor(null)} onUpdate={handleUpdate} />}
      {showAdd && <AddInvestorModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  )
}
