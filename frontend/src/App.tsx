import React, { Suspense, lazy } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Navbar } from './components/shared/Navbar'
import { PageSkeleton } from './components/shared/PageSkeleton'
import { CookieConsentBanner } from './components/shared/CookieConsentBanner'

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })))
const TimelinePage = lazy(() => import('./pages/TimelinePage').then(module => ({ default: module.TimelinePage })))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage').then(module => ({ default: module.FlashcardsPage })))
const CandidatesPage = lazy(() => import('./pages/CandidatesPage').then(module => ({ default: module.CandidatesPage })))
const BoothFinderPage = lazy(() => import('./pages/BoothFinderPage').then(module => ({ default: module.BoothFinderPage })))
const ChatbotPage = lazy(() => import('./pages/ChatbotPage').then(module => ({ default: module.ChatbotPage })))
const EligibilityCheckerPage = lazy(() => import('./pages/EligibilityCheckerPage').then(module => ({ default: module.EligibilityCheckerPage })))
const CandidateComparePage = lazy(() => import('./pages/CandidateComparePage').then(module => ({ default: module.CandidateComparePage })))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage').then(module => ({ default: module.CookiePolicyPage })))
const ElectionViewerPage = lazy(() => import('./pages/ElectionViewerPage').then(module => ({ default: module.ElectionViewerPage })))
const ConstituencyListPage = lazy(() => import('./pages/ConstituencyListPage').then(module => ({ default: module.ConstituencyListPage })))
const ConstituencyDetailPage = lazy(() => import('./pages/ConstituencyDetailPage').then(module => ({ default: module.ConstituencyDetailPage })))

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
            <Route path="/candidates/compare" element={<CandidateComparePage />} />
            <Route path="/booth" element={<BoothFinderPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/eligibility" element={<EligibilityCheckerPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/elections" element={<ElectionViewerPage />} />
            <Route path="/elections/:electionId/constituencies" element={<ConstituencyListPage />} />
            <Route path="/elections/:electionId/constituencies/:constituencyId" element={<ConstituencyDetailPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground mt-auto bg-card">
        <p className="mb-2">&copy; {new Date().getFullYear()} MatdataApp. Built for Indian Voters. / भारतीय मतदाताओं के लिए निर्मित।</p>
        <div className="flex justify-center gap-4 text-xs font-medium">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy / गोपनीयता नीति</Link>
          <span className="text-muted-foreground/50">&bull;</span>
          <Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy / कुकी नीति</Link>
        </div>
      </footer>
      <CookieConsentBanner />
    </div>
  )
}

export default App

