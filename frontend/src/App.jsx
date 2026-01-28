import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import { ArrowRight, Activity, ShieldAlert, CheckCircle, Heart, Zap, Play, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'

// Components & Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Recommendations from './pages/Recommendations'
import HospitalLocator from './pages/HospitalLocator'
import Emergency from './pages/Emergency'
import Profile from './pages/Profile'
import Privacy from './pages/Privacy'
import UserGuide from './pages/UserGuide'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AIChat from './components/AIChat'
import Landing from './pages/Landing'
import PrescriptionScan from './pages/PrescriptionScan'
import MedicineComparison from './pages/MedicineComparison'
import SOSButton from './components/SOSButton'

// Landing component is now imported from ./pages/Landing



// Animated Routes Component for Page Transitions
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />

                {/* Public Auth Routes */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
                <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                <Route path="/hospitals" element={<ProtectedRoute><HospitalLocator /></ProtectedRoute>} />
                <Route path="/scan-prescription" element={<ProtectedRoute><PrescriptionScan /></ProtectedRoute>} />
                <Route path="/compare-prices" element={<ProtectedRoute><MedicineComparison /></ProtectedRoute>} />
                <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* General Information (Public) */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/guide" element={<UserGuide />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <ErrorBoundary>
                    <ErrorBoundary>
                        <AnimatedRoutes />
                    </ErrorBoundary>
                </ErrorBoundary>
                <AIChat />
                <SOSButton />
            </Router>
        </AuthProvider>
    )
}

export default App
