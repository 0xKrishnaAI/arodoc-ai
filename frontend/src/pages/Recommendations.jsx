import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Disclaimer from '../components/Disclaimer';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, UserPlus, ArrowRight, Utensils, Loader2, Sparkles } from 'lucide-react';

const Recommendations = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/health/recommendations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch recommendations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background gradient-calm flex flex-col items-center justify-center p-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center relative z-10 border border-primary-100">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mt-6">Generating personalized insights...</h2>
                <p className="text-slate-500 mt-2">Analyzing your latest health data</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24 gradient-calm dark:bg-slate-950 dark:bg-none">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 pt-28 lg:pt-40">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center max-w-2xl mx-auto"
                >
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm mb-5 border ${data?.ai_powered
                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30'
                        : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-900/30'
                        }`}>
                        <Sparkles className="w-4 h-4" />
                        {data?.ai_powered ? 'AI Personalized Insights' : 'Smart Health Insights'}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
                        {data?.ai_powered ? 'Personalized ' : 'Smart '}<span className="text-gradient">Recommendations</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                        {data?.ai_powered
                            ? 'AI-generated dietary, activity, and medical suggestions tailored to your age, vitals, and health reports.'
                            : 'Dietary, activity, and medical suggestions based on your health profile.'}
                    </p>
                </motion.header>

                <Disclaimer className="mb-10" />

                <div className="grid gap-6">
                    {/* Diet Suggestions */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-6 lg:p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/30 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-900/30">
                                <Utensils className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Dietary Suggestions</h2>
                                    <span className="badge-success text-[10px]">Beta</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Nutrition plans to optimize your vital stats.</p>
                            </div>
                        </div>

                        <ul className="grid md:grid-cols-2 gap-3">
                            {data?.diet.length > 0 ? data.diet.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                                </li>
                            )) : (
                                <div className="col-span-2 text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    AI is analyzing your recent uploads to generate diet plans...
                                </div>
                            )}
                        </ul>
                    </motion.section>

                    {/* Activity Suggestions */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6 lg:p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100/30 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-900/30">
                                <Activity className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Daily Activity & Lifestyle</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Simple habits to improve your well-being.</p>
                            </div>
                        </div>

                        <ul className="grid md:grid-cols-2 gap-3">
                            {data?.activity.length > 0 ? data.activity.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                                </li>
                            )) : (
                                <div className="col-span-2 text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    Insights will appear here once you upload more health reports.
                                </div>
                            )}
                        </ul>
                    </motion.section>

                    {/* Specialist Recommendations */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-6 lg:p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-100/30 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center text-violet-500 border border-violet-100 dark:border-violet-900/30">
                                <UserPlus className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Recommended Specialists</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Professionals you should consider consulting.</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data?.specialists.length > 0 ? data.specialists.map((specialist, idx) => (
                                <div
                                    key={idx}
                                    className="group p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-soft transition-all duration-300"
                                >
                                    <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center text-violet-500 border border-violet-100 dark:border-violet-900/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2 flex-wrap">
                                        {specialist}
                                        <span className="badge-info text-[10px]">Coming Soon</span>
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Recommended based on your recent analysis.</p>
                                    <button className="text-sm font-semibold text-slate-400 cursor-not-allowed flex items-center gap-1" disabled>
                                        Find Nearby <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    No specific specialist recommendations at this time.
                                </div>
                            )}
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
