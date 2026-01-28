import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Upload, Check, AlertCircle, Loader2, ArrowLeft, ScanLine, Sparkles, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const PrescriptionScan = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [scanned, setScanned] = useState(false);
    const [error, setError] = useState('');

    const { token } = useAuth();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setError('');
        }
    };

    const handleClearFile = () => {
        setFile(null);
        setPreview(null);
        setError('');
        setMedicines([]);
        setScanned(false);
    };

    const handleScan = async () => {
        if (!file) return;
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/medicines/scan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMedicines(response.data);
            setScanned(true);
        } catch (err) {
            console.error("Scan error:", err);
            setError('Failed to scan prescription. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleConfirm = async () => {
        try {
            for (const med of medicines) {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/medicines/`, med, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            navigate('/dashboard');
        } catch (err) {
            console.error("Save error:", err);
            setError('Failed to save medicines. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <div className="pt-28 pb-12 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-4 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Scan Prescription
                        <span className="text-emerald-500 ml-2">.</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Upload an image of your prescription and let AI extract the details.</p>
                </motion.div>

                <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none"></div>

                    <div className="p-8 md:p-10">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-100"
                            >
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {!scanned ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    {!preview ? (
                                        <div className="w-full">
                                            <div className="border-3 border-dashed border-slate-200 rounded-[32px] p-12 text-center hover:bg-slate-50 hover:border-emerald-300 transition-all duration-300 group cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    id="prescription-upload"
                                                />
                                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">Click to Upload</h3>
                                                <p className="text-slate-400 font-medium">or drag and drop your image here</p>
                                                <div className="flex items-center justify-center gap-4 mt-8 opacity-60">
                                                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500">JPG</span>
                                                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500">PNG</span>
                                                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500">HEIC</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 group">
                                                <img src={preview} alt="Preview" className="w-full max-h-[500px] object-contain bg-slate-900" />
                                                <button
                                                    onClick={handleClearFile}
                                                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full text-slate-700 hover:text-red-500 hover:bg-white shadow-lg transition-all z-20"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>

                                                {/* Scan Overlay Effect */}
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-emerald-500/10 z-10 flex items-center justify-center backdrop-blur-[2px]">
                                                        <div className="w-full absolute top-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-scan"></div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-8 flex justify-center">
                                                <button
                                                    onClick={handleScan}
                                                    disabled={uploading}
                                                    className="w-full md:w-auto px-12 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 hover:shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                            Processing Scan...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ScanLine className="w-6 h-6" />
                                                            Analyze Prescription
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                                <Sparkles className="w-6 h-6 text-emerald-500" />
                                                Extracted Medicines
                                            </h2>
                                            <p className="text-slate-500 mt-1">Review the details below before adding to your schedule.</p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                                            {medicines.length}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                        {medicines.map((med, index) => (
                                            <div key={index} className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex items-center gap-5">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                    <Plus className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">{med.name}</h3>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wide">
                                                            {med.dosage}
                                                        </span>
                                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wide">
                                                            {med.timing}
                                                        </span>
                                                    </div>
                                                    {med.schedule_time && (
                                                        <p className="text-xs text-slate-400 mt-2 font-medium">
                                                            Scheduled for: {new Date(med.schedule_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleClearFile}
                                            className="flex-1 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-all hover:shadow-md"
                                        >
                                            Retake Scan
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            className="flex-1 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex justify-center items-center gap-3"
                                        >
                                            <Check className="w-5 h-5" />
                                            Confirm & Add All
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default PrescriptionScan;
