import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Search, MapPin, Phone, Star, Building2, User, Navigation, Crosshair, Loader2, ExternalLink } from 'lucide-react';
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
                setQuery("Nearby Hospitals");
                fetchFacilities('');
            },
            () => {
                setLocationError("Unable to retrieve your location. Please check browser permissions.");
                setLoading(false);
            }
        );
    };

    const openGoogleMaps = () => {
        if (userLocation) {
            window.open(`https://www.google.com/maps/search/hospitals/@${userLocation.lat},${userLocation.lng},15z`, '_blank');
        } else {
            window.open(`https://www.google.com/maps/search/hospitals`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12 gradient-calm">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8 pt-28 lg:pt-32">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-500 border border-blue-100">
                        <MapPin className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Nearby Hospitals</h1>
                    <p className="text-slate-500 text-lg">Find the best care in your area instantly.</p>
                </motion.header>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto mb-10 space-y-4">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="bg-white rounded-2xl shadow-soft flex items-center p-2 border border-slate-100 transition-all duration-300 focus-within:shadow-soft-lg focus-within:border-primary-200">
                            <div className="pl-4">
                                <Search className="text-slate-400 w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, specialty, or type..."
                                className="w-full pl-4 pr-4 py-3 bg-transparent text-base focus:outline-none text-slate-700 placeholder:text-slate-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn-primary px-6 py-2.5 text-sm shrink-0"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleUseLocation}
                            className="flex items-center gap-2 text-slate-600 font-medium hover:text-primary transition-colors py-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                                <Crosshair className="w-4 h-4" />
                            </div>
                            Use My Location
                        </button>
                        {userLocation && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={openGoogleMaps}
                                className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors py-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Real Map Results
                            </motion.button>
                        )}
                    </div>

                    {locationError && (
                        <div className="text-red-600 font-medium text-center bg-red-50 p-3 rounded-xl text-sm border border-red-100">
                            {locationError}
                        </div>
                    )}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-16">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Scanning nearby area...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {results.length === 0 ? (
                            <div className="md:col-span-2 text-center py-16 card border-dashed border-2 border-slate-200">
                                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-5" />
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No facilities found</h3>
                                <p className="text-slate-500">Try searching manually or using your location.</p>
                            </div>
                        ) : (
                            results.map((facility) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={facility.id}
                                    className="card-interactive p-5 group"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary border border-primary-100 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                                            {facility.type === 'Hospital' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 truncate">{facility.name}</h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="badge-info text-[10px]">{facility.type}</span>
                                                <span className="text-sm text-slate-500">{facility.specialty}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                        <span className="text-sm text-slate-600">{facility.address}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-1.5 badge-warning">
                                            <Star className="w-3 h-3 fill-amber-500" />
                                            {facility.rating}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={openGoogleMaps}
                                                className="btn-secondary px-3 py-2 text-xs"
                                            >
                                                <Navigation className="w-3.5 h-3.5" />
                                                Navigate
                                            </button>
                                            <button className="btn-primary px-3 py-2 text-xs">
                                                <Phone className="w-3.5 h-3.5" />
                                                Call
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                <div className="mt-12 p-5 bg-slate-50 rounded-xl border border-slate-100 text-center max-w-2xl mx-auto">
                    <p className="text-slate-500 text-sm italic">
                        Facility recommendations are provided based on nearby availability. Always confirm appointments before visiting.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HospitalLocator;
