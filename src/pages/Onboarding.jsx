import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentProfile } from '../lib/studentProfile'
import {
  YearMinnow, YearFingerling, YearFish, YearPredator, YearShark,
  IconMoney, IconChart, IconBriefcase, IconBuilding, IconBook, IconCompass,
} from '../components/icons'

const YEARS = [
  { Icon: YearMinnow,     label: 'Incoming Freshman', value: 'Incoming Freshman' },
  { Icon: YearFingerling, label: 'Freshman',          value: 'Freshman' },
  { Icon: YearFish,       label: 'Sophomore',         value: 'Sophomore' },
  { Icon: YearPredator,   label: 'Junior',            value: 'Junior' },
  { Icon: YearShark,      label: 'Senior',            value: 'Senior' },
]

const TOPICS = [
  { Icon: IconMoney,     label: 'FAFSA & Financial Aid', value: 'FAFSA & financial aid' },
  { Icon: IconChart,     label: 'Student Debt',          value: 'student debt & loans' },
  { Icon: IconBriefcase, label: 'Career & Internships',  value: 'career & internships' },
  { Icon: IconBuilding,  label: 'Campus Resources',      value: 'campus resources' },
  { Icon: IconBook,      label: 'Hidden Curriculum',     value: 'academic tips & unspoken college rules' },
  { Icon: IconCompass,   label: 'Not Sure Yet',          value: 'general guidance' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [phase, setPhase] = useState('out')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [college, setCollege] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setPhase('in'), 20)
    return () => clearTimeout(t)
  }, [])

  function transitionToStep(next) {
    setPhase('out')
    setTimeout(() => {
      setStep(next)
      setPhase('in')
    }, 220)
  }

  function toggleTopic(value) {
    setSelectedTopics(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    )
  }

  function handleNext() {
    if (step === 1 && selectedYear) transitionToStep(2)
  }

  function handleStart() {
    setPhase('out')
    setTimeout(() => {
      StudentProfile.save(selectedYear, selectedTopics, college)
      navigate('/chat')
    }, 240)
  }

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center px-4 py-12">
      <div className="bg-cream rounded-2xl border border-beige-200 p-10 w-full max-w-md shadow-sm">

        {/* Step dots */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-brand-400' : 'bg-beige-200'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-brand-400' : 'bg-beige-200'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-brand-400' : 'bg-beige-200'}`} />
        </div>

        <div
          className={`transition-all duration-[240ms] ease-out ${
            phase === 'in'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-1'
          }`}
        >
        {step === 1 && (
          <>
            <h2 className="font-serif text-2xl font-semibold text-maroon-900 mb-1">What year are you in?</h2>
            <p className="text-sm text-beige-400 mb-6">This helps me give you the right advice at the right time.</p>
            <div className="flex flex-col gap-3">
              {YEARS.map(({ Icon, label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedYear(value)}
                  className={`text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    selectedYear === value
                      ? 'border-brand-400 bg-brand-50 text-brand-600'
                      : 'border-beige-200 bg-beige-50 text-maroon-700 hover:border-brand-400 hover:bg-brand-50'
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                disabled={!selectedYear}
                className="bg-brand-400 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-cream font-medium px-6 py-3 rounded-full text-sm transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-serif text-2xl font-semibold text-maroon-900 mb-1">What's on your mind most?</h2>
            <p className="text-sm text-beige-400 mb-6">Pick everything that applies — I'll keep all of it in mind.</p>
            <div className="grid grid-cols-2 gap-3">
              {TOPICS.map(({ Icon, label, value }) => (
                <button
                  key={value}
                  onClick={() => toggleTopic(value)}
                  className={`text-left px-3 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedTopics.includes(value)
                      ? 'border-brand-400 bg-brand-50 text-brand-600'
                      : 'border-beige-200 bg-beige-50 text-maroon-700 hover:border-brand-400 hover:bg-brand-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => transitionToStep(3)}
                className="bg-brand-400 hover:bg-brand-600 text-cream font-medium px-6 py-3 rounded-full text-sm transition-colors"
              >
                Let's go →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-serif text-2xl font-semibold text-maroon-900 mb-1">What college do you attend?</h2>
            <p className="text-sm text-beige-400 mb-6">This helps me give you real resources specific to your school.</p>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full border border-beige-200 bg-beige-50 text-maroon-700 focus:border-brand-400 outline-none rounded-xl px-4 py-3.5 text-sm"
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={handleStart}
                className="bg-brand-400 hover:bg-brand-600 text-cream font-medium px-6 py-3 rounded-full text-sm transition-colors"
              >
                Let's go →
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  )
}
