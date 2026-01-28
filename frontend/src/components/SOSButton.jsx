import React, { useState } from 'react';
import { ShieldAlert, Phone, Router, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const SOSButton = () => {
    const { isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);
    const location = useLocation();

    // Don't show on login/signup or landing if preferred. showing everywhere for safety.
    if (!isAuthenticated) return null;

    const handleSOS = async () => {
        if (!confirm("Are you sure you want to trigger an EMERGENCY SOS? This will alert your contacts.")) return;

        setLoading(true);
        setActive(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/medicines/sos`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("SOS Alert Sent! Emergency contacts have been notified.");
        } catch (error) {
            console.error(error);
            alert("Failed to send SOS. Please call emergency services directly.");
        } finally {
            setLoading(false);
            setTimeout(() => setActive(false), 5000);
        }
    };

    return (
        <button
            onClick={handleSOS}
            className={`fixed bottom-24 right-4 z-50 p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border-4
                ${active
                    ? 'bg-red-600 border-red-200 animate-pulse scale-110'
                    : 'bg-red-500 hover:bg-red-600 border-white hover:scale-105'
                }`}
            title="Emergency SOS"
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
