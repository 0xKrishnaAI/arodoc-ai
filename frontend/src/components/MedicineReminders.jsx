import React from 'react';
import { X, Calendar, Plus, Pill, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicineReminders = ({ isOpen, onClose, medicines, onTake, onAdd }) => {
    if (!isOpen) return null;

    // Filter for active schedule (Scheduled items)
    const active_medicines_list = medicines.filter(m => m.status !== 'Taken');
    const taken_medicines_list = medicines.filter(m => m.status === 'Taken');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-8 pb-4 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                        <Pill className="w-8 h-8 text-white -rotate-45" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">Medicine Vault</h2>
                                        <p className="text-emerald-500 font-bold text-xs tracking-wider uppercase mt-1">Scheduled Reminders</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 pt-2">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-slate-500 font-bold text-sm tracking-widest uppercase">Active Schedule</h3>
                                    <button
                                        onClick={onAdd}
                                        className="flex items-center gap-2 text-emerald-500 font-bold text-sm hover:text-emerald-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        ADD MEDICATION
                                    </button>
                                </div>

                                {/* Timeline / List */}
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                    {medicines.length === 0 ? (
                                        <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center">
                                            <Calendar className="w-12 h-12 text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-medium text-sm">NO MEDICATIONS SCHEDULED</p>
                                        </div>
                                    ) : (
                                        medicines.map((med, idx) => (
                                            <div key={idx} className="group relative">
                                                <div className={`p-5 rounded-3xl border transition-all duration-300 flex items-center gap-4
                                                    ${med.status === 'Taken'
                                                        ? 'bg-emerald-50 border-emerald-100 opacity-60'
                                                        : med.status === 'Escalated'
                                                            ? 'bg-red-50 border-red-100 shadow-md shadow-red-100'
                                                            : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200'
                                                    }
                                                 `}>
                                                    {/* Status Icon */}
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                                                        ${med.status === 'Taken' ? 'bg-emerald-100 text-emerald-600' :
                                                            med.status === 'Escalated' ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400'}
                                                    `}>
                                                        {med.status === 'Taken' ? <CheckCircle className="w-6 h-6" /> :
                                                            med.status === 'Escalated' ? <AlertTriangle className="w-6 h-6" /> :
                                                                <Clock className="w-6 h-6" />}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className={`font-bold text-lg ${med.status === 'Taken' ? 'text-emerald-800' : 'text-slate-800'}`}>
                                                                {med.name}
                                                            </h4>
                                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                                                                {med.timing}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-400 font-medium">{med.dosage}</p>
                                                    </div>

                                                    {/* Take Button Overlay (only for Scheduled) */}
                                                    {med.status === 'Scheduled' && (
                                                        <button
                                                            onClick={() => onTake(med.id)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"
                                                        >
                                                            TAKE
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MedicineReminders;
