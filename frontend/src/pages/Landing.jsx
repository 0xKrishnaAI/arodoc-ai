import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ArrowRight, Activity, ShieldAlert, CheckCircle, Heart, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    const [health, setHealth] = useState('Checking...')

    useEffect(() => {
        axios.get('/api/v1/health')
            .then(res => setHealth(res.data.status || 'Active'))
            .catch((err) => {
                console.error(err)
                setHealth('Offline')
            })
    }, [])

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }

    const staggerContainer = {
        animate: { transition: { staggerChildren: 0.1 } }
    }

    return (
        <div className="min-h-screen bg-background text-slate-800 overflow-hidden">
            <Navbar />

            {/* Soft Gradient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-100/40 blur-[120px] animate-pulse-soft"></div>
                <div className="absolute top-[30%] -right-[15%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary-200/30 blur-[100px] animate-pulse-soft" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-6 lg:pt-44 lg:pb-32">
                <motion.div
                    className="max-w-6xl mx-auto text-center relative z-10"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* Status Badge */}
                    <motion.div
                        variants={fadeInUp}
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-600 text-sm font-medium mb-8 shadow-soft"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health === 'Offline' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${health === 'Offline' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        System Status: <span className="font-semibold">{health}</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]"
                    >
                        Healthcare <br className="hidden lg:block" />
                        <span className="text-gradient">Reimagined</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        variants={fadeInUp}
                        className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-500 mb-12 leading-relaxed font-medium"
                    >
                        Arodoc AI simplifies medical reports, tracks vitals, and coordinates emergencies —
                        specially designed for <span className="text-slate-700">seniors</span> and their <span className="text-slate-700">peace of mind</span>.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/guide"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-soft hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            <Play className="w-5 h-5 fill-slate-600" />
                            How it Works
                        </Link>
                    </motion.div>
                </motion.div>
            </header>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <motion.div
                    className="grid md:grid-cols-3 gap-6 lg:gap-8"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {[
                        {
                            icon: Activity,
                            color: "bg-primary-50 text-primary-600 border-primary-100",
                            title: "Smart Analysis",
                            desc: "Instant AI breakdown of complex medical reports into plain English."
                        },
                        {
                            icon: Heart,
                            color: "bg-rose-50 text-rose-500 border-rose-100",
                            title: "Vitals Tracking",
                            desc: "Monitor blood pressure, sugar levels, and heart rate with ease."
                        },
                        {
                            icon: ShieldAlert,
                            color: "bg-amber-50 text-amber-600 border-amber-100",
                            title: "Emergency SOS",
                            desc: "One-tap alerts to family and doctors with your exact location."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeInUp}
                            className="card-interactive p-8 group"
                        >
                            <div className={`w-14 h-14 ${feature.color} border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Feature Deep Dive */}
            <section className="py-24 bg-white/60 backdrop-blur-sm border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6 border border-primary-100">
                                <Sparkles className="w-4 h-4" />
                                AI-Powered
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                Understanding Health <br />Made <span className="text-gradient">Simple</span>
                            </h2>
                            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                                Don't let medical jargon confuse you. Our advanced AI scans your reports and provides key takeaways, risk assessments, and actionable advice instantly.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Instant PDF & Image Processing",
                                    "Clear, Jargon-Free Summaries",
                                    "Automatic Risk Flagging (High/Low)",
                                    "Secure & Private Data Handling"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/signup" className="inline-flex items-center gap-2 font-semibold text-primary text-lg hover:gap-3 transition-all duration-300 group">
                                Start Analyzing Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-200 to-accent/30 rounded-3xl blur-2xl opacity-30 transform rotate-3"></div>
                            <div className="relative glass-panel p-8 shadow-soft-lg">
                                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary border border-primary-100">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">Blood Work.pdf</h4>
                                            <p className="text-xs text-slate-400">Processed Just Now</p>
                                        </div>
                                    </div>
                                    <span className="badge-success">Safe</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <h5 className="font-semibold text-slate-700 mb-1 text-sm">Total Cholesterol</h5>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold text-slate-800">185 mg/dL</span>
                                            <span className="text-emerald-600 font-semibold text-sm">Normal Range</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                        <h5 className="font-semibold text-slate-700 mb-1 text-sm">Hemoglobin A1c</h5>
                                        <div className="flex justify-between items-end">
                                            <span className="text-2xl font-bold text-red-600">6.2%</span>
                                            <span className="text-red-500 font-semibold text-sm">Pre-Diabetic</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 px-6 mt-20 relative z-[100] pointer-events-auto">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6 text-white font-bold text-xl">
                            <div className="bg-gradient-to-br from-primary to-primary-600 p-2 rounded-xl">
                                <Activity className="w-5 h-5" />
                            </div>
                            Arodoc AI
                        </Link>
                        <p className="max-w-sm leading-relaxed text-slate-400">
                            Empowering seniors with accessible, intelligent healthcare technology — because peace of mind shouldn't be complicated.
                        </p>
                    </div>
                    <div>
                        <h5 className="text-white font-semibold mb-6">Platform</h5>
                        <ul className="space-y-3">
                            <li><Link to="/analysis" className="hover:text-primary transition-colors duration-300">Report Analysis</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors duration-300">Health Dashboard</Link></li>
                            <li><Link to="/emergency" className="hover:text-primary transition-colors duration-300">Emergency SOS</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-semibold mb-6">Company</h5>
                        <ul className="space-y-3">
                            <li><Link to="/guide" className="hover:text-primary transition-colors duration-300">User Guide</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} Arodoc AI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300 relative z-[101] cursor-pointer">Twitter</a>
                        <a
                            href="https://www.linkedin.com/in/krishna-agrawal-187744367/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors duration-300 relative z-[101] cursor-pointer"
                        >
                            LinkedIn
                        </a>
                        <a href="mailto:support@arodoc.ai" className="hover:text-primary transition-colors duration-300 relative z-[101] cursor-pointer">Email</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing;
