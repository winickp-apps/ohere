import type { OutreachStatus } from '@/types/investor'

export const STAGE_COLORS: Record<string, string> = {
  'Early Stage Venture': 'bg-orange-100 text-orange-700',
  'Late Stage Venture': 'bg-blue-100 text-blue-700',
  'Seed': 'bg-green-100 text-green-700',
  'Private Equity': 'bg-purple-100 text-purple-700',
  'Convertible Note': 'bg-teal-100 text-teal-700',
  'Debt': 'bg-rose-100 text-rose-700',
  'Grant': 'bg-emerald-100 text-emerald-700',
  'Secondary Market': 'bg-slate-100 text-slate-600',
  'Venture': 'bg-indigo-100 text-indigo-700',
  'Post-Ipo': 'bg-violet-100 text-violet-700',
}

export const STATUS_CONFIG: Record<OutreachStatus, { label: string; color: string }> = {
  not_contacted: { label: 'Not Contacted', color: 'bg-gray-100 text-gray-600' },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  replied: { label: 'Replied', color: 'bg-amber-100 text-amber-700' },
  meeting_scheduled: { label: 'Meeting Scheduled', color: 'bg-orange-100 text-orange-700' },
  in_discussion: { label: 'In Discussion', color: 'bg-purple-100 text-purple-700' },
  passed: { label: 'Passed', color: 'bg-red-100 text-red-600' },
  invested: { label: 'Invested', color: 'bg-green-100 text-green-700' },
}

export const STAGE_OPTIONS = Object.keys(STAGE_COLORS)
