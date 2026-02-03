import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const DeleteModal = ({ isOpen, itemName, onConfirm, onCancel }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        await onConfirm();
        setIsDeleting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg w-full max-w-sm p-6 dark:border dark:border-slate-800"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-end mb-2">
                            <button onClick={onCancel} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>

                        <div className="text-center">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-5 border border-red-100 dark:border-red-900/30">
                                <AlertTriangle className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete {itemName}?</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                This action cannot be undone. Are you sure you want to permanently delete this item?
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 btn-secondary py-2.5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;
