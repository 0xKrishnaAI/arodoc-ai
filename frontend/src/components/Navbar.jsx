import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ShieldAlert, Home, User, LayoutDashboard, Zap, LogOut, Stethoscope, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        logout();
        navigate('/');
    };

    const NavLink = ({ to, icon: Icon, label, active, isEmergency }) => (
        <Link
            to={to}
            className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 ease-smooth group
                ${active
                    ? (isEmergency ? 'bg-red-50 text-red-600 shadow-sm' : 'bg-primary-50 text-primary font-semibold shadow-sm')
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
        >
            <Icon className={`w-5 h-5 lg:w-[18px] lg:h-[18px] transition-transform duration-300 group-hover:scale-110 ${isEmergency && !active ? 'text-red-500' : ''}`} />
            <span className="text-[10px] lg:text-sm font-medium">{label}</span>
        </Link>
    );

    return (
        <>
            <nav className={`fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto z-50 transition-all duration-500 ease-smooth
                ${scrolled
                    ? 'lg:bg-white/90 lg:backdrop-blur-xl lg:shadow-soft lg:border-b lg:border-slate-100'
                    : 'lg:bg-transparent'
                } 
                bg-white/95 backdrop-blur-xl border-t lg:border-t-0 border-slate-100 safe-bottom`}
            >
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2 lg:py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="hidden lg:flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-primary to-primary-600 p-2.5 rounded-xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300 text-white">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-800 group-hover:text-primary transition-colors duration-300">
                                Arodoc AI
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex w-full lg:w-auto items-center justify-around lg:justify-end lg:gap-1">
                            <NavLink to="/" icon={Home} label="Home" active={isActive('/')} />

                            {isAuthenticated ? (
                                <>
                                    <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/dashboard')} />
                                    <NavLink to="/recommendations" icon={Zap} label="Insights" active={isActive('/recommendations')} />
                                    <NavLink to="/analysis" icon={Activity} label="Analysis" active={isActive('/analysis')} />
                                    <NavLink to="/hospitals" icon={MapPin} label="Nearby" active={isActive('/hospitals')} />
                                    <NavLink to="/emergency" icon={ShieldAlert} label="SOS" active={isActive('/emergency')} isEmergency />
                                    <NavLink to="/profile" icon={User} label="Profile" active={isActive('/profile')} />

                                    <button
                                        onClick={() => setIsLogoutModalOpen(true)}
                                        className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-3 py-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 ease-smooth group"
                                    >
                                        <LogOut className="w-5 h-5 lg:w-[18px] lg:h-[18px] group-hover:scale-110 transition-transform duration-300" />
                                        <span className="text-[10px] lg:text-sm font-medium">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hidden lg:flex px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all duration-300 shadow-soft hover:shadow-glow hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            )}

                            {!isAuthenticated && (
                                <NavLink to="/login" icon={User} label="Login" active={isActive('/login')} />
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleConfirmLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </>
    );
};

export default Navbar;
