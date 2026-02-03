import { useState, useEffect } from 'react';
import { X, Heart, Activity, Droplet, Save } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const EditVitalModal = ({ isOpen, onClose, vitalData, onSuccess }) => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (vitalData) {
            setValue(vitalData.value || '');
        }
    }, [vitalData]);

    if (!isOpen || !vitalData) return null;

    const getIcon = () => {
        switch (vitalData.type) {
            case 'heart_rate': return <Heart className="w-8 h-8 text-red-600" />;
            case 'blood_pressure': return <Activity className="w-8 h-8 text-blue-600" />;
            case 'blood_sugar': return <Droplet className="w-8 h-8 text-purple-600" />;
            default: return <Activity className="w-8 h-8 text-slate-600" />;
        }
    };

    const getLabel = () => {
        switch (vitalData.type) {
            case 'heart_rate': return 'Heart Rate (bpm)';
            case 'blood_pressure': return 'Blood Pressure (mmHg)';
            case 'blood_sugar': return 'Blood Sugar (mg/dL)';
            default: return 'Vital Value';
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            let updatePayload = {};

            if (vitalData.type === 'blood_pressure') {
                const [s, d] = value.split('/').map(v => parseFloat(v));
                updatePayload = { value_primary: s, value_secondary: d };
            } else {
                updatePayload = { value_primary: parseFloat(value) };
            }

            await axios.patch(`/api/v1/health/vitals/${vitalData.id}`, updatePayload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to update vital. Please check your data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        {getIcon()}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Edit {getLabel().split('(')[0]}</h3>
                    <p className="text-slate-500 mb-8">Update your latest recorded value</p>

                    <div className="space-y-4 mb-8">
                        <label className="block text-left text-sm font-medium text-slate-700 ml-1">{getLabel()}</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={vitalData.type === 'blood_pressure' ? '120/80' : 'e.g. 72'}
                            className="w-full px-6 py-4 text-2xl text-center border-2 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm italic">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};

export default EditVitalModal;
