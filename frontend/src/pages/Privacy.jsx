import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Server, Trash2, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-24 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-100 via-background to-background">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8 pt-32 lg:pt-40">
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-white hover:text-primary mb-8 transition-all font-bold shadow-sm border border-white/60"
                >
                    <ArrowLeft className="w-5 h-5 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
                    Back to previous page
                </button>

                <header className="mb-12 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-xl shadow-primary/10 rotate-3 border border-white/50">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
                        Your health data is sensitive. Here is exactly how we protect, handle, and secure it.
                    </p>
                </header>

                <div className="space-y-8">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-8 md:p-10"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Data Security</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-6 text-lg font-medium">
                            At Arodoc AI, your privacy is our top priority. We use industry-standard encryption to protect your medical reports and vitals.
                        </p>
                        <ul className="grid md:grid-cols-2 gap-4">
                            {[
                                { icon: Key, text: "End-to-end encryption for report uploads" },
                                { icon: Server, text: "Secure database storage for vital signs" },
                                { icon: Lock, text: "SSL (Secure Sockets Layer) transmission" },
                                { icon: Trash2, text: "Physical file deletion on request" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-white/50">
                                    <item.icon className="w-5 h-5 text-primary" />
                                    <span className="text-slate-700 font-semibold">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-8 md:p-10"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">How We Use AI</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg font-medium">
                            Our AI analysis is strictly for informational purposes. The Gemini AI models process your reports to extract biomarkers, but this data is <span className="text-slate-900 font-bold bg-purple-50 px-1 rounded">never used to train global AI models</span> or shared with third-party advertisers. Your health data stays YOUR data.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 md:p-10"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Your Rights</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg font-medium">
                            You have the right to access, export, or permanently delete your data at any time. When you delete a report from your history, the associated file is immediately and permanently removed from our storage servers.
                        </p>
                    </motion.section>

                    <div className="text-center pt-12 pb-8">
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">Last Updated: {new Date().toLocaleDateString()}</p>
                        <p className="text-slate-500 font-medium">
                            Have questions? Contact us at <a href="mailto:privacy@arodoc.ai" className="text-primary hover:underline">privacy@arodoc.ai</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
