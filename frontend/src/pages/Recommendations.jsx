import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Disclaimer from '../components/Disclaimer';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Activity, UserPlus, ArrowRight, Utensils, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                    <Zap className="w-16 h-16 text-primary relative z-10 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mt-6">Generating personalized insights...</h2>
                <p className="text-slate-500 mt-2">Analyzing your latest health data</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 pt-32 lg:pt-40">
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-6 border border-indigo-100 uppercase tracking-wide"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Powered Insights
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
                    >
                        Smart Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Recommendations</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg md:text-xl leading-relaxed"
                    >
                        Personalized dietary, activity, and medical suggestions tailored just for you based on your unique health profile.
                    </motion.p>
                </header>

                <Disclaimer className="mb-12 border-l-4 border-amber-400 bg-amber-50/50 backdrop-blur-sm" />

                <div className="grid gap-8">
                    {/* Diet Suggestions */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-8 md:p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-sm rotate-3">
                                <Utensils className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-slate-900">Dietary Suggestions</h2>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Beta</span>
                                </div>
                                <p className="text-slate-500">Nutrition plans to optimize your vital stats.</p>
                            </div>
                        </div>

                        <ul className="grid md:grid-cols-2 gap-4">
                            {data?.diet.length > 0 ? data.diet.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                                </li>
                            )) : (
                                <div className="col-span-2 text-center py-8 text-slate-400 italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                    AI is analyzing your recent uploads to generate diet plans...
                                </div>
                            )}
                        </ul>
                    </motion.section>

                    {/* Activity Suggestions */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-8 md:p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm -rotate-2">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">Daily Activity & Lifestyle</h2>
                                <p className="text-slate-500">Simple habits to improve your well-being.</p>
                            </div>
                        </div>

                        <ul className="grid md:grid-cols-2 gap-4">
                            {data?.activity.length > 0 ? data.activity.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                                </li>
                            )) : (
                                <div className="col-span-2 text-center py-8 text-slate-400 italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                    Insights will appear here once you upload more health reports.
                                </div>
                            )}
                        </ul>
                    </motion.section>

                    {/* Specialist Recommendations */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel p-8 md:p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm rotate-2">
                                <UserPlus className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-slate-900">Recommended Specialists</h2>
                                </div>
                                <p className="text-slate-500">Professionals you should consider consulting.</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data?.specialists.length > 0 ? data.specialists.map((specialist, idx) => (
                                <div
                                    key={idx}
                                    className="group p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2 flex-wrap">
                                        {specialist}
                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-wider whitespace-nowrap border border-indigo-200">Coming Soon!</span>
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4">Recommended based on your recent analysis.</p>
                                    <button className="text-sm font-bold text-slate-400 cursor-not-allowed flex items-center gap-1" disabled>
                                        Find Nearby <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-8 text-slate-400 italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
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
