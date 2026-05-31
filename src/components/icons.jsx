const monoProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// --- Year progression (fish chain). Filled silhouettes for readability at small sizes. ---

export const YearMinnow = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <ellipse cx="11" cy="12" rx="3" ry="1.6" fill="currentColor" />
    <path d="M14 12 L17 10.5 L17 13.5 Z" fill="currentColor" />
  </svg>
)

export const YearFingerling = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <ellipse cx="10" cy="12.5" rx="4" ry="2" fill="currentColor" />
    <path d="M14 12.5 L18 9.5 L18 15.5 Z" fill="currentColor" />
    <path d="M9.5 10.5 L11 8 L12.5 10.5 Z" fill="currentColor" />
  </svg>
)

export const YearFish = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <ellipse cx="10" cy="12" rx="5" ry="2.7" fill="currentColor" />
    <path d="M15 12 L20 8.5 L20 15.5 Z" fill="currentColor" />
    <path d="M9 9.3 L11 6 L13 9.3 Z" fill="currentColor" />
    <path d="M8 14.7 L10 16.5 L10.5 14.7 Z" fill="currentColor" />
  </svg>
)

export const YearPredator = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M3 12 Q5 9 11 9 Q15 9.2 16 12 Q15 14.8 11 15 Q5 15 3 12 Z"
      fill="currentColor"
    />
    <path d="M16 12 L21 8 L21 16 Z" fill="currentColor" />
    <path d="M9 9 L11 5.5 L13.5 9 Z" fill="currentColor" />
    <path d="M7 14.5 L9 17 L10 14.7 Z" fill="currentColor" />
    <path d="M5 12 L7 13 L7 12 Z" fill="currentColor" />
  </svg>
)

export const YearShark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    {/* streamlined body with pointed snout */}
    <path
      d="M2 13 Q4 10 11 9.5 Q16 9.5 17 12.5 Q16 15 11 15.5 Q4 15.5 2 13 Z"
      fill="currentColor"
    />
    {/* large dorsal */}
    <path d="M9 9.7 L12 4.5 L15 9.7 Z" fill="currentColor" />
    {/* forked tail */}
    <path d="M17 12.5 L22 8 L20 12.5 L22 17 Z" fill="currentColor" />
    {/* pectoral / ventral fin */}
    <path d="M7 14.8 L10 17.5 L11 15 Z" fill="currentColor" />
    {/* gill slits */}
    <path
      d="M5 11.5 L5 13 M6 11.5 L6 13 M7 11.5 L7 13"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
    />
  </svg>
)

// --- Topic / category icons (monoline) ---

export const IconMoney = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <path d="M12 5 V19" />
    <path d="M16 8.5 C16 7 14 6 12 6 C9.5 6 8 7.5 8 9 C8 10.5 9.5 11.5 12 12 C14.5 12.5 16 13.5 16 15 C16 16.5 14 17.5 12 17.5 C10 17.5 8 16.5 8 15" />
  </svg>
)

export const IconChart = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <path d="M5 14 V20 H8 V14 Z" />
    <path d="M10.5 10 V20 H13.5 V10 Z" />
    <path d="M16 6 V20 H19 V6 Z" />
  </svg>
)

export const IconBriefcase = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <rect x="4" y="8" width="16" height="11" rx="1.5" />
    <path d="M9 8 V6.5 Q9 5.5 10 5.5 H14 Q15 5.5 15 6.5 V8" />
    <line x1="4" y1="13" x2="20" y2="13" />
  </svg>
)

export const IconBuilding = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <path d="M4 9 L12 4 L20 9" />
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="6" y1="9" x2="6" y2="19" />
    <line x1="10" y1="9" x2="10" y2="19" />
    <line x1="14" y1="9" x2="14" y2="19" />
    <line x1="18" y1="9" x2="18" y2="19" />
    <line x1="3" y1="19" x2="21" y2="19" />
  </svg>
)

export const IconBook = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <path d="M4 6 L4 18 L12 16 L20 18 L20 6 L12 8 Z" />
    <line x1="12" y1="8" x2="12" y2="16" />
  </svg>
)

export const IconCompass = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 6 L13.7 12 L12 11 L10.3 12 Z" fill="currentColor" />
    <circle cx="12" cy="12" r="1" />
  </svg>
)

// --- Chrome ---

export const IconMentor = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <path d="M12 19 C5 14.5 3.5 10.5 5.5 7.5 Q8 4.5 12 8 Q16 4.5 18.5 7.5 C20.5 10.5 19 14.5 12 19 Z" />
  </svg>
)

export const IconInsights = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4 L12 12 L18.93 9.2 A8 8 0 0 0 12 4 Z" fill="currentColor" stroke="none" />
  </svg>
)

export const IconSpark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...monoProps}>
    <path d="M12 5 V11 M12 13 V19 M5 12 H11 M13 12 H19" />
  </svg>
)

// --- Wordmark glyph: lowercase 'i' redrawn as a tiny graduate ---

export const GradStudentI = ({ className = '' }) => (
  <svg
    viewBox="0 0 14 40"
    className={className}
    style={{ height: '1em', display: 'inline-block', verticalAlign: 'baseline' }}
    aria-hidden="true"
  >
    {/* mortarboard plate (the dot) */}
    <rect x="1" y="4" width="12" height="2" rx="0.3" fill="currentColor" />
    {/* cap band */}
    <rect x="4" y="6" width="6" height="2" fill="currentColor" />
    {/* tassel string */}
    <path
      d="M11 7 Q13 9 12.5 12"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
      strokeLinecap="round"
    />
    {/* tassel tip */}
    <circle cx="12.5" cy="12.5" r="0.8" fill="currentColor" />
    {/* gown body — narrow neck, A-line hem extending to baseline */}
    <path d="M5 14 L9 14 L12 40 L2 40 Z" fill="currentColor" />
  </svg>
)
