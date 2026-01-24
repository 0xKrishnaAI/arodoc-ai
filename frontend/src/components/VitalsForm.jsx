import { useState } from 'react';
import { X, Heart, Activity, Droplet, Weight, Thermometer, Loader2, Check } from 'lucide-react';
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

    const steps = [
        { key: 'heart_rate', icon: Heart, color: 'bg-rose-50 text-rose-500 border-rose-100', title: 'Heart Rate', unit: 'bpm', placeholder: 'e.g., 72', hint: 'Normal: 60-100 bpm', type: 'number' },
        { key: 'blood_pressure', icon: Activity, color: 'bg-blue-50 text-blue-500 border-blue-100', title: 'Blood Pressure', unit: 'mmHg', placeholder: 'e.g., 120/80', hint: 'Normal: 120/80 mmHg', type: 'text' },
        { key: 'blood_sugar', icon: Droplet, color: 'bg-violet-50 text-violet-500 border-violet-100', title: 'Blood Sugar', unit: 'mg/dL', placeholder: 'e.g., 100', hint: 'Normal (fasting): 70-100 mg/dL', type: 'number' },
        { key: 'weight', icon: Weight, color: 'bg-emerald-50 text-emerald-500 border-emerald-100', title: 'Weight', unit: 'kg', placeholder: 'e.g., 70.5', hint: '', type: 'number' },
        { key: 'temperature', icon: Thermometer, color: 'bg-orange-50 text-orange-500 border-orange-100', title: 'Temperature', unit: '°F', placeholder: 'e.g., 98.6', hint: 'Normal: 97-99°F', type: 'number' }
    ];

    const currentStep = steps[step - 1];
    const Icon = currentStep.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="bg-white rounded-2xl shadow-soft-lg w-full max-w-md p-6 lg:p-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Record Vitals</h2>
                        <p className="text-sm text-slate-500">Step {step} of {totalSteps}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-300">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    />
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2 mb-6">
                    {steps.map((s, idx) => (
                        <div
                            key={s.key}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx + 1 === step ? 'bg-primary w-6' :
                                    idx + 1 < step ? 'bg-primary' : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="space-y-5"
                    >
                        <div className={`w-16 h-16 ${currentStep.color} border rounded-2xl flex items-center justify-center mx-auto`}>
                            <Icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-800">{currentStep.title}</h3>
                        <p className="text-center text-slate-500 text-sm">Enter your current {currentStep.title.toLowerCase()}</p>
                        <input
                            type={currentStep.type}
                            step={currentStep.type === 'number' ? '0.1' : undefined}
                            value={vitals[currentStep.key]}
                            onChange={(e) => setVitals({ ...vitals, [currentStep.key]: e.target.value })}
                            placeholder={currentStep.placeholder}
                            className="w-full px-6 py-4 text-2xl text-center input-field font-semibold"
                            autoFocus
                        />
                        {currentStep.hint && (
                            <p className="text-sm text-slate-400 text-center">{currentStep.hint}</p>
                        )}
                    </motion.div>
                </AnimatePresence>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                        {error}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                    {step > 1 && (
                        <button
                            onClick={handlePrev}
                            className="flex-1 btn-secondary py-3"
                        >
                            Previous
                        </button>
                    )}
                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 btn-primary py-3"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-soft disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Save Vitals
                                </>
                            )}
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
