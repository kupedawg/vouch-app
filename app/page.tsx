'use client'
import { useState } from 'react'

const profiles = [
  {
    id: 'phil',
    initials: 'PK',
    color: '#C8E6D4',
    textColor: '#1B4332',
    name: 'Phil Kupenga',
    role: 'Founder, Next Chapter Consulting NZ · Wellington',
    bio: 'Nearly 20 years across NZ government and private sector. Founder of Tairāwhiti Tech Talent Incubator. Rangatiratanga Tōtara Award 2023.',
    vouches: 3,
    combinedYears: 47,
    oldestVouch: '2 yrs',
    vouchList: [
      {
        org: 'Tāiki e! Impact House',
        reg: 'CC12847',
        years: 18,
        what: 'Phil moved people from primary industry into tech employment when nobody else was thinking about it. Two participants are still employed by a UK company today.',
        who: 'Rangatahi in Tairāwhiti who had no pathway into the digital economy.',
        date: 'June 2024',
      },
      {
        org: 'Whāngārā Farms Charitable Trust',
        reg: 'CC38219',
        years: 14,
        what: 'Brought genuine thinking about AI governance to our whenua before it was fashionable. His work showed what responsible AI looks like for Māori organisations.',
        who: 'Shareholders and future generations of Whāngārā hapū.',
        date: 'March 2025',
      },
    ],
  },
  {
    id: 'aroha',
    initials: 'AT',
    color: '#FFE4A0',
    textColor: '#7B4F00',
    name: 'Aroha Te Kani',
    role: 'Community Development · Tairāwhiti',
    bio: 'Fifteen years working in community development across Tairāwhiti. Known for building programmes that actually stick.',
    vouches: 2,
    combinedYears: 29,
    oldestVouch: '8 mo',
    vouchList: [
      {
        org: 'Tairāwhiti Community Voice',
        reg: 'CC44102',
        years: 11,
        what: 'Aroha built a youth mentorship programme from nothing. Ran it for three years before any funding came through. Never stopped showing up.',
        who: 'Rangatahi across the rohe who needed someone to believe in them.',
        date: 'October 2025',
      },
    ],
  },
  {
    id: 'james',
    initials: 'JM',
    color: '#D4E4F7',
    textColor: '#1A3A5C',
    name: 'James Māhaki',
    role: 'Social entrepreneur · Auckland',
    bio: 'Profile created June 2026. Awaiting community vouches.',
    vouches: 0,
    combinedYears: 0,
    oldestVouch: '-',
    vouchList: [],
  },
]

export default function Home() {
  const [screen, setScreen] = useState('home')
  const [selected, setSelected] = useState<typeof profiles[0] | null>(null)
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const openProfile = (p: typeof profiles[0]) => {
    setSelected(p)
    setScreen('profile')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-0 md:py-10 px-0 md:px-4">
      <div className="w-full md:max-w-4xl bg-white md:rounded-2xl overflow-hidden md:border md:border-gray-200">

        {screen === 'home' && (
          <>
            <div className="relative overflow-hidden px-6 md:px-12 pt-10 pb-8" style={{ background: 'linear-gradient(135deg, #1B6B3A, #3BB870)' }}>
              <p className="text-xs tracking-widest uppercase text-green-200 mb-3">Community trust protocol · Aotearoa</p>
              <div className="md:flex md:items-end md:justify-between md:gap-12">
                <div className="md:max-w-xl">
                  <h1 className="text-2xl md:text-4xl font-medium text-white leading-tight mb-3">
                    Your community already knows <span className="text-yellow-300">who to trust.</span> Now the world can too.
                  </h1>
                  <p className="text-sm md:text-base text-green-100 mb-6 leading-relaxed">Verified by the organisations that showed up before anyone was watching.</p>
                </div>
                <div className="md:min-w-72">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/20 text-white placeholder-green-200 border-none outline-none"
                      placeholder="Search a person or organisation…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    <button className="bg-yellow-300 text-green-900 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap">Search</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-gray-100">
              {[['847', 'Vouches given'], ['63', 'Verified charities'], ['412', 'Trusted profiles']].map(([num, label]) => (
                <div key={label} className="py-4 text-center border-r border-gray-100 last:border-0">
                  <div className="text-2xl md:text-3xl font-medium text-green-700">{num}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="p-4 md:p-8">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Recently vouched</p>
              <div className="md:grid md:grid-cols-3 md:gap-4">
                {profiles.map(p => (
                  <div key={p.id} onClick={() => openProfile(p)} className="flex md:flex-col items-start gap-3 p-4 rounded-xl border border-gray-100 mb-3 md:mb-0 cursor-pointer hover:border-green-300 transition-all">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0" style={{ background: p.color, color: p.textColor }}>{p.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.role}</div>
                      <div className="mt-2 flex gap-1.5 flex-wrap">
                        {p.vouches > 0 ? (
                          <>
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{p.vouches} vouches</span>
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{p.combinedYears} yrs combined</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No vouches yet</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300 text-lg md:hidden">›</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex gap-3 px-8 pb-8">
              <button onClick={() => setScreen('vouch')} className="bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium">Add a vouch →</button>
              <button className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-medium">Register your charity</button>
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

        {screen === 'profile' && selected && (
          <>
            <button onClick={() => setScreen('home')} className="flex items-center gap-1 text-sm text-gray-500 px-6 pt-5 pb-1">← Back</button>
            <div className="px-6 md:px-12 pb-6 md:flex md:gap-10 md:pt-4">
              <div className="md:min-w-64">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-medium mb-3" style={{ background: selected.color, color: selected.textColor }}>{selected.initials}</div>
                <h2 className="text-xl md:text-2xl font-medium text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{selected.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{selected.bio}</p>
                {selected.vouches > 0 && (
                  <div className="flex md:flex-col gap-2">
                    {[[String(selected.vouches), 'Vouches'], [selected.combinedYears + ' yrs', 'Combined age'], [selected.oldestVouch, 'Oldest vouch']].map(([val, lbl]) => (
                      <div key={lbl} className="flex-1 bg-green-50 border border-green-100 rounded-xl py-2 px-3 text-center">
                        <div className="text-base font-medium text-green-700">{val}</div>
                        <div className="text-xs text-green-500 uppercase tracking-wide mt-0.5">{lbl}</div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setScreen('vouch')} className="hidden md:block w-full mt-4 bg-green-700 text-white py-3 rounded-xl text-sm font-medium text-center">
                  Vouch for {selected.name.split(' ')[0]} →
                </button>
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Community vouches</p>
                {selected.vouches === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-center">
                    <div className="text-3xl mb-2">⏳</div>
                    <p className="text-sm text-yellow-800 leading-relaxed"><strong>Silence is meaningful here.</strong><br />No verified organisations have vouched for this person yet.</p>
                  </div>
                ) : (
                  selected.vouchList.map((v, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 mb-3" style={{ borderLeft: '3px solid #2D9A57' }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{v.org}</div>
                          <div className="text-xs text-gray-400">{v.reg}</div>
                        </div>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{v.years} yrs</span>
                      </div>
                      <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">What did they do?</div>
                      <div className="text-sm text-gray-700 leading-relaxed mb-2">{v.what}</div>
                      <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Who benefited?</div>
                      <div className="text-sm text-gray-700 leading-relaxed mb-2">{v.who}</div>
                      <div className="text-xs text-gray-400">Vouched {v.date} · Active</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="px-6 pb-6 md:hidden">
              <button onClick={() => setScreen('vouch')} className="w-full bg-green-700 text-white py-3 rounded-xl text-sm font-medium">Vouch for {selected.name.split(' ')[0]} →</button>
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

        {screen === 'vouch' && !submitted && (
          <>
            <div className="px-6 md:px-12 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #1B6B3A, #2D9A57)' }}>
              <button onClick={() => setScreen('home')} className="text-green-200 text-sm mb-4 flex items-center gap-1">← Back</button>
              <h2 className="text-xl md:text-3xl font-medium text-white mb-2">Add your vouch</h2>
              <p className="text-sm md:text-base text-green-100 leading-relaxed max-w-xl">Your organisation's reputation backs every word. Be specific. Be honest. This is permanent.</p>
            </div>
            <div className="p-6 md:p-12 md:grid md:grid-cols-2 md:gap-8">
              <div className="space-y-4 mb-4 md:mb-0">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Your charity registration number</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400" placeholder="e.g. CC12847 — we'll verify this" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">You are vouching for</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400" placeholder="Name or organisation…" />
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800 leading-relaxed">
                  <strong>This is an act of honour.</strong> Your charity name stands beside your words — publicly, permanently.
                </div>
              </div>
              <div className="space-y-4">
                {[
                  ['What did this person do for your community?', 'Be specific — what happened, when, and where?', 'They showed up when…'],
                  ['Who specifically benefited?', 'Name the people or groups who were helped.', 'Rangatahi in our rohe who…'],
                  ["Would you stake your organisation's reputation on them?", 'Your charity name sits beside this answer publicly and permanently.', 'Yes, because…'],
                ].map(([q, hint, placeholder]) => (
                  <div key={q}>
                    <div className="text-sm font-medium text-gray-900 mb-1">{q}</div>
                    <div className="text-xs text-gray-400 mb-1.5">{hint}</div>
                    <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 resize-none" rows={2} placeholder={placeholder} />
                  </div>
                ))}
                <button onClick={() => setSubmitted(true)} className="w-full bg-green-700 text-white py-3 rounded-xl text-sm font-medium">Submit vouch</button>
              </div>
            </div>
          </>
        )}

        {screen === 'vouch' && submitted && (
          <div className="p-10 md:p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mx-auto mb-4">🛡️</div>
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-2">Vouch submitted</h2>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">Timestamped. Permanent. A piece of community truth that belongs to everyone.</p>
            <button onClick={() => { setScreen('home'); setSubmitted(false) }} className="bg-green-700 text-white px-8 py-3 rounded-xl text-sm font-medium">Back to browse</button>
          </div>
        )}

      </div>
    </div>
  )
}