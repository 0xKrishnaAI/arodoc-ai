import { useState } from 'react';
import { X, Heart, Activity, Droplet, Weight, Thermometer } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const VitalsForm = ({ onSuccess, onClose }) => {
    const [step, setStep] = useState(1);
    const [vitals, setVitals] = useState({
        heart_rate: '',
        blood_pressure: '',
        blood_sugar: '',
        weight: '',
        temperature: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalSteps = 5;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Filter out empty values
            const filteredVitals = Object.fromEntries(
                Object.entries(vitals).filter(([_, v]) => v !== '')
            );

            const res = await axios.post('/api/v1/health/vitals', filteredVitals, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onSuccess(res.data);
            onClose();
        } catch (err) {
            setError('Failed to save vitals. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-900">Heart Rate</h3>
                        <p className="text-center text-slate-500">Enter your current heart rate (beats per minute)</p>
                        <input
                            type="number"
                            value={vitals.heart_rate}
                            onChange={(e) => setVitals({ ...vitals, heart_rate: e.target.value })}
                            placeholder="e.g., 72"
                            className="w-full px-6 py-4 text-2xl text-center border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                        />
                        <p className="text-sm text-slate-400 text-center">Normal: 60-100 bpm</p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-900">Blood Pressure</h3>
                        <p className="text-center text-slate-500">Enter as Systolic/Diastolic</p>
                        <input
                            type="text"
                            value={vitals.blood_pressure}
                            onChange={(e) => setVitals({ ...vitals, blood_pressure: e.target.value })}
                            placeholder="e.g., 120/80"
                            className="w-full px-6 py-4 text-2xl text-center border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                        />
                        <p className="text-sm text-slate-400 text-center">Normal: 120/80 mmHg</p>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Droplet className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-900">Blood Sugar</h3>
                        <p className="text-center text-slate-500">Enter your blood glucose level (mg/dL)</p>
                        <input
                            type="number"
                            value={vitals.blood_sugar}
                            onChange={(e) => setVitals({ ...vitals, blood_sugar: e.target.value })}
                            placeholder="e.g., 100"
                            className="w-full px-6 py-4 text-2xl text-center border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                        />
                        <p className="text-sm text-slate-400 text-center">Normal (fasting): 70-100 mg/dL</p>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Weight className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-900">Weight</h3>
                        <p className="text-center text-slate-500">Enter your current weight (kg)</p>
                        <input
                            type="number"
                            step="0.1"
                            value={vitals.weight}
                            onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                            placeholder="e.g., 70.5"
                            className="w-full px-6 py-4 text-2xl text-center border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                        />
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Thermometer className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-900">Temperature</h3>
                        <p className="text-center text-slate-500">Enter your body temperature (°F)</p>
                        <input
                            type="number"
                            step="0.1"
                            value={vitals.temperature}
                            onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                            placeholder="e.g., 98.6"
                            className="w-full px-6 py-4 text-2xl text-center border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                        />
                        <p className="text-sm text-slate-400 text-center">Normal: 97-99°F</p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Record Vitals</h2>
                        <p className="text-sm text-slate-500">Step {step} of {totalSteps}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full mb-8">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                    {step > 1 && (
                        <button
                            onClick={handlePrev}
                            className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
                        >
                            Previous
                        </button>
                    )}
                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                        >
                            {loading ? 'Saving...' : 'Save Vitals'}
                        </button>
                    )}
                </div>

                <p className="text-xs text-slate-400 text-center mt-4">
                    You can skip any field by clicking Next
                </p>
            </motion.div>
        </div>
    );
};

export default VitalsForm;
