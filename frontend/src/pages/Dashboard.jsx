import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VitalsForm from '../components/vitals/VitalsForm';
import EditVitalModal from '../components/vitals/EditVitalModal';
import axios from 'axios';
import { Activity, FileText, AlertTriangle, CheckCircle2, Heart, TrendingUp, Plus, BookOpen, Shield, Edit2, Trash2, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import HealthTimeline from '../components/HealthTimeline';

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showVitalsForm, setShowVitalsForm] = useState(false);
    const [editingVital, setEditingVital] = useState(null);
    const [deletingVital, setDeletingVital] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/v1/health/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDashboardData(res.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };



    const getStatusColor = (status) => {
        switch (status) {
            case 'GREEN': return 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/60 text-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-800/30 dark:text-emerald-400';
            case 'YELLOW': return 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 text-amber-800 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800/30 dark:text-amber-400';
            case 'RED': return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/60 text-red-800 dark:from-red-900/20 dark:to-rose-900/20 dark:border-red-800/30 dark:text-red-400';
            default: return 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'GREEN': return <CheckCircle2 className="w-14 h-14 text-emerald-500" />;
            case 'YELLOW': return <AlertTriangle className="w-14 h-14 text-amber-500" />;
            case 'RED': return <AlertTriangle className="w-14 h-14 text-red-500" />;
            default: return <Activity className="w-14 h-14 text-slate-400" />;
        }
    };

    const handleEditVital = (type, data) => {
        setEditingVital({
            type,
            id: data.id,
            value: data.value
        });
    };

    const handleDeleteVital = async (vitalId) => {
        if (!confirm('Are you sure you want to delete this vital record?')) return;

        setDeletingVital(vitalId);
        try {
            await axios.delete(`/api/v1/health/vitals/${vitalId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchDashboard();
        } catch (err) {
            console.error("Failed to delete vital", err);
            alert('Failed to delete vital. Please try again.');
        } finally {
            setDeletingVital(null);
        }
    };

    // Prepare timeline events
    const timelineEvents = [
        ...(dashboardData?.latest_vitals?.heart_rate ? [{
            date: new Date().toISOString(), // Mock date since we don't have timestamp in basic view
            title: 'Heart Rate Checked',
            description: `${parseInt(dashboardData.latest_vitals.heart_rate.value)} bpm recorded`,
            type: parseInt(dashboardData.latest_vitals.heart_rate.value) > 100 ? 'WARNING' : 'SUCCESS',
            icon: 'vital'
        }] : []),
        ...(dashboardData?.has_critical_reports ? [{
            date: new Date().toISOString(),
            title: 'Critical Report Analysis',
            description: 'Recent report flagged potential health risks.',
            type: 'CRITICAL',
            icon: 'report'
        }] : [])
        // In a real app, we'd map over actual recent history
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background gradient-calm dark:bg-slate-950 dark:bg-none">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Loading your health dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12 gradient-calm dark:bg-slate-950 dark:bg-none">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8 pt-28 lg:pt-32">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center lg:text-left"
                >
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">Health Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Your daily health monitoring overview</p>
                </motion.header>

                {/* Health Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-6 lg:p-8 rounded-3xl border shadow-soft mb-10 ${getStatusColor(dashboardData?.health_status)}`}
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="p-4 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-soft">
                            {getStatusIcon(dashboardData?.health_status)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                {dashboardData?.health_status === 'GREEN' ? 'Status: Good' :
                                    dashboardData?.health_status === 'YELLOW' ? 'Status: Attention Needed' :
                                        'Status: Critical Action Required'}
                            </h2>
                            <p className="text-lg md:text-xl font-medium opacity-90">{dashboardData?.status_message}</p>
                        </div>
                    </div>

                    {dashboardData?.concerns && dashboardData.concerns.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10">
                            <p className="font-semibold mb-4 text-base flex items-center justify-center md:justify-start gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Active Concerns:
                            </p>
                            <ul className="grid gap-2 sm:grid-cols-2">
                                {dashboardData.concerns.map((concern, idx) => (
                                    <li key={idx} className="flex items-center gap-3 bg-white/50 dark:bg-black/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-black/5 dark:border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                                        <span className="text-sm font-medium">{concern}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>

                {/* Health Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                    </div>
                    <HealthTimeline events={timelineEvents} />
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {/* Latest Vitals */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500 border border-rose-100 dark:border-rose-900/30">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Vitals</h3>
                        </div>

                        {dashboardData?.latest_vitals ? (
                            <div className="space-y-3">
                                {dashboardData.latest_vitals.heart_rate?.value && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl group transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Heart Rate</p>
                                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{Math.round(dashboardData.latest_vitals.heart_rate.value)} <span className="text-sm font-normal text-slate-500">bpm</span></p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleEditVital('heart_rate', dashboardData.latest_vitals.heart_rate)}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-primary hover:border-primary-200 transition-all duration-300"
                                                title="Edit Vital"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVital(dashboardData.latest_vitals.heart_rate.id)}
                                                disabled={deletingVital === dashboardData.latest_vitals.heart_rate.id}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 transition-all duration-300 disabled:opacity-50"
                                                title="Delete Vital"
                                            >
                                                {deletingVital === dashboardData.latest_vitals.heart_rate.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {dashboardData.latest_vitals.blood_pressure?.value && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl group transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Blood Pressure</p>
                                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{dashboardData.latest_vitals.blood_pressure.value} <span className="text-sm font-normal text-slate-500">mmHg</span></p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleEditVital('blood_pressure', dashboardData.latest_vitals.blood_pressure)}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-primary hover:border-primary-200 transition-all duration-300"
                                                title="Edit Vital"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVital(dashboardData.latest_vitals.blood_pressure.id)}
                                                disabled={deletingVital === dashboardData.latest_vitals.blood_pressure.id}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 transition-all duration-300 disabled:opacity-50"
                                                title="Delete Vital"
                                            >
                                                {deletingVital === dashboardData.latest_vitals.blood_pressure.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {dashboardData.latest_vitals.blood_sugar?.value && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl group transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Blood Sugar</p>
                                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{Math.round(dashboardData.latest_vitals.blood_sugar.value)} <span className="text-sm font-normal text-slate-500">mg/dL</span></p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleEditVital('blood_sugar', dashboardData.latest_vitals.blood_sugar)}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-primary hover:border-primary-200 transition-all duration-300"
                                                title="Edit Vital"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVital(dashboardData.latest_vitals.blood_sugar.id)}
                                                disabled={deletingVital === dashboardData.latest_vitals.blood_sugar.id}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 transition-all duration-300 disabled:opacity-50"
                                                title="Delete Vital"
                                            >
                                                {deletingVital === dashboardData.latest_vitals.blood_sugar.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {dashboardData.latest_vitals.temperature?.value && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl group transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Temperature</p>
                                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{dashboardData.latest_vitals.temperature.value} <span className="text-sm font-normal text-slate-500">°F</span></p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleEditVital('temperature', dashboardData.latest_vitals.temperature)}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-primary hover:border-primary-200 transition-all duration-300"
                                                title="Edit Vital"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVital(dashboardData.latest_vitals.temperature.id)}
                                                disabled={deletingVital === dashboardData.latest_vitals.temperature.id}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 transition-all duration-300 disabled:opacity-50"
                                                title="Delete Vital"
                                            >
                                                {deletingVital === dashboardData.latest_vitals.temperature.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {dashboardData.latest_vitals.weight?.value && (
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl group transition-all duration-300 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm">
                                        <div>
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Weight</p>
                                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{dashboardData.latest_vitals.weight.value} <span className="text-sm font-normal text-slate-500">kg</span></p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleEditVital('weight', dashboardData.latest_vitals.weight)}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-primary hover:border-primary-200 transition-all duration-300"
                                                title="Edit Vital"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVital(dashboardData.latest_vitals.weight.id)}
                                                disabled={deletingVital === dashboardData.latest_vitals.weight.id}
                                                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 transition-all duration-300 disabled:opacity-50"
                                                title="Delete Vital"
                                            >
                                                {deletingVital === dashboardData.latest_vitals.weight.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
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
                        transition={{ delay: 0.3 }}
                        className="card p-6"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center text-violet-500 border border-violet-100 dark:border-violet-900/30">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Reports</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl text-center">
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Total Reports</p>
                                <p className="text-4xl font-bold text-slate-800 dark:text-slate-200">{dashboardData?.recent_reports_count || 0}</p>
                            </div>
                            {dashboardData?.has_critical_reports ? (
                                <div className="flex items-start gap-3 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block font-semibold text-sm mb-0.5">Critical Findings</span>
                                        <span className="text-xs opacity-80">Please share your recent report with a doctor.</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="font-medium text-sm">All recent checks clear</span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card p-6"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-900/30">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowVitalsForm(true)}
                                className="btn-primary w-full py-3.5 text-base"
                            >
                                <Plus className="w-5 h-5" />
                                Add Vitals
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/recommendations" className="btn-secondary py-3 flex-col gap-1.5">
                                    <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                                    <span className="text-xs font-semibold">Insights</span>
                                </Link>
                                <Link to="/hospitals" className="btn-secondary py-3 flex-col gap-1.5">
                                    <Shield className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                                    <span className="text-xs font-semibold">Locator</span>
                                </Link>
                            </div>
                            <Link to="/emergency" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all duration-300 border border-red-100">
                                <AlertTriangle className="w-4 h-4" />
                                Emergency SOS
                            </Link>
                        </div>
                    </motion.div>
                </div>



                {/* Help & Support Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12"
                >
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">Support & Privacy</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link to="/guide" className="card-interactive p-5 flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className="w-11 h-11 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">User Guide</h3>
                                    <p className="text-sm text-slate-500">Learn how to use Arodoc</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary transition-all duration-300">
                                <Plus className="w-4 h-4 rotate-45" />
                            </div>
                        </Link>

                        <Link to="/privacy" className="card-interactive p-5 flex items-center justify-between group">
                            <div className="flex items-center gap-5">
                                <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Privacy & Data</h3>
                                    <p className="text-sm text-slate-500">Control your information</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all duration-300">
                                <Plus className="w-4 h-4 rotate-45" />
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
