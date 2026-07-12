'use client'

import { FileText } from 'lucide-react'
import type { Investor } from '@/types/investor'
import { STAGE_COLORS, STATUS_CONFIG } from '@/lib/utils'

interface Props {
  investors: Investor[]
  loading: boolean
  onSelect: (investor: Investor) => void
  selectedId?: string
}

function StageTags({ stages }: { stages: string[] }) {
  const visible = stages.slice(0, 2)
  const rest = stages.length - 2
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map(s => (
        <span key={s} className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${STAGE_COLORS[s] ?? 'bg-gray-100 text-gray-600'}`}>{s}</span>
      ))}
      {rest > 0 && <span className="text-xs text-gray-400 self-center">+{rest}</span>}
    </div>
  )
}

function RegionTags({ regions }: { regions: string[] }) {
  const visible = regions.slice(0, 2)
  const rest = regions.length - 2
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map(r => (
        <span key={r} className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">{r}</span>
      ))}
      {rest > 0 && <span className="text-xs text-gray-400 self-center">+{rest}</span>}
    </div>
  )
}

export default function InvestorTable({ investors, loading, onSelect, selectedId }: Props) {
  if (loading) return <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading investors...</div>
  if (investors.length === 0) return <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No investors found. Add one or adjust your filters.</div>

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 w-[260px]">Name</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Investment Stage</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 w-[220px]">Regions</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 w-[180px]">Location</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 w-[150px]">Outreach Status</th>
          </tr>
        </thead>
        <tbody>
          {investors.map(investor => {
            const statusCfg = STATUS_CONFIG[investor.outreach_status]
            return (
              <tr key={investor.id} onClick={() => onSelect(investor)} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedId === investor.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText size={13} className="text-gray-400 shrink-0" /><span className="font-medium text-gray-900 truncate max-w-[210px]">{investor.name}</span></div></td>
                <td className="px-4 py-3"><StageTags stages={investor.investment_stages} /></td>
                <td className="px-4 py-3"><RegionTags regions={investor.regions} /></td>
                <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]">{investor.location ?? '—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.color}`}>{statusCfg.label}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
