import { AlertTriangle } from 'lucide-react';

const Disclaimer = ({ className = '' }) => {
    return (
        <div className={`bg-amber-50 border border-amber-200 rounded-xl p-5 ${className}`}>
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <h4 className="font-bold text-amber-800 mb-1">Medical Disclaimer</h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                        This application provides health monitoring and informational insights only.
                        <strong> It is NOT a replacement for professional medical advice, diagnosis, or treatment.</strong> Always consult a qualified healthcare provider for medical concerns.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
