import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BookOpen, Upload, Activity, Heart, ShieldAlert, Zap, ArrowLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UserGuide = () => {
    const navigate = useNavigate();
    const steps = [
        {
            icon: Upload,
            color: 'bg-blue-50 text-blue-500 border-blue-100',
            title: "1. Upload a Report",
            description: "Go to the Analysis page and upload your medical reports (PDF or images). Our AI will instantly extract key findings for you."
        },
        {
            icon: Heart,
            color: 'bg-rose-50 text-rose-500 border-rose-100',
            title: "2. Record Your Vitals",
            description: "Use the 'Add Vitals' button on your Dashboard to keep track of your daily heart rate, blood pressure, and blood sugar."
        },
        {
            icon: Activity,
            color: 'bg-primary-50 text-primary border-primary-100',
            title: "3. Check Your Status",
            description: "Watch your Health Status card. Green means good, Yellow means attention needed, and Red means consult a doctor."
        },
        {
            icon: Zap,
            color: 'bg-violet-50 text-violet-500 border-violet-100',
            title: "4. Get Smart Insights",
            description: "Visit the 'Smart Insights' section to see personalized suggestions for diet and activity based on your recorded data."
        },
        {
            icon: ShieldAlert,
            color: 'bg-red-50 text-red-500 border-red-100',
            title: "5. Emergency SOS",
            description: "In case of an emergency, use the Red Alert button on the Emergency page. It will guide you or help you call for help."
        }
    ];

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
                    className="mb-10"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary border border-primary-100">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">User Guide</h1>
                    </div>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        A quick tour to help you get the most out of your personal health AI companion.
                    </p>
                </motion.header>

                <div className="space-y-4">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="card-interactive p-5 lg:p-6 flex flex-col md:flex-row items-start gap-5 group"
                            >
                                <div className={`w-14 h-14 ${step.color} border rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h2>
                                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 p-8 bg-gradient-to-br from-primary to-primary-700 rounded-2xl text-white text-center relative overflow-hidden shadow-glow-lg"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-5 text-white border border-white/20">
                            <HelpCircle className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                        <p className="text-primary-100 mb-6 max-w-md mx-auto">Our dedicated support team is ready to answer your questions and guide you.</p>
                        <button className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-soft hover:-translate-y-0.5">
                            Contact Support
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserGuide;
