import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/shared/Navbar'
import { HomePage } from './pages/HomePage'
import { TimelinePage } from './pages/TimelinePage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { CandidatesPage } from './pages/CandidatesPage'
import { BoothFinderPage } from './pages/BoothFinderPage'
import { ChatbotPage } from './pages/ChatbotPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/learn" element={<FlashcardsPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/booth" element={<BoothFinderPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground mt-auto bg-card">
        <p>&copy; {new Date().getFullYear()} MatdataApp. Built for Indian Voters. / भारतीय मतदाताओं के लिए निर्मित।</p>
      </footer>
    </div>
  )
}

export default App

