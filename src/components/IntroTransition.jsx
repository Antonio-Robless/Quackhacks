import { useEffect, useState } from 'react'

export default function IntroTransition({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (mql?.matches) {
      setReducedMotion(true)
      onComplete()
      return
    }

    const fadeT = setTimeout(() => setFadingOut(true), 5400)
    const doneT = setTimeout(() => onComplete(), 6000)

    const onKey = (e) => {
      if (e.key === 'Escape') onComplete()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      clearTimeout(fadeT)
      clearTimeout(doneT)
      window.removeEventListener('keydown', onKey)
    }
  }, [onComplete])

  if (reducedMotion) return null

  const limbOrigin = (x, y) => ({
    transformOrigin: `${x}px ${y}px`,
    transformBox: 'view-box',
  })

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-[600ms] ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="presentation"
    >
      <div className="absolute inset-0 intro-sky-cool" />
      <div className="absolute inset-0 intro-sky-warm" />

      <div className="absolute intro-glow" />
      <div className="absolute inset-x-0 intro-path" />

      <div className="absolute intro-figure-wrap">
        <div className="intro-figure-grow">
          <svg
            className="intro-figure-bob"
            width="64"
            height="120"
            viewBox="0 0 60 110"
            aria-hidden="true"
          >
            {/* head */}
            <circle cx="30" cy="12" r="9" fill="currentColor" />

            {/* torso */}
            <path
              d="M22 22 Q30 20 38 22 L36 58 Q30 60 24 58 Z"
              fill="currentColor"
            />

            {/* graduation gown — over torso, under arms */}
            <g className="grad-gown">
              {/* main robe body */}
              <path
                d="M19 22 L41 22 L48 78 L12 78 Z"
                fill="#4A1B0C"
              />
              {/* stub sleeves at shoulders */}
              <path d="M19 22 L15 32 L22 32 L24 23 Z" fill="#4A1B0C" />
              <path d="M41 22 L45 32 L38 32 L36 23 Z" fill="#4A1B0C" />
              {/* v-collar trim */}
              <path
                d="M23 22 L30 33 L37 22"
                stroke="#C4623A"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* arms — render over gown, swing freely */}
            <g className="limb arm-back" style={limbOrigin(23, 25)}>
              <path
                d="M23 25 L22 56"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
            <g className="limb arm-front" style={limbOrigin(37, 25)}>
              <path
                d="M37 25 L38 56"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* legs — render over gown hem, swing at hip */}
            <g className="limb leg-back" style={limbOrigin(27, 58)}>
              <path
                d="M27 58 L26 102"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </g>
            <g className="limb leg-front" style={limbOrigin(33, 58)}>
              <path
                d="M33 58 L34 102"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* graduation cap — drops in from above, renders last so it sits on top */}
            <g className="grad-cap">
              {/* mortarboard plate */}
              <rect x="12" y="2" width="36" height="3.5" rx="0.5" fill="#4A1B0C" />
              {/* band */}
              <rect x="20" y="5.5" width="20" height="3" fill="#4A1B0C" />
              {/* button */}
              <circle cx="30" cy="3.75" r="0.9" fill="#C4623A" />
              {/* tassel string */}
              <path
                d="M30 4 Q43 8 44 16"
                stroke="#C4623A"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
              />
              {/* tassel tip */}
              <circle cx="44" cy="17" r="1.6" fill="#C4623A" />
            </g>
          </svg>
        </div>
      </div>

      <h2 className="intro-tagline font-serif">Breaking a Cycle</h2>

      <button
        onClick={onComplete}
        className="absolute top-5 right-6 text-sm text-cream/70 hover:text-cream transition-colors px-3 py-1.5 rounded-full"
      >
        Skip →
      </button>
    </div>
  )
}
