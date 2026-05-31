import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentProfile } from '../lib/studentProfile'
import { useSkyStage } from '../lib/skyStage'
import {
  IconMoney, IconChart, IconBriefcase, IconBook, IconBuilding, IconCompass, IconInsights, IconSpark,
} from '../components/icons'

const QUICK_LINKS = [
  {
    Icon: IconMoney,
    label: 'FAFSA & Financial Aid',
    links: [
      { label: 'Apply for FAFSA', url: 'https://studentaid.gov/h/apply-for-aid/fafsa', desc: 'Official federal student aid application' },
      { label: 'Understand Your Aid Letter', url: 'https://studentaid.gov/understand-aid/types', desc: 'What grants, loans & work-study mean' },
      { label: 'Appeal Financial Aid (UO)', url: 'https://financialaid.uoregon.edu/appeal', desc: 'University of Oregon aid appeal process' },
    ]
  },
  {
    Icon: IconSpark,
    label: 'Scholarships',
    links: [
      { label: 'Fastweb', url: 'https://www.fastweb.com', desc: 'Largest free scholarship search' },
      { label: 'Scholarships.com', url: 'https://www.scholarships.com', desc: 'Match to thousands of scholarships' },
      { label: 'UO Scholarship Universe', url: 'https://uoregon.scholarshipuniverse.com', desc: 'UO-specific scholarship portal' },
      { label: 'Bold.org', url: 'https://bold.org/scholarships', desc: 'Scholarships for first-gen students' },
    ]
  },
  {
    Icon: IconChart,
    label: 'Financial Literacy',
    links: [
      { label: 'Consumer Finance (CFPB)', url: 'https://www.consumerfinance.gov/consumer-tools/student-loans/', desc: 'Free financial education tools' },
      { label: 'Student Loan Simulator', url: 'https://studentaid.gov/loan-simulator/', desc: 'See your repayment options' },
      { label: 'NerdWallet Budgeting', url: 'https://www.nerdwallet.com/article/finance/budgeting-for-college-students', desc: 'Budgeting basics for college students' },
    ]
  },
  {
    Icon: IconBriefcase,
    label: 'Career Development',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com', desc: 'Build your professional profile' },
      { label: 'Handshake', url: 'https://joinhandshake.com', desc: 'Find internships & entry-level jobs' },
      { label: 'Resume Worded', url: 'https://resumeworded.com', desc: 'Free AI resume feedback' },
    ]
  },
]

const CATEGORY_ICONS = {
  'FAFSA & Financial Aid': IconMoney,
  'Student Debt': IconChart,
  'Career': IconBriefcase,
  'Hidden Curriculum': IconBook,
  'Campus Resources': IconBuilding,
  'General': IconCompass,
}

const YEAR_COLORS = {
  'Incoming Freshman': 'bg-emerald-400',
  'Freshman': 'bg-blue-400',
  'Sophomore': 'bg-violet-400',
  'Junior': 'bg-amber-400',
  'Senior': 'bg-brand-400',
}

function generateNarrative(categoryData, yearData) {
  if (!categoryData.length) return null
  const topCategory = categoryData[0]
  const topYear = [...yearData].sort((a, b) => Number(b.COUNT) - Number(a.COUNT))[0]

  const categoryPhrases = {
    'FAFSA & Financial Aid': 'navigating financial aid',
    'Student Debt': 'understanding student loans',
    'Career': 'figuring out their career path',
    'Hidden Curriculum': 'learning the unspoken rules of college',
    'Campus Resources': 'finding support on campus',
    'General': 'finding their footing in college',
  }
  const yearPhrases = {
    'Incoming Freshman': 'incoming freshmen',
    'Freshman': 'first-year students',
    'Sophomore': 'sophomores',
    'Junior': 'juniors',
    'Senior': 'seniors',
  }

  const topic = categoryPhrases[topCategory.CATEGORY] || 'getting guidance'
  const year = topYear ? (yearPhrases[topYear.YEAR] || 'students') : 'students'
  return `Right now, first-gen students are most focused on ${topic} — and ${year} are asking the most questions. This is exactly what the hidden curriculum looks like: real questions that nobody taught them to ask.`
}

export default function Insights() {
  const navigate = useNavigate()
  const { setStage } = useSkyStage()
  const college = StudentProfile.getCollege()
  const [categoryData, setCategoryData] = useState([])
  const [yearData, setYearData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openSection, setOpenSection] = useState(null)
  const [campusLinks, setCampusLinks] = useState(null)
  const [campusLoading, setCampusLoading] = useState(true)

  useEffect(() => {
    setStage('insights')
  }, [])

  useEffect(() => {
    fetch('/api/insights')
      .then(r => r.json())
      .then(categories => {
        setCategoryData(categories)
        setTotal(categories.reduce((sum, r) => sum + Number(r.COUNT), 0))
      })
      .catch(err => setError(err.message))

    fetch('/api/insights/years')
      .then(r => r.json())
      .then(years => setYearData(years))
      .catch(err => console.error('Years fetch failed:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch(`/api/campus-resources?college=${encodeURIComponent(college)}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load campus resources')
        return r.json()
      })
      .then(links => setCampusLinks(Array.isArray(links) ? links : null))
      .catch(() => setCampusLinks(null))
      .finally(() => setCampusLoading(false))
  }, [])

  const maxCount = categoryData.length > 0 ? Math.max(...categoryData.map(r => Number(r.COUNT))) : 1
  const narrative = generateNarrative(categoryData, yearData)

  const quickLinks = [
    ...QUICK_LINKS.slice(0, 3),
    { Icon: IconBuilding, label: `${college} Resources`, links: campusLinks || [], campus: true },
    ...QUICK_LINKS.slice(3),
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="insights-boot-header bg-cream border-b border-beige-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/chat')}
          className="text-beige-400 hover:text-maroon-700 text-xl p-1 rounded-lg hover:bg-beige-50 transition-colors"
        >
          ←
        </button>
        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-400">
          <IconInsights className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-serif text-3xl font-semibold text-maroon-900">Community Insights</p>
          <p className="text-xs text-beige-400">Resources & what first-gen students are asking</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 max-w-lg mx-auto w-full flex flex-col gap-5">

        {/* Quick Links Section */}
        <div className="insights-boot-quick bg-cream border border-beige-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-maroon-900 mb-1">Quick Resources</h2>
          <p className="text-xs text-beige-400 mb-5">Everything you need, in one place — including resources specific to your school.</p>

          <div className="flex flex-col gap-3">
            {quickLinks.map(({ Icon, label, links, campus }) => (
              <div key={label} className="border border-beige-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === label ? null : label)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-beige-50 hover:bg-brand-50 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-maroon-800 flex items-center gap-2">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </span>
                  <span className="text-beige-400 text-xs">{openSection === label ? '▲' : '▼'}</span>
                </button>

                {openSection === label && (
                  <div className="flex flex-col divide-y divide-beige-100">
                    {campus && campusLoading && (
                      <p className="px-4 py-3 text-sm text-beige-400">Finding your school's resources...</p>
                    )}
                    {campus && !campusLoading && campusLinks === null && (
                      <p className="px-4 py-3 text-sm text-beige-400">We couldn't find resources for your school. Ask your mentor for help.</p>
                    )}
                    {links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between px-4 py-3 hover:bg-brand-50 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-brand-400 group-hover:text-brand-600">{link.label}</p>
                          <p className="text-xs text-beige-400 mt-0.5">{link.desc}</p>
                        </div>
                        <span className="text-brand-400 text-sm ml-3 flex-shrink-0 mt-0.5">→</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total count */}
        <div className="insights-boot-total bg-cream border border-beige-200 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-5xl font-serif font-semibold text-brand-400">
            {loading ? '—' : total}
          </p>
          <p className="text-sm text-maroon-600 mt-1">Questions answered for first-gen students</p>
        </div>

        {/* Narrative insight */}
        {!loading && !error && narrative && (
          <div className="insights-boot-narr bg-brand-50 border border-brand-100 rounded-2xl p-5">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-2">What the data says</p>
            <p className="text-sm text-maroon-700 leading-relaxed">{narrative}</p>
          </div>
        )}

        {/* Category breakdown */}
        <div className="insights-boot-category bg-cream border border-beige-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-maroon-900 mb-5">Most Common Topics</h2>

          {loading && <p className="text-sm text-beige-400 text-center py-4">Loading...</p>}
          {error && <p className="text-sm text-red-400 text-center py-4">Could not load data.</p>}

          {!loading && !error && categoryData.length === 0 && (
            <p className="text-sm text-beige-400 text-center py-4">No questions yet — start chatting!</p>
          )}

          {!loading && !error && categoryData.length > 0 && (
            <div className="flex flex-col gap-4">
              {categoryData.map((row) => {
                const count = Number(row.COUNT)
                const pct = Math.round((count / maxCount) * 100)
                const Icon = CATEGORY_ICONS[row.CATEGORY] || IconCompass
                return (
                  <div key={row.CATEGORY}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-maroon-700 font-medium flex items-center gap-2">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {row.CATEGORY}
                      </span>
                      <span className="text-sm text-brand-400 font-semibold">{count}</span>
                    </div>
                    <div className="h-2 bg-brand-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Year breakdown */}
        <div className="insights-boot-year bg-cream border border-beige-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-maroon-900 mb-5">Who's Asking</h2>

          {loading && <p className="text-sm text-beige-400 text-center py-4">Loading...</p>}

          {!loading && yearData.length === 0 && (
            <p className="text-sm text-beige-400 text-center py-4">No data yet.</p>
          )}

          {!loading && yearData.length > 0 && (
            <div className="flex flex-col gap-3">
              {yearData.map((row) => {
                const count = Number(row.COUNT)
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                const colorClass = YEAR_COLORS[row.YEAR] || 'bg-beige-400'
                return (
                  <div key={row.YEAR} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colorClass}`} />
                    <span className="text-sm text-maroon-700 flex-1">{row.YEAR}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-beige-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-beige-400 w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="insights-boot-footer text-xs text-beige-400 text-center pb-4">
          All data is anonymized. No personal information is stored.
        </p>
      </div>
    </div>
  )
}
