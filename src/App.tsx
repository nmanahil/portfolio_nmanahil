import { useState, useCallback } from 'react'
import './App.css'
import { ScrollProgressProvider } from './hooks/useScrollProgress'
import StatusBar from './components/ui/StatusBar'
import BootScreen from './components/ui/BootScreen'
import AmbientBackground from './components/ui/AmbientBackground'
import CursorGlow from './components/ui/CursorGlow'
import Hero from './components/sections/Hero'
import ClearanceCard from './components/sections/ClearanceCard'
import SkillNetwork from './components/sections/SkillNetwork'
import AuditLog from './components/sections/AuditLog'
import CaseFiles from './components/sections/CaseFiles'
import ClearanceTokens from './components/sections/ClearanceTokens'
import LeadershipStrip from './components/sections/LeadershipStrip'
import SecureTransmission from './components/sections/SecureTransmission'
import AccessToken from './components/three/AccessToken'
import ChatWidget from './components/chatbot/ChatWidget'

export default function App() {
  const [booted, setBooted] = useState(false)
  const handleBootDone = useCallback(() => setBooted(true), [])

  return (
    <ScrollProgressProvider>
      {!booted && <BootScreen onDone={handleBootDone} />}
      <div className={`relative bg-ink min-h-screen transition-opacity duration-700 ${booted ? 'opacity-100' : 'opacity-0'}`}>
        <AmbientBackground />
        <CursorGlow />
        <StatusBar />
        <AccessToken />
        <main>
          <Hero />
          <ClearanceCard />
          <SkillNetwork />
          <AuditLog />
          <CaseFiles />
          <ClearanceTokens />
          <LeadershipStrip />
          <SecureTransmission />
        </main>
        <footer className="border-t border-line py-6 text-center font-mono text-xs text-muted relative z-10">
          <span className="text-cyan">&gt;</span> MANAHIL NAWAZ · ACCESS_CONSOLE · {new Date().getFullYear()}
        </footer>
        <ChatWidget />
      </div>
    </ScrollProgressProvider>
  )
}
