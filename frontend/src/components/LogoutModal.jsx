import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onCancel}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                        <LogOut className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Logout</h3>
                    <p className="text-slate-500 mb-8">Are you sure you want to log out of your account?</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition shadow-lg shadow-red-100"
                        >
                            Log Out
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default LogoutModal;
