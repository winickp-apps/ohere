'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Star, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Investor, OutreachStatus } from '@/types/investor'
import { STAGE_COLORS, STATUS_CONFIG } from '@/lib/utils'

interface Props {
  investor: Investor
  onClose: () => void
  onUpdate: (updated: Investor) => void
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-36 shrink-0 text-xs text-gray-400 pt-0.5">{label}</div>
      <div className="flex-1 text-sm text-gray-800">{children}</div>
    </div>
  )
}

function LinkCell({ href }: { href: string }) {
  const display = href.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
      <span className="truncate max-w-[280px]">{display}</span>
      <ExternalLink size={11} className="shrink-0" />
    </a>
  )
}

export default function InvestorPanel({ investor, onClose, onUpdate }: Props) {
  const [status, setStatus] = useState<OutreachStatus>(investor.outreach_status)
  const [relevance, setRelevance] = useState<number | null>(investor.relevance_score)
  const [contactName, setContactName] = useState(investor.contact_person_name ?? '')
  const [contactTitle, setContactTitle] = useState(investor.contact_person_title ?? '')
  const [contactEmail, setContactEmail] = useState(investor.contact_email ?? '')
  const [phone, setPhone] = useState(investor.phone_number ?? '')
  const [firstContact, setFirstContact] = useState(investor.first_contact_date ?? '')
  const [lastContact, setLastContact] = useState(investor.last_contact_date ?? '')
  const [notes, setNotes] = useState(investor.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setStatus(investor.outreach_status)
    setRelevance(investor.relevance_score)
    setContactName(investor.contact_person_name ?? '')
    setContactTitle(investor.contact_person_title ?? '')
    setContactEmail(investor.contact_email ?? '')
    setPhone(investor.phone_number ?? '')
    setFirstContact(investor.first_contact_date ?? '')
    setLastContact(investor.last_contact_date ?? '')
    setNotes(investor.notes ?? '')
    setSaved(false)
  }, [investor.id])

  const handleSave = async () => {
    setSaving(true)
    const { data, error } = await supabase.from('investors').update({
      outreach_status: status, relevance_score: relevance,
      contact_person_name: contactName || null, contact_person_title: contactTitle || null,
      contact_email: contactEmail || null, phone_number: phone || null,
      first_contact_date: firstContact || null, last_contact_date: lastContact || null,
      notes: notes || null,
    }).eq('id', investor.id).select().single()
    if (!error && data) { onUpdate(data as Investor); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    setSaving(false)
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white'

  return (
    <div className="fixed right-0 top-0 h-full w-[520px] bg-white border-l border-gray-200 shadow-xl flex flex-col z-10">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
        <span className="text-xs text-gray-400">Investor detail</span>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors"><X size={17} className="text-gray-500" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <h1 className="text-xl font-semibold text-gray-900 mb-5">{investor.name}</h1>
        <div className="mb-6">
          {investor.crunchbase_url && <FieldRow label="Crunchbase"><LinkCell href={investor.crunchbase_url} /></FieldRow>}
          {investor.investment_stages.length > 0 && <FieldRow label="Investment Stage"><div className="flex flex-wrap gap-1">{investor.investment_stages.map(s => <span key={s} className={`px-2 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[s] ?? 'bg-gray-100 text-gray-600'}`}>{s}</span>)}</div></FieldRow>}
          {investor.regions.length > 0 && <FieldRow label="Regions"><div className="flex flex-wrap gap-1">{investor.regions.map(r => <span key={r} className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">{r}</span>)}</div></FieldRow>}
          {investor.location && <FieldRow label="Location">{investor.location}</FieldRow>}
          {investor.number_of_investments !== null && <FieldRow label="Investments">{investor.number_of_investments}</FieldRow>}
          {investor.number_of_exits !== null && <FieldRow label="Exits">{investor.number_of_exits}</FieldRow>}
          {investor.number_of_portfolio_organizations !== null && <FieldRow label="Portfolio Cos">{investor.number_of_portfolio_organizations}</FieldRow>}
          {investor.number_of_lead_investments !== null && <FieldRow label="Lead Investments">{investor.number_of_lead_investments}</FieldRow>}
          {investor.description && <FieldRow label="Description"><span className="text-gray-600 leading-relaxed">{investor.description}</span></FieldRow>}
          {investor.full_description && investor.full_description !== investor.description && <FieldRow label="Full Description"><span className="text-gray-600 leading-relaxed">{investor.full_description}</span></FieldRow>}
          {investor.linkedin_url && <FieldRow label="LinkedIn"><LinkCell href={investor.linkedin_url} /></FieldRow>}
          {investor.facebook_url && <FieldRow label="Facebook"><LinkCell href={investor.facebook_url} /></FieldRow>}
          {investor.website && <FieldRow label="Website"><LinkCell href={investor.website} /></FieldRow>}
        </div>
        <div className="border-t border-gray-200 pt-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Outreach Tracking</p>
          <div className="mb-4"><label className="block text-xs text-gray-400 mb-1.5">Status</label><select value={status} onChange={e => setStatus(e.target.value as OutreachStatus)} className={inputCls}>{(Object.entries(STATUS_CONFIG) as [OutreachStatus, { label: string }][]).map(([v, cfg]) => <option key={v} value={v}>{cfg.label}</option>)}</select></div>
          <div className="mb-4"><label className="block text-xs text-gray-400 mb-1.5">Relevance for Ohere</label><div className="flex gap-0.5">{[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setRelevance(relevance === n ? null : n)} className={`p-1 transition-colors ${(relevance ?? 0) >= n ? 'text-amber-400' : 'text-gray-200 hover:text-amber-200'}`}><Star size={22} fill={(relevance ?? 0) >= n ? 'currentColor' : 'none'} /></button>)}</div></div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="block text-xs text-gray-400 mb-1.5">Contact Name</label><input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Name" className={inputCls} /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">Title</label><input type="text" value={contactTitle} onChange={e => setContactTitle(e.target.value)} placeholder="e.g. Managing Partner" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="block text-xs text-gray-400 mb-1.5">Email</label><input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="email@example.com" className={inputCls} /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000" className={inputCls} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="block text-xs text-gray-400 mb-1.5">First Contact</label><input type="date" value={firstContact} onChange={e => setFirstContact(e.target.value)} className={inputCls} /></div>
            <div><label className="block text-xs text-gray-400 mb-1.5">Last Contact</label><input type="date" value={lastContact} onChange={e => setLastContact(e.target.value)} className={inputCls} /></div>
          </div>
          <div className="mb-5"><label className="block text-xs text-gray-400 mb-1.5">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes on this investor, conversations, follow-ups..." rows={4} className={`${inputCls} resize-none`} /></div>
          <button onClick={handleSave} disabled={saving} className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50'}`}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
