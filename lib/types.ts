export type Charity = {
  id: string
  registration_number: string
  name: string
  verified: boolean
  registered_since: string
  years_registered: number
  created_at: string
}

export type Profile = {
  id: string
  name: string
  role: string
  bio: string
  initials: string
  color: string
  text_color: string
  created_at: string
}

export type Vouch = {
  id: string
  charity_id: string
  profile_id: string
  what_they_did: string
  who_benefited: string
  stake_reputation: string
  active: boolean
  created_at: string
  charities?: Charity
}