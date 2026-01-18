import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BookOpen, Upload, Activity, Heart, ShieldAlert, Zap, ArrowLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UserGuide = () => {
    const navigate = useNavigate();
    const steps = [
        {
            icon: <Upload className="w-8 h-8 text-blue-500" />,
            title: "1. Upload a Report",
            description: "Go to the Analysis page and upload your medical reports (PDF or images). Our AI will instantly extract key findings for you."
        },
        {
            icon: <Heart className="w-8 h-8 text-green-500" />,
            title: "2. Record Your Vitals",
            description: "Use the 'Add Vitals' button on your Dashboard to keep track of your daily heart rate, blood pressure, and blood sugar."
        },
        {
            icon: <Activity className="w-8 h-8 text-blue-600" />,
            title: "3. Check Your Status",
            description: "Watch your Health Status card. Green means good, Yellow means attention needed, and Red means consult a doctor."
        },
        {
            icon: <Zap className="w-8 h-8 text-indigo-500" />,
            title: "4. Get Smart Insights",
            description: "Visit the 'Smart Insights' section to see personalized suggestions for diet and activity based on your recorded data."
        },
        {
            icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
            title: "5. Emergency SOS",
            description: "In case of an emergency, use the Red Alert button on the Emergency page. It will guide you or help you call for help."
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-24 text-lg bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-background to-background">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-8 pt-32 lg:pt-40">
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm text-slate-600 rounded-xl hover:bg-white hover:text-primary mb-8 transition-all font-bold shadow-sm border border-white/60"
                >
                    <ArrowLeft className="w-5 h-5 stroke-[3px] group-hover:-translate-x-1 transition-transform" />
                    Back to previous page
                </button>

                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-100/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-sm border border-blue-200/50">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">User Guide</h1>
                    </div>
                    <p className="text-slate-500 text-xl leading-relaxed max-w-2xl font-medium">
                        A quick tour to help you get the most out of your personal health AI companion.
                    </p>
                </header>

                <div className="space-y-6">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-8 md:p-10 flex flex-col md:flex-row items-start gap-8 hover:border-primary/30 transition-colors group"
                        >
                            <div className="w-20 h-20 bg-white/80 rounded-3xl flex items-center justify-center shrink-0 shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-300">
                                {step.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h2>
                                <p className="text-slate-600 leading-relaxed text-lg font-medium">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-10 bg-gradient-to-br from-primary to-primary-600 rounded-[2rem] text-white text-center relative overflow-hidden shadow-2xl shadow-primary/25"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 text-white border border-white/20">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-bold mb-3">Still need help?</h3>
                        <p className="text-blue-100 mb-8 font-medium text-lg max-w-md mx-auto">Our dedicated support team is ready to answer your questions and guide you.</p>
                        <button className="px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-blue-50 transition shadow-lg hover:scale-105 active:scale-95 duration-200">
                            Contact Support
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserGuide;
