import { AlertTriangle } from 'lucide-react';

const Disclaimer = ({ className = '' }) => {
    return (
        <div className={`bg-amber-50 border-2 border-amber-200 rounded-xl p-6 ${className}`}>
            <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-amber-900 text-lg mb-2">Medical Disclaimer</h4>
                    <p className="text-amber-900 text-base leading-relaxed">
                        This application provides health monitoring and informational insights only.
                        <strong> It is NOT a replacement for professional medical advice, diagnosis, or treatment.</strong> Always consult a qualified healthcare provider for medical concerns.
                        Never disregard professional medical advice or delay seeking it because of information from this app.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
