import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { User, Mail, Calendar, Activity, ShieldCheck, ChevronRight, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const [userRes, healthRes] = await Promise.all([
                    axios.get('/api/v1/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('/api/v1/health/dashboard', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                setUserData(userRes.data);
                setHealthData(healthRes.data);
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateAge = (dobString) => {
        if (!dobString) return "Not set";
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
                        <div className="h-4 w-48 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-background to-background">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 pt-32 lg:pt-40">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black text-slate-900 mb-2"
                        >
                            Your Profile
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 text-lg"
                        >
                            Manage your account and personal preferences
                        </motion.p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="px-6 py-3 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm hover:bg-slate-50 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </motion.button>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div className="glass-panel p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 text-center sm:text-left">
                                <div className="relative">
                                    <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl">
                                        <User className="w-12 h-12" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                                </div>
                                <div className="pt-2">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{userData?.full_name}</h2>
                                    <p className="text-slate-500 font-medium capitalize flex items-center justify-center sm:justify-start gap-2">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        {userData?.role || 'Patient'} Account
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="flex items-center gap-5 p-5 bg-white/60 rounded-2xl border border-white/60 transition-colors hover:bg-white/80">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Email Address</p>
                                        <p className="text-lg font-bold text-slate-800 truncate">{userData?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 p-5 bg-white/60 rounded-2xl border border-white/60 transition-colors hover:bg-white/80">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Date of Birth</p>
                                        <p className="text-lg font-bold text-slate-800">
                                            {userData?.profile?.dob ? new Date(userData.profile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 p-5 bg-white/60 rounded-2xl border border-white/60 transition-colors hover:bg-white/80">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Current Age</p>
                                        <p className="text-lg font-bold text-slate-800">{calculateAge(userData?.profile?.dob)} Years Old</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar / Status Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div className={`p-8 rounded-3xl border shadow-sm relative overflow-hidden ${healthData?.health_status === 'GREEN' ? 'bg-gradient-to-br from-green-50 to-emerald-100/50 border-green-100 text-green-800' :
                            healthData?.health_status === 'YELLOW' ? 'bg-gradient-to-br from-amber-50 to-orange-100/50 border-amber-100 text-amber-800' :
                                'bg-gradient-to-br from-red-50 to-rose-100/50 border-red-100 text-red-800'
                            }`}>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2 rounded-lg ${healthData?.health_status === 'GREEN' ? 'bg-green-200/50' : healthData?.health_status === 'YELLOW' ? 'bg-amber-200/50' : 'bg-red-200/50'}`}>
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg">Overall Status</h3>
                                </div>
                                <div className="text-4xl font-black mb-3 tracking-tight">
                                    {healthData?.health_status === 'GREEN' ? 'Excellent' :
                                        healthData?.health_status === 'YELLOW' ? 'Attention' : 'Critical'}
                                </div>
                                <p className="text-sm font-semibold opacity-80 leading-relaxed mb-6">
                                    {healthData?.status_message}
                                </p>

                                <div className="space-y-3 pt-6 border-t border-black/5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium opacity-70">Identity Verification</span>
                                        <span className="font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium opacity-70">Member Since</span>
                                        <span className="font-bold">{new Date(userData?.created_at).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative group cursor-pointer shadow-xl shadow-slate-200">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors"></div>

                            <div className="relative z-10">
                                <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">Premium Feature</p>
                                <h4 className="text-xl font-bold mb-4 leading-tight">Emergency <br />Medical Card</h4>
                                <div className="flex items-center gap-2 text-sm font-bold text-white/90 group-hover:text-white transition-colors">
                                    Activate Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
