import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from './components/Navbar'
import { ArrowRight, Activity, ShieldAlert, CheckCircle, Smartphone, Heart, Zap, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'

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

function Landing() {
    const [health, setHealth] = useState('Checking...')
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        axios.get('/api/v1/health')
            .then(res => setHealth(res.data.status || 'Active'))
            .catch((err) => {
                console.error(err)
                setHealth('Offline')
            })
    }, [])

    return (
        <div className="min-h-screen bg-background text-slate-900 selection:bg-primary/20 selection:text-primary overflow-hidden">
            <Navbar />

            {/* Gradient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse-slow"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/10 blur-[100px] animate-pulse-slow animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 text-slate-600 text-sm font-semibold mb-8 shadow-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health === 'Offline' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${health === 'Offline' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        System Status: {health}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]"
                    >
                        Healthcare <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Reimagined</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed font-medium"
                    >
                        Arodoc AI simplifies medical reports, tracks vitals, and coordinates emergencies — specially designed for seniors and their peace of mind.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 duration-300">
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/guide" className="w-full sm:w-auto px-8 py-4 bg-white/70 backdrop-blur-md text-slate-800 border border-white/50 rounded-2xl font-bold text-lg hover:bg-white transition flex items-center justify-center gap-2 shadow-lg shadow-slate-200/50 hover:scale-105 active:scale-95 duration-300">
                            <Play className="w-5 h-5 fill-slate-800" />
                            How it Works
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* Why Arodoc AI - Glass Cards */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Activity,
                            color: "bg-blue-100 text-blue-600",
                            title: "Smart Analysis",
                            desc: "Instant AI breakdown of complex medical reports into plain English."
                        },
                        {
                            icon: Heart,
                            color: "bg-rose-100 text-rose-600",
                            title: "Vitals Tracking",
                            desc: "Monitor blood pressure, sugar levels, and heart rate with ease."
                        },
                        {
                            icon: ShieldAlert,
                            color: "bg-amber-100 text-amber-600",
                            title: "Emergency SOS",
                            desc: "One-tap alerts to family and doctors with your exact location."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-8 hover:border-primary/20 transition group"
                        >
                            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Feature Deep Dive */}
            <section className="py-24 bg-white/50 backdrop-blur-sm border-t border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-6 border border-indigo-100 uppercase tracking-wide">
                                <Zap className="w-4 h-4" />
                                AI-Powered
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Understanding Health <br /> Made Simple</h2>
                            <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                                Don't let medical jargon confuse you. Our advanced AI scans your reports and provides key takeaways, risk assessments, and actionable advice instantly.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Instant PDF & Image Processing",
                                    "Clear, Jargon-Free Summaries",
                                    "Automatic Risk Flagging (High/Low)",
                                    "Secure & Private Data Handling"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700 font-bold">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/signup" className="inline-flex items-center gap-2 font-bold text-primary text-lg hover:gap-3 transition-all group">
                                Start Analyzing Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Blood Work.pdf</h4>
                                            <p className="text-xs text-slate-400">Processed Just Now</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Safe</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <h5 className="font-bold text-slate-900 mb-1">Total Cholesterol</h5>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-black text-slate-800">185 mg/dL</span>
                                            <span className="text-green-600 font-bold text-sm">Normal Range</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                        <h5 className="font-bold text-slate-900 mb-1">Hemoglobin A1c</h5>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-black text-red-600">6.2%</span>
                                            <span className="text-red-500 font-bold text-sm">Pre-Diabetic</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 px-6 mt-20 border-t border-slate-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 text-white font-bold text-2xl">
                            <Activity className="w-8 h-8 text-primary" />
                            Arodoc AI
                        </Link>
                        <p className="max-w-sm leading-relaxed text-slate-400 font-medium">
                            Empowering seniors with accessible, intelligent healthcare technology. because peace of mind shouldn't be complicated.
                        </p>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6">Platform</h5>
                        <ul className="space-y-4 font-medium">
                            <li><Link to="/analysis" className="hover:text-primary transition">Report Analysis</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition">Health Dashboard</Link></li>
                            <li><Link to="/emergency" className="hover:text-primary transition">Emergency SOS</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-6">Company</h5>
                        <ul className="space-y-4 font-medium">
                            <li><Link to="/guide" className="hover:text-primary transition">User Guide</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium">
                    <p>&copy; {new Date().getFullYear()} Arodoc AI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition">Twitter</a>
                        <a href="#" className="hover:text-white transition">LinkedIn</a>
                        <a href="#" className="hover:text-white transition">Email</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}



function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />

                    {/* Public Auth Routes */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
                    <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                    <Route path="/hospitals" element={<ProtectedRoute><HospitalLocator /></ProtectedRoute>} />
                    <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                    {/* General Information (Public) */}
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/guide" element={<UserGuide />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
