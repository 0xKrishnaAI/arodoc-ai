import { X, FileText, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportModal = ({ report, onClose }) => {
    if (!report) return null;

    const getRiskBadgeClass = (riskLevel) => {
        switch (riskLevel) {
            case 'GREEN': return 'badge-success';
            case 'YELLOW': return 'badge-warning';
            case 'RED': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    const getRiskIcon = (riskLevel) => {
        switch (riskLevel) {
            case 'GREEN': return <CheckCircle className="w-5 h-5" />;
            case 'YELLOW':
            case 'RED': return <AlertTriangle className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <AnimatePresence>
            {report && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg w-full max-w-2xl my-8 dark:border dark:border-slate-800"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary border border-primary-100 dark:border-primary-900/30">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                                        {report.file_url.split('/').pop().split('_').slice(1).join('_') || "Medical Report"}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(report.created_at).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors duration-300">
                                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            {/* Risk Level */}
                            {/* Risk Level */}
                            <div className={`flex items-center gap-3 p-4 rounded-xl border ${report.risk_level === 'GREEN' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                report.risk_level === 'YELLOW' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400' :
                                    'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                {getRiskIcon(report.risk_level)}
                                <div>
                                    <span className="font-semibold">Risk Level: {report.risk_level}</span>
                                    <p className="text-sm opacity-80">
                                        {report.risk_level === 'GREEN' ? 'No immediate concerns detected' :
                                            report.risk_level === 'YELLOW' ? 'Some values may need attention' :
                                                'Please consult with a healthcare provider'}
                                    </p>
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Summary</h3>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{report.summary}</p>
                                </div>
                            </div>

                            {/* Extracted Values from Report */}
                            {report.analysis_result && report.analysis_result.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Extracted Values</h3>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {report.analysis_result.map((finding, idx) => {
                                            const statusColor =
                                                finding.status?.toLowerCase().includes('normal') ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                                    finding.status?.toLowerCase().includes('high') ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400' :
                                                        finding.status?.toLowerCase().includes('low') ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400' :
                                                            'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300';

                                            return (
                                                <div key={idx} className={`p-4 rounded-xl border ${statusColor}`}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-sm">{finding.marker}</span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${finding.status?.toLowerCase().includes('normal') ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                                                            finding.status?.toLowerCase().includes('high') ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                                                                finding.status?.toLowerCase().includes('low') ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                                                                    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                            }`}>
                                                            {finding.status || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-bold">{finding.value}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Key Findings (text-based) */}
                            {report.key_findings && report.key_findings.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Key Findings</h3>
                                    <ul className="space-y-2">
                                        {report.key_findings.map((finding, idx) => (
                                            <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                                <div className="w-5 h-5 bg-primary-100 dark:bg-primary-900/40 text-primary dark:text-primary-400 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-slate-700 dark:text-slate-300">{finding}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendations */}
                            {report.recommendations && report.recommendations.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Recommendations</h3>
                                    <ul className="space-y-2">
                                        {report.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex items-start gap-3 p-3 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/20">
                                                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-slate-700 dark:text-slate-300">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-4 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
                            <a
                                href={report.file_url.replace('backend/uploads/', '/uploads/')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary px-4 py-2.5 text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Original
                            </a>
                            <button onClick={onClose} className="btn-primary px-6 py-2.5 text-sm">
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReportModal;
