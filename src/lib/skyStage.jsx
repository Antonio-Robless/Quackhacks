// Shared time-of-day stage so a single persistent SkyScene can stay mounted
// across route changes and smoothly tween between stages (e.g. sunrise → midday).
import { createContext, useContext, useState } from 'react'

const SkyStageContext = createContext({ stage: 'sunrise', setStage: () => {} })

export function SkyStageProvider({ children }) {
  const [stage, setStage] = useState('sunrise')
  return (
    <SkyStageContext.Provider value={{ stage, setStage }}>
      {children}
    </SkyStageContext.Provider>
  )
}

export function useSkyStage() {
  return useContext(SkyStageContext)
}
