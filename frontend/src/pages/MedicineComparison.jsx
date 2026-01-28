import React, { useState } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Filter, Bell, Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const MedicineComparison = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // Mock categories for the filter UI
    const categories = [
        "All", "Pain Relief", "Cardiovascular", "Diabetes", "Respiratory", "Antibiotics", "Mental Health", "Supplements"
    ];

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        // Simulating API call or real call if backend is ready
        try {
            // Using the real endpoint but if query is empty we might want default data
            const endpoint = query
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/medicines/compare-prices?name=${query}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/medicines/compare-prices?name=Paracetamol`; // Default for demo

            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResults(response.data);
        } catch (err) {
            console.error("Search error:", err);
            // Fallback mock data for visual testing if API fails or returns empty
            setResults([
                { vendor_name: "Apollo Pharmacy", price: 45.00, link: "#", is_best_price: true, rating: 4.8, delivery_time: "2 hrs", name: "Paracetamol 500mg", type: "Pain Relief", in_stock: true, rx_required: false },
                { vendor_name: "1mg", price: 120.00, link: "#", is_best_price: false, rating: 4.5, delivery_time: "1 day", name: "Amoxicillin 250mg", type: "Antibiotics", in_stock: true, rx_required: true },
                { vendor_name: "Pharmeasy", price: 85.00, link: "#", is_best_price: true, rating: 4.2, delivery_time: "4 hrs", name: "Metformin 500mg", type: "Diabetes", in_stock: true, rx_required: true },
                { vendor_name: "Netmeds", price: 150.00, link: "#", is_best_price: false, rating: 4.6, delivery_time: "1 day", name: "Atorvastatin 10mg", type: "Cardiovascular", in_stock: true, rx_required: true },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    React.useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            {/* Header / Top Bar */}
            <div className="bg-white pt-24 pb-6 px-6 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medicine<span className="text-emerald-500">Vault.</span></h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                            <span className="w-4 h-4 rounded-full border border-gray-400 border-t-transparent animate-spin hidden"></span>
                            Orders
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200">
                            <ShoppingCart className="w-4 h-4" />
                            Cart (0)
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="max-w-7xl mx-auto mt-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by medicine name, brand, or formula..."
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2">
                                <div className="grid grid-cols-2 gap-0.5">
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                    <div className="w-1 h-1 bg-current rounded-full"></div>
                                </div>
                            </button>
                            <button className="px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Categories Pill List */}
                    <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${i === 0
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group relative">
                                {/* Badges */}
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    {item.rx_required && (
                                        <span className="px-3 py-1 bg-orange-100/80 backdrop-blur-sm text-orange-600 text-[10px] font-bold rounded-full w-fit">
                                            RX REQUIRED
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-emerald-100/80 backdrop-blur-sm text-emerald-600 text-[10px] font-bold rounded-full w-fit flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        IN STOCK
                                    </span>
                                </div>

                                {/* Image Placeholder */}
                                <div className="h-40 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <div className="w-16 h-16 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-300">
                                        <ShoppingCart className="w-8 h-8" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.vendor_name}</p>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{item.name || item.vendor_name}</h3>
                                    <p className="text-xs text-gray-500 mb-4">{item.type || "General Health"} • {item.delivery_time || "2 hrs"}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase">Total Price</p>
                                            <p className="text-2xl font-bold text-slate-900">₹{item.price}</p>
                                        </div>
                                        <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:scale-110 hover:shadow-lg transition-all duration-300">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-4">
                <button className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors relative group">
                    <span className="absolute right-0 top-0 w-4 h-4 bg-red-400 rounded-full border-2 border-white"></span>
                    <Bell className="w-6 h-6" />
                </button>
                <div className="relative group">
                    {/* Chat Tooltip mock */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-bold text-slate-700">Ask Arodoc AI</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3.5 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-bold">Ask Arodoc AI</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MedicineComparison;
