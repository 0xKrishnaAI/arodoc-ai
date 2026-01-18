import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onConfirm, onCancel, itemName = "this contact" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Confirm Delete</h3>
                <p className="text-slate-500 mb-10 font-medium leading-relaxed">
                    Are you sure you want to remove <span className="text-slate-900 font-bold">{itemName}</span>? This action cannot be undone.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={onConfirm}
                        className="w-full py-5 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition shadow-lg shadow-red-100 flex items-center justify-center gap-3"
                    >
                        <Trash2 className="w-5 h-5" /> Delete Now
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition"
                    >
                        Keep it
                    </button>
                </div>

                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};

export default DeleteModal;
