import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Onboarding from './pages/Onboarding'
import Chat from './pages/Chat'
import Insights from './pages/Insights'
import SkyScene from './components/SkyScene'
import { SkyStageProvider, useSkyStage } from './lib/skyStage'

function SkyBackdrop() {
  const { stage } = useSkyStage()
  return <SkyScene stage={stage} />
}

export default function App() {
  return (
    <BrowserRouter>
      <SkyStageProvider>
        <SkyBackdrop />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </SkyStageProvider>
    </BrowserRouter>
  )
}
