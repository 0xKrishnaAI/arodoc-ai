import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VitalsForm from '../components/VitalsForm';
import EditVitalModal from '../components/EditVitalModal';
import axios from 'axios';
import { Activity, FileText, AlertTriangle, CheckCircle2, Heart, TrendingUp, Plus, BookOpen, Shield, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showVitalsForm, setShowVitalsForm] = useState(false);
    const [editingVital, setEditingVital] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/health/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDashboardData(res.data);
        } catch (err) {
            console.error("Failed to fetch dashboard", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'GREEN': return 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-800';
            case 'YELLOW': return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-amber-800';
            case 'RED': return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 text-red-800';
            default: return 'bg-slate-50 border-slate-200 text-slate-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'GREEN': return <CheckCircle2 className="w-16 h-16 text-emerald-500" />;
            case 'YELLOW': return <AlertTriangle className="w-16 h-16 text-amber-500" />;
            case 'RED': return <AlertTriangle className="w-16 h-16 text-red-500" />;
            default: return <Activity className="w-16 h-16 text-slate-400" />;
        }
    };

    const handleEditVital = (type, data) => {
        setEditingVital({
            type,
            id: data.id,
            value: data.value
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
                        <p className="text-slate-500 text-xl font-medium">Loading your health dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-background to-background">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8 pt-28 lg:pt-12">
                <header className="mb-10 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">Health Dashboard</h1>
                    <p className="text-slate-500 text-xl font-medium">Your daily health monitoring overview</p>
                </header>

                {/* Health Status Card - Large and Prominent */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-8 rounded-3xl border shadow-sm mb-10 transition-all ${getStatusColor(dashboardData?.health_status)}`}
                >
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="p-4 bg-white/60 rounded-full backdrop-blur-sm shadow-sm ring-1 ring-black/5">
                            {getStatusIcon(dashboardData?.health_status)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                {dashboardData?.health_status === 'GREEN' ? 'Status: Good' :
                                    dashboardData?.health_status === 'YELLOW' ? 'Status: Attention Needed' :
                                        'Status: Critical Action Required'}
                            </h2>
                            <p className="text-xl md:text-2xl font-medium opacity-90">{dashboardData?.status_message}</p>
                        </div>
                    </div>

                    {dashboardData?.concerns && dashboardData.concerns.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-black/5">
                            <p className="font-semibold mb-4 text-xl flex items-center justify-center md:justify-start gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Active Concerns:
                            </p>
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {dashboardData.concerns.map((concern, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-lg bg-white/50 px-4 py-3 rounded-xl border border-black/5">
                                        <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                                        {concern}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Latest Vitals */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-6 md:p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600">
                                    <Heart className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Vitals</h3>
                            </div>
                        </div>

                        {dashboardData?.latest_vitals ? (
                            <div className="space-y-4">
                                {dashboardData.latest_vitals.heart_rate?.value && (
                                    <div className="flex items-center justify-between p-4 bg-white/60 border border-slate-100 rounded-xl group transition hover:border-primary-200 hover:shadow-sm">
                                        <div>
                                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Heart Rate</p>
                                            <p className="text-2xl font-bold text-slate-900">{Math.round(dashboardData.latest_vitals.heart_rate.value)} <span className="text-sm font-normal text-slate-500">bpm</span></p>
                                        </div>
                                        <button
                                            onClick={() => handleEditVital('heart_rate', dashboardData.latest_vitals.heart_rate)}
                                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition shadow-sm opacity-0 group-hover:opacity-100"
                                            title="Edit Vital"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                {dashboardData.latest_vitals.blood_pressure?.value && (
                                    <div className="flex items-center justify-between p-4 bg-white/60 border border-slate-100 rounded-xl group transition hover:border-primary-200 hover:shadow-sm">
                                        <div>
                                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Blood Pressure</p>
                                            <p className="text-2xl font-bold text-slate-900">{dashboardData.latest_vitals.blood_pressure.value} <span className="text-sm font-normal text-slate-500">mmHg</span></p>
                                        </div>
                                        <button
                                            onClick={() => handleEditVital('blood_pressure', dashboardData.latest_vitals.blood_pressure)}
                                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition shadow-sm opacity-0 group-hover:opacity-100"
                                            title="Edit Vital"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                {dashboardData.latest_vitals.blood_sugar?.value && (
                                    <div className="flex items-center justify-between p-4 bg-white/60 border border-slate-100 rounded-xl group transition hover:border-primary-200 hover:shadow-sm">
                                        <div>
                                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Blood Sugar</p>
                                            <p className="text-2xl font-bold text-slate-900">{Math.round(dashboardData.latest_vitals.blood_sugar.value)} <span className="text-sm font-normal text-slate-500">mg/dL</span></p>
                                        </div>
                                        <button
                                            onClick={() => handleEditVital('blood_sugar', dashboardData.latest_vitals.blood_sugar)}
                                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition shadow-sm opacity-0 group-hover:opacity-100"
                                            title="Edit Vital"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-6">No vitals recorded yet</p>
                        )}
                    </motion.div>

                    {/* Recent Reports */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-6 md:p-8"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-purple-100/50 rounded-2xl flex items-center justify-center text-purple-600">
                                <FileText className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Reports</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/60 border border-slate-100 rounded-xl text-center">
                                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-1">Total Reports</p>
                                <p className="text-5xl font-bold text-slate-900">{dashboardData?.recent_reports_count || 0}</p>
                            </div>
                            {dashboardData?.has_critical_reports ? (
                                <div className="flex items-start gap-4 text-red-700 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block font-bold mb-1">Critical Findings</span>
                                        <span className="text-sm opacity-90">Please share your recent report with a doctor.</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="font-medium">All recent checks clear</span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-6 md:p-8"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowVitalsForm(true)}
                                className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg shadow-primary/20"
                            >
                                <Plus className="w-6 h-6" />
                                Add Vitals
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/recommendations" className="flex flex-col items-center justify-center gap-2 px-2 py-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition group">
                                    <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-primary transition" />
                                    <span className="text-sm">Insights</span>
                                </Link>
                                <Link to="/hospitals" className="flex flex-col items-center justify-center gap-2 px-2 py-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition group">
                                    <Shield className="w-6 h-6 text-slate-400 group-hover:text-primary transition" />
                                    <span className="text-sm">Locator</span>
                                </Link>
                            </div>
                            <Link to="/emergency" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition border border-red-200">
                                <AlertTriangle className="w-5 h-5" />
                                Emergency SOS
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Help & Support Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">Support & Privacy</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link to="/guide" className="glass-panel p-6 flex items-center justify-between group hover:border-primary/30 transition">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">User Guide</h3>
                                    <p className="text-slate-500">Learn how to use Arodoc</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary transition">
                                <Plus className="w-6 h-6 rotate-45" />
                            </div>
                        </Link>

                        <Link to="/privacy" className="glass-panel p-6 flex items-center justify-between group hover:border-emerald-300 transition">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Privacy & Data</h3>
                                    <p className="text-slate-500">Control your information</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-600 transition">
                                <Plus className="w-6 h-6 rotate-45" />
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Vitals Form Modal */}
            {showVitalsForm && (
                <VitalsForm
                    onSuccess={() => fetchDashboard()}
                    onClose={() => setShowVitalsForm(false)}
                />
            )}

            {/* Edit Vital Modal */}
            <EditVitalModal
                isOpen={!!editingVital}
                onClose={() => setEditingVital(null)}
                vitalData={editingVital}
                onSuccess={() => fetchDashboard()}
            />
        </div>
    );
};

export default Dashboard;
