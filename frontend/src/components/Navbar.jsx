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
            className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-3 py-2 rounded-xl transition-all duration-300
                ${active
                    ? (isEmergency ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary font-bold')
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
        >
            <Icon className={`w-6 h-6 lg:w-5 lg:h-5 ${isEmergency && !active ? 'text-red-500' : ''}`} />
            <span className="text-[10px] lg:text-sm font-medium">{label}</span>
        </Link>
    );

    return (
        <>
            <nav className={`fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto z-50 transition-all duration-300 ${scrolled ? 'lg:bg-white/80 lg:backdrop-blur-md lg:shadow-sm' : 'lg:bg-transparent'} bg-white border-t lg:border-t-0 border-slate-200`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="hidden lg:flex items-center gap-2 group">
                            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-800 group-hover:text-primary transition-colors">Arodoc AI</span>
                        </Link>

                        <div className="flex w-full lg:w-auto items-center justify-around lg:justify-end lg:gap-2">
                            <NavLink to="/" icon={Home} label="Home" active={isActive('/')} />

                            {isAuthenticated ? (
                                <>
                                    <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/dashboard')} />
                                    <NavLink to="/recommendations" icon={Zap} label="Insights" active={isActive('/recommendations')} />
                                    <NavLink to="/analysis" icon={Activity} label="Analysis" active={isActive('/analysis')} />
                                    <NavLink to="/hospitals" icon={MapPin} label="Nearby Hospital" active={isActive('/hospitals')} />
                                    <NavLink to="/emergency" icon={ShieldAlert} label="Emergency" active={isActive('/emergency')} isEmergency />
                                    <NavLink to="/profile" icon={User} label="Profile" active={isActive('/profile')} />

                                    <button
                                        onClick={() => setIsLogoutModalOpen(true)}
                                        className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <LogOut className="w-6 h-6 lg:w-5 lg:h-5" />
                                        <span className="text-[10px] lg:text-sm font-medium">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hidden lg:flex px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                                >
                                    Login / Sign Up
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
