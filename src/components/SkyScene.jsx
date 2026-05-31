// Animated time-of-day background: sunrise → midday → sunset → night.
// Gradient layers crossfade by opacity (CSS can't tween gradients directly).
// The sun and moon are always rendered and fully opaque — they SLIDE between
// positions: the sun arcs across and sets below the horizon while the moon
// rises up from below into the night sky. Off-screen bodies are clipped by the
// container's overflow-hidden.

import { useEffect, useState } from 'react'

const SKY_GRADIENTS = {
  sunrise: 'linear-gradient(to bottom, #8A7E96 0%, #D49A78 50%, #EAD3B0 100%)',
  midday:  'linear-gradient(to bottom, #DCEBF5 0%, #FCEFD9 60%, #F5EFE3 100%)',
  sunset:  'linear-gradient(to bottom, #F8B07A 0%, #E07856 50%, #7A2E2E 100%)',
  night:   'linear-gradient(to bottom, #241640 0%, #3D1212 60%, #160A12 100%)',
  chat:    'linear-gradient(to bottom, #F4C99A 0%, #E8A878 50%, #EAD3B0 100%)',
  insights: 'linear-gradient(to bottom, #F7C39A 0%, #F0976B 45%, #E9BE94 100%)',
}

// Below the horizon — parked off-screen, clipped by overflow-hidden.
const BELOW = '118%'

// Sun: rises low-left, climbs to high-center, sets low-right, then drops below horizon.
const SUN_CONFIG = {
  sunrise: { left: '15%', top: '84%', size: 90, color: '#E0975E', glow: 35 },
  midday:  { left: '50%', top: '14%', size: 110, color: '#FFD98A', glow: 95 },
  sunset:  { left: '85%', top: '70%', size: 130, color: '#E0552E', glow: 80 },
  night:   { left: '92%', top: BELOW, size: 130, color: '#E0552E', glow: 80 },
  chat:    { left: '50%', top: BELOW, size: 110, color: '#FFD98A', glow: 40 },
  insights: { left: '50%', top: '60%', size: 120, color: '#F4894B', glow: 70 },
}

// Moon: parked below horizon until night, then rises to the top-right.
const MOON_CONFIG = {
  sunrise: { left: '78%', top: BELOW },
  midday:  { left: '78%', top: BELOW },
  sunset:  { left: '78%', top: BELOW },
  night:   { left: '78%', top: '18%' },
  chat:    { left: '78%', top: BELOW },
  insights: { left: '78%', top: BELOW },
}

const STARS = [
  { left: '12%', top: '18%', size: 3 },
  { left: '24%', top: '32%', size: 2 },
  { left: '37%', top: '12%', size: 2 },
  { left: '46%', top: '26%', size: 3 },
  { left: '58%', top: '16%', size: 2 },
  { left: '66%', top: '34%', size: 2 },
  { left: '72%', top: '10%', size: 3 },
  { left: '88%', top: '30%', size: 2 },
  { left: '30%', top: '50%', size: 2 },
  { left: '54%', top: '46%', size: 3 },
]

// A simple layered pine: trunk + three stacked tiers, for the lake treeline.
function PineTree({ x, baseY, h, w }) {
  const tier = h / 2.4
  return (
    <g>
      <rect x={x - w * 0.05} y={baseY - 2} width={w * 0.1} height={h * 0.14} fill="#3F1F1C" />
      <path d={`M${x - w / 2},${baseY} L${x},${baseY - tier * 1.15} L${x + w / 2},${baseY} Z`} />
      <path d={`M${x - w * 0.4},${baseY - tier * 0.55} L${x},${baseY - tier * 1.8} L${x + w * 0.4},${baseY - tier * 0.55} Z`} />
      <path d={`M${x - w * 0.3},${baseY - tier * 1.2} L${x},${baseY - h} L${x + w * 0.3},${baseY - tier * 1.2} Z`} />
    </g>
  )
}

export default function SkyScene({ stage = 'midday' }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const sun = SUN_CONFIG[stage] || SUN_CONFIG.midday
  const moon = MOON_CONFIG[stage] || MOON_CONFIG.midday
  const isNight = stage === 'night'
  const isChat = stage === 'chat'
  const isInsights = stage === 'insights'

  // Before mount, the active body sits just below the horizon so it rises into
  // place on load. The off-screen body stays parked below regardless.
  const sunTop = mounted ? sun.top : (sun.top === BELOW ? BELOW : '105%')
  const moonTop = mounted ? moon.top : (moon.top === BELOW ? BELOW : '105%')

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Crossfading gradient skies */}
      {Object.entries(SKY_GRADIENTS).map(([key, gradient]) => (
        <div
          key={key}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            stage === key ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: gradient }}
        />
      ))}

      {/* Sun — slides across the sky and sets below the horizon */}
      <div
        className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
        style={{
          left: sun.left,
          top: sunTop,
          width: sun.size,
          height: sun.size,
          transform: 'translate(-50%, -50%)',
          background: sun.color,
          boxShadow: `0 0 ${sun.glow}px ${sun.glow / 2}px ${sun.color}`,
        }}
      />

      {/* Moon — rises up from below the horizon at night */}
      <div
        className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
        style={{
          left: moon.left,
          top: moonTop,
          width: 90,
          height: 90,
          transform: 'translate(-50%, -50%)',
          background: '#E8E6F0',
          boxShadow: '0 0 50px 20px rgba(232, 230, 240, 0.45)',
        }}
      />

      {/* Soft horizon glow — daybreak behind the mountains (chat only) */}
      <div
        className={`absolute inset-x-0 transition-opacity duration-1000 ease-in-out ${
          isChat ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          bottom: '20%',
          height: '40vh',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 224, 189, 0.55), transparent 70%)',
        }}
      />

      {/* Mountain silhouettes — tall, varied peaks; rise/fade in on the chat screen */}
      <div
        className={`absolute inset-x-0 bottom-0 w-full transition-all duration-1000 ease-in-out ${
          isChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ height: '80vh' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* far ridge — highest, haziest warm tone */}
          <path fill="#C98A6A" d="M0,300 L150,150 L300,260 L470,70 L640,240 L820,120 L1010,280 L1200,160 L1380,250 L1440,200 L1440,600 L0,600 Z" />
          {/* mid ridge */}
          <path fill="#9E5238" d="M0,380 L200,260 L380,360 L560,200 L760,340 L960,230 L1160,360 L1340,270 L1440,330 L1440,600 L0,600 Z" />
          {/* near ridge — lowest, darkest (maroon) */}
          <path fill="#7A2E2E" d="M0,470 L240,370 L460,450 L680,330 L920,450 L1160,360 L1380,450 L1440,420 L1440,600 L0,600 Z" />
        </svg>
      </div>

      {/* Sunset lake scene — warm-dusk hills, treeline, and lake (insights only) */}
      <div
        className={`absolute inset-x-0 bottom-0 w-full transition-all duration-1000 ease-in-out ${
          isInsights ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ height: '85vh' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* far rolling hills — taller, deeper curves, lightest warm brown */}
          <path fill="#C58A63" d="M0,440 C160,300 300,300 460,400 C620,500 760,250 940,300 C1120,350 1240,250 1360,340 C1410,378 1430,360 1440,355 L1440,900 L0,900 Z" />
          {/* near hills — darker, more pronounced mounds framing the lake basin */}
          <path fill="#9E5E3E" d="M0,520 C180,400 320,420 500,500 C680,580 820,400 1020,440 C1200,476 1300,420 1440,470 L1440,900 L0,900 Z" />
          {/* lake — INSET ellipse sitting within the land, so land rings it on all sides */}
          <ellipse cx="720" cy="725" rx="580" ry="155" fill="#9B6E78" />
          {/* sun reflection — soft warm shimmer inside the lake, under the sun */}
          <ellipse cx="720" cy="668" rx="80" ry="88" fill="rgba(244,137,75,0.4)" />
          {/* trees — ON LAND ONLY: far-shore row behind the lake + left/right banks.
              None over the water ellipse. Varied heights. */}
          <g fill="#5C2E2A">
            {/* far shore (behind the lake's top edge, ~y 555 is above the waterline) */}
            <PineTree x={332}  baseY={556} h={150} w={76} />
            <PineTree x={446}  baseY={556} h={250} w={94} />
            <PineTree x={556}  baseY={556} h={110} w={60} />
            <PineTree x={720}  baseY={552} h={200} w={86} />
            <PineTree x={892}  baseY={556} h={132} w={68} />
            <PineTree x={1008} baseY={556} h={240} w={92} />
            <PineTree x={1118} baseY={556} h={96}  w={56} />
            {/* left bank (outside the lake ellipse) */}
            <PineTree x={48}   baseY={580} h={135} w={70} />
            <PineTree x={112}  baseY={580} h={205} w={86} />
            {/* right bank (outside the lake ellipse) */}
            <PineTree x={1330} baseY={580} h={120} w={64} />
            <PineTree x={1396} baseY={580} h={185} w={80} />
          </g>
        </svg>
      </div>

      {/* Stars — fade in at night */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isNight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              boxShadow: '0 0 6px 1px rgba(255, 255, 255, 0.7)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
