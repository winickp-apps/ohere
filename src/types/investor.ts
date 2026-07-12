export type OutreachStatus =
  | 'not_contacted'
  | 'contacted'
  | 'replied'
  | 'meeting_scheduled'
  | 'in_discussion'
  | 'passed'
  | 'invested'

export interface Investor {
  id: string
  name: string
  crunchbase_url: string | null
  website: string | null
  linkedin_url: string | null
  facebook_url: string | null
  investment_stages: string[]
  regions: string[]
  location: string | null
  description: string | null
  full_description: string | null
  number_of_investments: number | null
  number_of_exits: number | null
  number_of_portfolio_organizations: number | null
  number_of_lead_investments: number | null
  contact_email: string | null
  phone_number: string | null
  contact_person_name: string | null
  contact_person_title: string | null
  outreach_status: OutreachStatus
  relevance_score: number | null
  notes: string | null
  first_contact_date: string | null
  last_contact_date: string | null
  created_at: string
  updated_at: string
}
