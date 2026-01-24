import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Server, Trash2, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-24 gradient-calm">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8 pt-28 lg:pt-36">
                <button
                    onClick={() => navigate(-1)}
                    className="btn-secondary px-4 py-2 text-sm mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-5 border border-emerald-100">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3">Privacy Policy</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Your health data is sensitive. Here's exactly how we protect, handle, and secure it.
                    </p>
                </motion.header>

                <div className="space-y-5">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-6 lg:p-8"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Data Security</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-5">
                            At Arodoc AI, your privacy is our top priority. We use industry-standard encryption to protect your medical reports and vitals.
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-3">
                            {[
                                { icon: Key, text: "End-to-end encryption for uploads" },
                                { icon: Server, text: "Secure database storage" },
                                { icon: Lock, text: "SSL transmission protection" },
                                { icon: Trash2, text: "File deletion on request" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <item.icon className="w-4 h-4 text-primary" />
                                    <span className="text-slate-700 text-sm font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6 lg:p-8"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center text-violet-500 border border-violet-100">
                                <Eye className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">How We Use AI</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Our AI analysis is strictly for informational purposes. The Gemini AI models process your reports to extract biomarkers, but this data is <span className="text-slate-800 font-semibold bg-violet-50 px-1 rounded">never used to train global AI models</span> or shared with third-party advertisers. Your health data stays YOUR data.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-6 lg:p-8"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Your Rights</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            You have the right to access, export, or permanently delete your data at any time. When you delete a report from your history, the associated file is immediately and permanently removed from our storage servers.
                        </p>
                    </motion.section>

                    <div className="text-center pt-8 pb-4">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Last Updated: {new Date().toLocaleDateString()}</p>
                        <p className="text-slate-500 text-sm">
                            Questions? Contact us at <a href="mailto:privacy@arodoc.ai" className="text-primary hover:underline">privacy@arodoc.ai</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
