import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Search, MapPin, Phone, Star, Building2, User, ArrowRight, Navigation, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';

const HospitalLocator = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('search') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    const fetchFacilities = async (searchQuery) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/health/hospitals', {
                params: { query: searchQuery },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResults(res.data.results);
        } catch (err) {
            console.error("Failed to fetch hospitals", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            fetchFacilities(initialQuery);
        } else {
            // Load initial suggestions if no query
            fetchFacilities('');
        }
    }, [initialQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ search: query });
    };

    const handleUseLocation = () => {
        setLoading(true);
        setLocationError(null);
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                // Simulate a "local" search
                setQuery("Nearby Hospitals");
                fetchFacilities(''); // In a real app, pass lat/lng here
            },
            () => {
                setLocationError("Unable to retrieve your location. Please check browser permissions or search by specific City/Hospital name instead.");
                setLoading(false);
            }
        );
    };

    const openGoogleMaps = () => {
        if (userLocation) {
            window.open(`https://www.google.com/maps/search/hospitals/@${userLocation.lat},${userLocation.lng},15z`, '_blank');
        } else {
            // Fallback to general search
            window.open(`https://www.google.com/maps/search/hospitals`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-background to-background">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8 pt-28 lg:pt-12">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">Nearby Hospitals</h1>
                    <p className="text-slate-500 text-xl font-medium">Find the best care in your area instantly.</p>
                </header>

                {/* Search Bar & Location */}
                <div className="max-w-2xl mx-auto mb-12 space-y-4">
                    <form onSubmit={handleSearch} className="relative group z-10">
                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex items-center p-2 border border-slate-100">
                            <div className="pl-4">
                                <Search className="text-slate-400 w-6 h-6" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, specialty, or type..."
                                className="w-full pl-4 pr-4 py-4 bg-transparent text-lg focus:outline-none text-slate-900 placeholder:text-slate-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary/20 shrink-0"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                        <button
                            onClick={handleUseLocation}
                            className="flex items-center gap-2 text-slate-600 font-bold hover:text-primary transition-colors py-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Crosshair className="w-4 h-4" />
                            </div>
                            Use My Location
                        </button>
                        {userLocation && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={openGoogleMaps}
                                className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors py-2"
                            >
                                <MapPin className="w-4 h-4 fill-green-600 text-green-600" />
                                View Real Map Results
                            </motion.button>
                        )}
                    </div>

                    {locationError && (
                        <div className="text-red-500 font-medium text-center bg-red-50 p-3 rounded-xl text-sm">
                            {locationError}
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-6"></div>
                        <p className="text-slate-500 text-lg font-medium">Scanning nearby area...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {results.length === 0 ? (
                            <div className="md:col-span-2 text-center py-24 glass-panel">
                                <Building2 className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No facilities found</h3>
                                <p className="text-slate-500 text-lg">Try searching manually or using your location.</p>
                            </div>
                        ) : (
                            results.map((facility) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={facility.id}
                                    className="glass-panel p-6 hover:border-primary/30 transition group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-6 h-6 text-primary -rotate-45" />
                                    </div>

                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                                                {facility.type === 'Hospital' ? <Building2 className="w-7 h-7" /> : <User className="w-7 h-7" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-xl leading-tight mb-1">{facility.name}</h3>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-primary px-2.5 py-1 bg-primary-50 rounded-lg uppercase tracking-wider">
                                                        {facility.type}
                                                    </span>
                                                    <span className="text-sm text-slate-500 font-medium">{facility.specialty}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-slate-100/50">
                                            <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-slate-400 group-hover:text-primary transition-colors" />
                                            <span className="text-slate-600 font-medium">{facility.address}</span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 mt-2">
                                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-bold text-sm border border-amber-100">
                                                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                                {facility.rating} Rating
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button onClick={openGoogleMaps} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition">
                                                    <Navigation className="w-4 h-4" />
                                                    {userLocation ? 'Navigate' : 'Directions'}
                                                </button>
                                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition shadow-lg shadow-primary/20">
                                                    <Phone className="w-4 h-4" />
                                                    Call
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                <div className="mt-16 p-6 bg-slate-50/50 rounded-2xl border border-slate-200 text-center max-w-3xl mx-auto backdrop-blur-sm">
                    <p className="text-slate-500 italic">
                        "Facility recommendations are provided based on nearby availability. Always confirm appointments before visiting."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HospitalLocator;
