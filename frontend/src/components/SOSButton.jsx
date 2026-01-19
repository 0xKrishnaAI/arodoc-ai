import { useState } from 'react';
import { AlertTriangle, Phone, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SOSButton = () => {
    const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SENT, ERROR

    // Get user's current GPS location
    const getLocation = () => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ lat: null, lng: null, error: "Geolocation not supported" });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    console.warn("Location error:", error.message);
                    resolve({ lat: null, lng: null, error: error.message });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    };

    const handleSOS = async () => {
        setStatus('SENDING');
        try {
            // Get real GPS location
            const location = await getLocation();

            const token = localStorage.getItem('token');
            const response = await axios.post('/api/v1/emergency/trigger',
                { location },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            console.log("SOS Response:", response.data);
            setStatus('SENT');
            setTimeout(() => setStatus('IDLE'), 5000);
        } catch (err) {
            console.error("SOS failed", err);
            setStatus('ERROR');
            setTimeout(() => setStatus('IDLE'), 3000);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <motion.button
                whileTap={{ scale: 0.95 }}
                animate={status === 'SENDING' ? { scale: [1, 1.1, 1], transition: { repeat: Infinity } } : {}}
                onClick={handleSOS}
                disabled={status !== 'IDLE'}
                className={`w-48 h-48 rounded-full border-8 shadow-2xl flex flex-col items-center justify-center transition-all ${status === 'SENT' ? 'bg-success border-green-600' :
                    status === 'ERROR' ? 'bg-gray-500 border-gray-600' :
                        'bg-danger border-red-600 hover:bg-red-600'
                    } text-white`}
            >
                {status === 'IDLE' && (
                    <>
                        <AlertTriangle className="w-16 h-16 mb-2" />
                        <span className="text-2xl font-black tracking-widest">SOS</span>
                        <span className="text-xs font-medium opacity-80 mt-1">PRESS FOR HELP</span>
                    </>
                )}
                {status === 'SENDING' && (
                    <>
                        <Phone className="w-12 h-12 mb-2 animate-pulse" />
                        <span className="text-lg font-bold">CONTACTING...</span>
                    </>
                )}
                {status === 'SENT' && (
                    <>
                        <CheckCircle className="w-16 h-16 mb-2" />
                        <span className="text-xl font-bold">ALERT SENT</span>
                    </>
                )}
                {status === 'ERROR' && (
                    <>
                        <AlertTriangle className="w-12 h-12 mb-2" />
                        <span className="text-lg font-bold">FAILED</span>
                    </>
                )}
            </motion.button>
            <p className="mt-6 text-slate-500 text-center text-sm max-w-xs">
                Pressing this button will instantly notify your emergency contacts with your current location.
            </p>
        </div>
    );
};

export default SOSButton;
