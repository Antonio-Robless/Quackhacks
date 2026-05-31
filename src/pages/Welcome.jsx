import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IntroTransition from '../components/IntroTransition'
import { useSkyStage } from '../lib/skyStage'
import { GradStudentI } from '../components/icons'

export default function Welcome() {
  const navigate = useNavigate()
  const { setStage } = useSkyStage()
  const [showIntro, setShowIntro] = useState(
    () => typeof window !== 'undefined' && !sessionStorage.getItem('fil_intro_seen')
  )
  const [phase, setPhase] = useState('out')

  useEffect(() => {
    setStage('sunrise')
    const t = setTimeout(() => setPhase('in'), 20)
    return () => clearTimeout(t)
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem('fil_intro_seen', '1')
    setShowIntro(false)
  }

  const handleStart = () => {
    setPhase('out')
    setTimeout(() => navigate('/onboarding'), 240)
  }

  return (
    <>
      {showIntro && <IntroTransition onComplete={handleIntroComplete} />}
      <div className="min-h-screen flex flex-col">
        <div
          className={`flex-1 flex flex-col transition-all duration-[240ms] ease-out ${
            phase === 'in'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-1'
          }`}
        >
          {/* Nav */}
          <nav className="px-8 py-5 flex items-center">
            <span className="font-serif text-4xl font-semibold text-maroon-900">
              F<GradStudentI />rstInL<GradStudentI />ne
            </span>
          </nav>

          {/* Hero */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-6">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-maroon-900 leading-tight max-w-xl">
              The personal mentor you never had.
            </h1>
            <p className="text-maroon-700 text-base leading-relaxed max-w-sm">
              Built for first-gen students, like you, by a first-gen student. No prior knowldege required — just you, your goals, and a guide that actually gets it.
            </p>
            <button
              onClick={handleStart}
              className="bg-brand-400 hover:bg-brand-600 text-cream font-medium text-base px-8 py-3.5 rounded-full transition-colors flex items-center gap-2"
            >
              Let's grow together <span>→</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-beige-400 pb-6">
            Free to use · No account required
          </p>
        </div>
      </div>
    </>
  )
}
