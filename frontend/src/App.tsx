import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/shared/Navbar'
import { PageSkeleton } from './components/shared/PageSkeleton'

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })))
const TimelinePage = lazy(() => import('./pages/TimelinePage').then(module => ({ default: module.TimelinePage })))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage').then(module => ({ default: module.FlashcardsPage })))
const CandidatesPage = lazy(() => import('./pages/CandidatesPage').then(module => ({ default: module.CandidatesPage })))
const BoothFinderPage = lazy(() => import('./pages/BoothFinderPage').then(module => ({ default: module.BoothFinderPage })))
const ChatbotPage = lazy(() => import('./pages/ChatbotPage').then(module => ({ default: module.ChatbotPage })))

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Suspense fallback={<PageSkeleton />}>
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

