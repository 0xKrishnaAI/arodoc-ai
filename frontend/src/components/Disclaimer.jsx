import { AlertTriangle } from 'lucide-react';

const Disclaimer = ({ className = '' }) => {
    return (
        <div className={`bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5 ${className}`}>
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">Medical Disclaimer</h4>
                    <p className="text-amber-700 dark:text-amber-500/90 text-sm leading-relaxed">
                        This application provides health monitoring and informational insights only.
                        <strong> It is NOT a replacement for professional medical advice, diagnosis, or treatment.</strong> Always consult a qualified healthcare provider for medical concerns.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
