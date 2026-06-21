'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, Vouch } from '@/lib/types'

export default function Home() {
  const [screen, setScreen] = useState('home')
  const [selected, setSelected] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [allVouches, setAllVouches] = useState<Vouch[]>([])
  const [profileVouches, setProfileVouches] = useState<Vouch[]>([])
  const [totalCharities, setTotalCharities] = useState(0)
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formCharity, setFormCharity] = useState('')
  const [formName, setFormName] = useState('')
  const [formWhat, setFormWhat] = useState('')
  const [formWho, setFormWho] = useState('')
  const [formStake, setFormStake] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const { data: profileData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    const { data: vouchData } = await supabase.from('vouches').select('*, charities(*)').eq('active', true)
    const { count: charityCount } = await supabase.from('charities').select('*', { count: 'exact', head: true }).eq('verified', true)
    if (profileData) setProfiles(profileData)
    if (vouchData) setAllVouches(vouchData)
    if (charityCount) setTotalCharities(charityCount)
    setLoading(false)
  }

  async function openProfile(p: Profile) {
    setSelected(p)
    setScreen('profile')
    const { data } = await supabase.from('vouches').select('*, charities(*)').eq('profile_id', p.id).eq('active', true)
    if (data) setProfileVouches(data)
  }

  function getVouchCount(profileId: string) {
    return allVouches.filter(v => v.profile_id === profileId).length
  }

  async function submitVouch() {
    setFormError('')
    if (!formCharity || !formName || !formWhat || !formWho || !formStake) {
      setFormError('Please fill in all fields.')
      return
    }
    setFormLoading(true)
    const { data: charity } = await supabase.from('charities').select('*').eq('registration_number', formCharity.toUpperCase()).eq('verified', true).single()
    if (!charity) {
      setFormError('Charity registration number not found or not yet verified.')
      setFormLoading(false)
      return
    }
    let profile = profiles.find(p => p.name.toLowerCase() === formName.toLowerCase())
    if (!profile) {
      const initials = formName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
      const colors = [{ color: '#C8E6D4', text_color: '#1B4332' }, { color: '#FFE4A0', text_color: '#7B4F00' }, { color: '#D4E4F7', text_color: '#1A3A5C' }]
      const picked = colors[Math.floor(Math.random() * colors.length)]
      const { data: newProfile } = await supabase.from('profiles').insert({ name: formName, initials, color: picked.color, text_color: picked.text_color }).select().single()
      if (newProfile) profile = newProfile
    }
    if (!profile) { setFormError('Something went wrong.'); setFormLoading(false); return }
    await supabase.from('vouches').insert({ charity_id: charity.id, profile_id: profile.id, what_they_did: formWhat, who_benefited: formWho, stake_reputation: formStake })
    setFormLoading(false)
    setSubmitted(true)
    loadData()
  }

  const filteredProfiles = profiles.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-0 md:py-10 px-0 md:px-4">
      <div className="w-full md:max-w-5xl bg-white md:rounded-2xl overflow-hidden md:border md:border-gray-200">

        {/* HOME */}
        {screen === 'home' && (
          <>
            <div className="px-6 md:px-12 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1B6B3A, #3BB870)' }}>
              <p className="text-xs tracking-widest uppercase text-green-200 mb-3">Community trust protocol · Aotearoa</p>
              <h1 className="text-2xl md:text-5xl font-medium text-white leading-tight mb-3 md:max-w-2xl">
                Your community already knows <span className="text-yellow-300">who to trust.</span> Now the world can too.
              </h1>
              <p className="text-sm md:text-base text-green-100 mb-6 leading-relaxed md:max-w-xl">Verified by the organisations that showed up before anyone was watching.</p>
              <div className="flex gap-2 max-w-lg">
                <input
                  className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/20 text-white placeholder-green-200 border-none outline-none min-w-0"
                  placeholder="Search a person or organisation…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="bg-yellow-300 text-green-900 px-6 py-3 rounded-xl font-medium text-sm flex-shrink-0">Search</button>
              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-100">
              {[
                [String(allVouches.length), 'Vouches given'],
                [String(totalCharities), 'Verified charities'],
                [String(profiles.length), 'Trusted profiles']
              ].map(([num, label]) => (
                <div key={label} className="py-4 text-center border-r border-gray-100 last:border-0">
                  <div className="text-2xl md:text-3xl font-medium text-green-700">{num}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="p-4 md:p-8">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">{search ? 'Search results' : 'Recently vouched'}</p>
              {loading ? (
                <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No profiles found yet.</div>
              ) : (
                <div className="md:grid md:grid-cols-3 md:gap-4">
                  {filteredProfiles.map(p => {
                    const count = getVouchCount(p.id)
                    return (
                      <div key={p.id} onClick={() => openProfile(p)} className="flex md:flex-col items-start gap-3 p-4 rounded-xl border border-gray-100 mb-3 md:mb-0 cursor-pointer hover:border-green-300 hover:shadow-sm transition-all">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0" style={{ background: p.color, color: p.text_color }}>{p.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.role}</div>
                          <div className="mt-2">
                            {count > 0 ? (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{count} {count === 1 ? 'vouch' : 'vouches'}</span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No vouches yet</span>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-300 text-lg md:hidden">›</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="hidden md:flex gap-3 px-8 pb-8">
              <button onClick={() => setScreen('vouch')} className="bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium">Add a vouch →</button>
              <button className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50">Register your charity</button>
            </div>

            <div className="flex border-t border-gray-100 md:hidden">
              {[['🏠', 'Browse'], ['🛡️', 'Vouch'], ['🏢', 'Charities']].map(([icon, label]) => (
                <button key={label} onClick={() => label === 'Vouch' && setScreen('vouch')} className={`flex-1 py-3 text-center text-xs ${label === 'Browse' ? 'text-green-700' : 'text-gray-400'}`}>
                  <div className="text-lg">{icon}</div>{label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* PROFILE */}
        {screen === 'profile' && selected && (
          <>
            <button onClick={() => { setScreen('home'); setProfileVouches([]) }} className="flex items-center gap-1 text-sm text-gray-500 px-6 pt-5 pb-3 hover:text-gray-800">← Back</button>

            <div className="px-6 md:px-12 pb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium flex-shrink-0" style={{ background: selected.color, color: selected.text_color }}>{selected.initials}</div>
                <div>
                  <h2 className="text-xl md:text-2xl font-medium text-gray-900">{selected.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selected.role}</p>
                  {selected.bio && <p className="text-sm text-gray-500 leading-relaxed mt-2">{selected.bio}</p>}
                </div>
              </div>

              {profileVouches.length > 0 && (
                <div className="flex gap-3 mb-6">
                  <div className="bg-green-50 border border-green-100 rounded-xl py-3 px-4 text-center flex-1">
                    <div className="text-lg font-medium text-green-700">{profileVouches.length}</div>
                    <div className="text-xs text-green-500 uppercase tracking-wide mt-0.5">{profileVouches.length === 1 ? 'Vouch' : 'Vouches'}</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl py-3 px-4 text-center flex-1">
                    <div className="text-lg font-medium text-green-700">{profileVouches.reduce((a, v) => a + (v.charities?.years_registered || 0), 0)} yrs</div>
                    <div className="text-xs text-green-500 uppercase tracking-wide mt-0.5">Combined charity age</div>
                  </div>
                </div>
              )}

              <div className="md:hidden mb-4">
                <button onClick={() => setScreen('vouch')} className="w-full bg-green-700 text-white py-3 rounded-xl text-sm font-medium">Vouch for {selected.name.split(' ')[0]} →</button>
              </div>

              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Community vouches</p>

              {profileVouches.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">⏳</div>
                  <p className="text-sm text-yellow-800 leading-relaxed"><strong>Silence is meaningful here.</strong><br />No verified organisations have vouched for this person yet. A vouch cannot be bought — only earned.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profileVouches.map((v) => (
                    <div key={v.id} className="border border-gray-100 rounded-xl p-5" style={{ borderLeft: '3px solid #2D9A57' }}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{v.charities?.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{v.charities?.registration_number}</div>
                        </div>
                        {v.charities?.years_registered && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex-shrink-0 ml-3">{v.charities.years_registered} yrs registered</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">What did they do?</div>
                          <div className="text-sm text-gray-700 leading-relaxed">{v.what_they_did}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Who benefited?</div>
                          <div className="text-sm text-gray-700 leading-relaxed">{v.who_benefited}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Staking their reputation</div>
                          <div className="text-sm text-gray-700 leading-relaxed">{v.stake_reputation}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">{new Date(v.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })} · Active</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="hidden md:block mt-6">
                <button onClick={() => setScreen('vouch')} className="bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium">Vouch for {selected.name.split(' ')[0]} →</button>
              </div>
            </div>

            <div className="flex border-t border-gray-100 md:hidden">
              {[['🏠', 'Browse'], ['🛡️', 'Vouch'], ['🏢', 'Charities']].map(([icon, label]) => (
                <button key={label} onClick={() => label === 'Browse' ? setScreen('home') : label === 'Vouch' && setScreen('vouch')} className="flex-1 py-3 text-center text-xs text-gray-400">
                  <div className="text-lg">{icon}</div>{label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* VOUCH FORM */}
        {screen === 'vouch' && !submitted && (
          <>
            <div className="px-6 md:px-12 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #1B6B3A, #2D9A57)' }}>
              <button onClick={() => setScreen('home')} className="text-green-200 text-sm mb-4 flex items-center gap-1">← Back</button>
              <h2 className="text-xl md:text-3xl font-medium text-white mb-2">Add your vouch</h2>
              <p className="text-sm md:text-base text-green-100 leading-relaxed max-w-xl">Your organisation's reputation backs every word. Be specific. Be honest. This is permanent.</p>
            </div>
            <div className="p-6 md:p-12 md:grid md:grid-cols-2 md:gap-10">
              <div className="space-y-4 mb-6 md:mb-0">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">Your charity registration number</label>
                  <input value={formCharity} onChange={e => setFormCharity(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100" placeholder="e.g. CC12847" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block font-medium">You are vouching for</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100" placeholder="Full name or organisation name…" />
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800 leading-relaxed">
                  <strong>This is an act of honour.</strong> Your charity name and registration number stand beside your words — publicly and permanently. Only vouch for someone you would stand beside in person.
                </div>
                {formError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">{formError}</div>
                )}
              </div>
              <div className="space-y-5">
                {[
                  ['What did this person do for your community?', 'Be specific — what happened, when, and where?', 'They showed up when…', formWhat, setFormWhat],
                  ['Who specifically benefited?', 'Name the people or groups who were helped.', 'Rangatahi in our rohe who…', formWho, setFormWho],
                  ["Would you stake your organisation's reputation on them?", 'Your charity name sits beside this answer publicly and permanently.', 'Yes, because…', formStake, setFormStake],
                ].map(([q, hint, placeholder, val, setter]) => (
                  <div key={q as string}>
                    <div className="text-sm font-medium text-gray-900 mb-1">{q as string}</div>
                    <div className="text-xs text-gray-400 mb-2">{hint as string}</div>
                    <textarea value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 resize-none leading-relaxed" rows={3} placeholder={placeholder as string} />
                  </div>
                ))}
                <button onClick={submitVouch} disabled={formLoading} className="w-full bg-green-700 text-white py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-green-800 transition-colors">
                  {formLoading ? 'Submitting…' : 'Submit vouch'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* CONFIRM */}
        {screen === 'vouch' && submitted && (
          <div className="p-10 md:p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mx-auto mb-4">🛡️</div>
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-2">Vouch submitted</h2>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">Timestamped. Permanent. A piece of community truth that belongs to everyone.</p>
            <button onClick={() => { setScreen('home'); setSubmitted(false); setFormCharity(''); setFormName(''); setFormWhat(''); setFormWho(''); setFormStake('') }} className="bg-green-700 text-white px-8 py-3 rounded-xl text-sm font-medium">Back to browse</button>
          </div>
        )}

      </div>
    </div>
  )
}