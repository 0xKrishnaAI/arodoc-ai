import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Add hook
    const { login } = useAuth();

    // Auto-fill for demo
    useEffect(() => {
        if (location.state?.demo) {
            setEmail('demo@arodoc.ai');
            setPassword('demo123');
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const res = await axios.post('/api/v1/auth/token', formData);
            login(res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            alert('Login failed: ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24 gradient-hero">
            <Navbar />

            {/* Enhanced background effects */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-200/20 blur-[120px] animate-pulse-soft"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-100/30 blur-[100px] animate-float"></div>
            </div>

            <div className="max-w-md mx-auto pt-32 lg:pt-40 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="glass-panel p-8 md:p-10 shadow-glass-lg border-white/50 backdrop-blur-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 border border-primary-100 shadow-soft">
                            <LogIn className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Sign in to access your health dashboard</p>
                    </div>


                    {/* Demo Account Button */}
                    <div className="mb-8">
                        <button
                            type="button"
                            onClick={() => {
                                setEmail('demo@arodoc.ai');
                                setPassword('demo123');
                            }}
                            className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all font-medium text-sm group"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-pulse"></span>
                            Use Demo Account (Judge View)
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    className="input-field pl-12"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full btn-primary py-4 text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-semibold hover:underline underline-offset-2 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
