import React, { useState } from 'react';
import { ShieldAlert, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SOSButton = ({ inline = false }) => {
    const { isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);

    // Don't show on non-authenticated pages
    if (!isAuthenticated) return null;

    const getUserLocation = () => {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.warn("Geolocation error:", error);
                        // Default location if permission denied
                        resolve({
                            latitude: 0,
                            longitude: 0,
                            note: "Location unavailable"
                        });
                    }
                );
            } else {
                resolve({
                    latitude: 0,
                    longitude: 0,
                    note: "Geolocation not supported"
                });
            }
        });
    };

    const handleSOS = async () => {
        if (!confirm("⚠️ EMERGENCY SOS ALERT ⚠️\n\nThis will immediately notify all your emergency contacts.\n\nAre you sure you want to proceed?")) return;

        setLoading(true);
        setActive(true);

        try {
            // Get user location
            const locationData = await getUserLocation();

            // Trigger SOS
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/emergency/trigger`,
                locationData,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            alert(`✅ SOS ACTIVATED!\n\n${response.data.notifications_sent} emergency contact(s) have been notified.\n\nHelp is on the way!`);
        } catch (error) {
            console.error("SOS Error:", error);
            alert("❌ Failed to send SOS alert.\n\nPlease call emergency services directly:\n🚨 Dial 112 or your local emergency number");
        } finally {
            setLoading(false);
            setTimeout(() => setActive(false), 5000);
        }
    };

    // Inline mode for Emergency page
    if (inline) {
        return (
            <button
                onClick={handleSOS}
                disabled={loading}
                className={`w-full max-w-md p-8 rounded-3xl shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 border-4 group relative overflow-hidden
                    ${active
                        ? 'bg-red-600 border-red-300 animate-pulse scale-105'
                        : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-400 hover:scale-105 hover:shadow-red-200 dark:hover:shadow-red-900/50'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {/* Pulse animation background */}
                {!loading && (
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse-soft"></div>
                )}

                <div className="relative z-10 flex flex-col items-center gap-4">
                    {loading ? (
                        <Loader className="w-16 h-16 text-white animate-spin" />
                    ) : (
                        <ShieldAlert className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                    )}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {loading ? "SENDING SOS..." : "EMERGENCY SOS"}
                        </h3>
                        <p className="text-red-100 text-sm font-medium">
                            {loading ? "Alerting contacts..." : "Tap to alert emergency contacts"}
                        </p>
                    </div>
                </div>
            </button>
        );
    }

    // Floating mode for other pages
    return (
        <button
            onClick={handleSOS}
            disabled={loading}
            className={`fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4
                ${active
                    ? 'bg-red-600 border-red-200 animate-pulse scale-110'
                    : 'bg-red-500 hover:bg-red-600 border-white hover:scale-110'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
            title="Emergency SOS - Click to alert contacts"
        >
            {loading ? (
                <Loader className="w-8 h-8 text-white animate-spin" />
            ) : (
                <ShieldAlert className="w-8 h-8 text-white" />
            )}
        </button>
    );
};

export default SOSButton;
