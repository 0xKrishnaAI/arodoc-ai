import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { User, Mail, Calendar, Activity, ShieldCheck, ChevronRight, LogOut, Loader2 } from 'lucide-react';
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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'GREEN': return 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/60 text-emerald-800';
            case 'YELLOW': return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 text-amber-800';
            case 'RED': return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/60 text-red-800';
            default: return 'bg-slate-50 border-slate-200 text-slate-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background gradient-calm">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <p className="text-slate-500 text-lg font-medium">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24 gradient-calm">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 pt-28 lg:pt-40">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Your Profile</h1>
                        <p className="text-slate-500 text-lg">Manage your account and personal preferences</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary px-5 py-2.5 text-sm hover:text-red-600 hover:border-red-200"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </motion.header>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div className="card p-6 lg:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                            {/* Profile Header */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-glow">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-4 border-white rounded-full"></div>
                                </div>
                                <div className="pt-1">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{userData?.full_name}</h2>
                                    <p className="text-slate-500 font-medium capitalize flex items-center justify-center sm:justify-start gap-2">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                        {userData?.role || 'Patient'} Account
                                    </p>
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-300 hover:border-primary-200 hover:bg-white">
                                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Email Address</p>
                                        <p className="font-semibold text-slate-800 truncate">{userData?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-300 hover:border-primary-200 hover:bg-white">
                                    <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 border border-orange-100 shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Date of Birth</p>
                                        <p className="font-semibold text-slate-800">
                                            {userData?.profile?.dob ? new Date(userData.profile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-300 hover:border-primary-200 hover:bg-white">
                                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 shrink-0">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Current Age</p>
                                        <p className="font-semibold text-slate-800">{calculateAge(userData?.profile?.dob)} Years Old</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Health Status Card */}
                        <div className={`p-6 rounded-2xl border shadow-soft relative overflow-hidden transition-all duration-300 hover:shadow-soft-lg ${getStatusStyles(healthData?.health_status)}`}>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`p-2 rounded-lg ${healthData?.health_status === 'GREEN' ? 'bg-emerald-100/50' : healthData?.health_status === 'YELLOW' ? 'bg-amber-100/50' : 'bg-red-100/50'}`}>
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold">Overall Status</h3>
                                </div>
                                <div className="text-3xl font-bold mb-2 tracking-tight">
                                    {healthData?.health_status === 'GREEN' ? 'Excellent' :
                                        healthData?.health_status === 'YELLOW' ? 'Attention' : 'Critical'}
                                </div>
                                <p className="text-sm font-medium opacity-80 leading-relaxed mb-5">
                                    {healthData?.status_message}
                                </p>

                                <div className="space-y-2 pt-5 border-t border-black/5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium opacity-70">Verification</span>
                                        <span className="font-semibold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium opacity-70">Member Since</span>
                                        <span className="font-semibold">{new Date(userData?.created_at).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Feature Card */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative group cursor-pointer shadow-soft-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500"></div>

                            <div className="relative z-10">
                                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Premium Feature</p>
                                <h4 className="text-lg font-bold mb-3 leading-tight">Emergency<br />Medical Card</h4>
                                <div className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors duration-300">
                                    Activate Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
