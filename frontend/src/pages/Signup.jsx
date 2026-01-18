import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { UserPlus, Mail, Lock, User, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        dob: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/api/v1/auth/signup', formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            alert('Registration failed: ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-background to-background">
            <Navbar />
            <div className="max-w-md mx-auto pt-32 lg:pt-40 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 md:p-10 shadow-xl"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium">Join Arodoc AI for smarter health monitoring</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    name="full_name"
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    name="dob"
                                    type="date"
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : (
                                <>
                                    Sign Up <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
