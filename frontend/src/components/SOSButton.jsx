import { useState } from 'react';
import { AlertTriangle, Phone, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SOSButton = () => {
    const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SENT, ERROR

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

    const buttonStyles = {
        IDLE: 'bg-gradient-to-br from-red-500 to-red-600 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)]',
        SENDING: 'bg-gradient-to-br from-red-500 to-red-600 border-red-400 shadow-[0_0_50px_rgba(239,68,68,0.5)]',
        SENT: 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)]',
        ERROR: 'bg-gradient-to-br from-slate-500 to-slate-600 border-slate-400 shadow-[0_0_30px_rgba(100,116,139,0.3)]'
    };

    return (
        <div className="flex flex-col items-center">
            {/* Pulsing ring behind button */}
            <div className="relative">
                {status === 'IDLE' && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                        <div className="absolute inset-[-8px] rounded-full bg-red-500/10 animate-pulse"></div>
                    </>
                )}

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    animate={status === 'SENDING' ? { scale: [1, 1.05, 1] } : {}}
                    transition={status === 'SENDING' ? { repeat: Infinity, duration: 1 } : {}}
                    onClick={handleSOS}
                    disabled={status !== 'IDLE'}
                    className={`relative w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 text-white ${buttonStyles[status]} disabled:cursor-not-allowed`}
                >
                    {status === 'IDLE' && (
                        <>
                            <AlertTriangle className="w-12 h-12 mb-1" />
                            <span className="text-2xl font-black tracking-widest">SOS</span>
                            <span className="text-[10px] font-medium opacity-80 mt-0.5 uppercase tracking-wide">Press for Help</span>
                        </>
                    )}
                    {status === 'SENDING' && (
                        <>
                            <Loader2 className="w-10 h-10 mb-2 animate-spin" />
                            <span className="text-sm font-bold uppercase tracking-wide">Contacting...</span>
                        </>
                    )}
                    {status === 'SENT' && (
                        <>
                            <CheckCircle className="w-12 h-12 mb-1" />
                            <span className="text-lg font-bold">Alert Sent</span>
                        </>
                    )}
                    {status === 'ERROR' && (
                        <>
                            <AlertTriangle className="w-10 h-10 mb-1" />
                            <span className="text-sm font-bold">Failed</span>
                        </>
                    )}
                </motion.button>
            </div>

            <p className="mt-6 text-slate-500 text-center text-sm max-w-[280px] leading-relaxed">
                Pressing this button will instantly notify your emergency contacts with your current location.
            </p>
        </div>
    );
};

export default SOSButton;
