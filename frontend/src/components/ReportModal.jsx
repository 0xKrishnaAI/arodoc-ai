import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportModal = ({ report, onClose }) => {
    if (!report) return null;

    const riskColor = report.risk_level === 'GREEN' ? 'bg-green-100 text-green-700' :
        report.risk_level === 'YELLOW' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700';

    const riskIcon = report.risk_level === 'GREEN' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
        report.risk_level === 'YELLOW' ? <Info className="w-5 h-5 text-yellow-600" /> :
            <AlertTriangle className="w-5 h-5 text-red-600" />;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${riskColor}`}>
                                    {riskIcon}
                                    {report.risk_level} RISK
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-mono">{report.file_url.split('/').pop().split('_').slice(1).join('_') || report.file_url.split('/').pop()}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {/* Summary */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Executive Summary</h3>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                                {report.summary}
                            </div>
                        </div>

                        {/* Findings Table */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Detailed Biomarkers</h3>
                            {(!report.analysis_result || report.analysis_result.length === 0) ? (
                                <p className="text-slate-400 italic text-sm">No detailed markers extracted.</p>
                            ) : (
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3">Marker</th>
                                                <th className="px-4 py-3">Value</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {report.analysis_result.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition">
                                                    <td className="px-4 py-3 font-medium text-slate-700">{item.marker}</td>
                                                    <td className="px-4 py-3 text-slate-600 font-mono">{item.value}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                                                            ${item.status?.toUpperCase().includes('HIGH') ? 'bg-red-50 text-red-600' :
                                                                item.status?.toUpperCase().includes('LOW') ? 'bg-orange-50 text-orange-600' :
                                                                    'bg-green-50 text-green-600'}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
                        AI-generated results. Always consult a medical professional.
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReportModal;
