'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Investor } from '@/types/investor'
import { STAGE_OPTIONS } from '@/lib/utils'

interface Props { onClose: () => void; onAdd: (investor: Investor) => void }

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white'

export default function AddInvestorModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [stages, setStages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const toggleStage = (s: string) => setStages(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    setError(''); setSaving(true)
    const { data, error: err } = await supabase.from('investors').insert({ name: name.trim(), website: website || null, linkedin_url: linkedin || null, location: location || null, description: description || null, investment_stages: stages }).select().single()
    if (err) { setError(err.message); setSaving(false) } else { onAdd(data as Investor) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Add Investor</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors"><X size={17} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div><label className="block text-xs text-gray-500 mb-1.5">Organization / Person Name <span className="text-red-500">*</span></label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Castlegate Investments" className={inputCls} autoFocus /></div>
          <div><label className="block text-xs text-gray-500 mb-1.5">Investment Stages</label><div className="flex flex-wrap gap-1.5">{STAGE_OPTIONS.map(s => <button key={s} type="button" onClick={() => toggleStage(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${stages.includes(s) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>{s}</button>)}</div></div>
          <div><label className="block text-xs text-gray-500 mb-1.5">Website</label><input type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className={inputCls} /></div>
          <div><label className="block text-xs text-gray-500 mb-1.5">LinkedIn</label><input type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..." className={inputCls} /></div>
          <div><label className="block text-xs text-gray-500 mb-1.5">Location</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. London, United Kingdom" className={inputCls} /></div>
          <div><label className="block text-xs text-gray-500 mb-1.5">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the investor..." rows={3} className={`${inputCls} resize-none`} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">{saving && <Loader2 size={15} className="animate-spin" />}{saving ? 'Adding...' : 'Add Investor'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
