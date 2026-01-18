import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import ReportModal from '../components/ReportModal';
import axios from 'axios';
import { FileText, ChevronRight, Trash2, Loader2, Wand2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Analysis = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/v1/analysis/reports', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReports(res.data);
        } catch (err) {
            console.error("Failed to fetch reports", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUploadSuccess = (newReport) => {
        setReports([newReport, ...reports]);
        setSelectedReport(newReport); // Auto-open the new report
    };

    const handleDeleteReport = async (e, reportId) => {
        e.stopPropagation(); // Prevent opening the modal

        if (!window.confirm("Are you sure you want to delete this report?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/v1/analysis/reports/${reportId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReports(reports.filter(r => r.id !== reportId));
        } catch (err) {
            console.error("Failed to delete report", err);
            alert("Failed to delete report. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-background to-background">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8 pt-28 lg:pt-12">
                <header className="mb-12 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm mb-4 border border-indigo-100">
                        <Wand2 className="w-4 h-4" />
                        <span>AI-Powered Insights</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">Health Analysis</h1>
                    <p className="text-slate-500 text-xl font-medium">Upload medical reports for instant, simplified health summaries.</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Upload Section */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-panel p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                                New Analysis
                            </h2>
                            <FileUpload onUploadSuccess={handleUploadSuccess} />

                            <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-600">
                                <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Supported Formats
                                </p>
                                <ul className="space-y-1 list-disc list-inside opacity-80 pl-1">
                                    <li>PDF Documents</li>
                                    <li>Images (JPG, PNG)</li>
                                    <li>Clear, legible photos</li>
                                </ul>
                            </div>
                        </div>
                    </motion.section>

                    {/* History Section */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Recent Reports</h2>
                            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                                {reports.length} Documents
                            </span>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">Loading your medical history...</p>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="text-center py-20 glass-panel border-dashed">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <FileText className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">No reports found</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto">Upload your first medical report to see the AI analysis in action.</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {reports.map((report) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            whileHover={{ scale: 1.01 }}
                                            key={report.id}
                                            onClick={() => setSelectedReport(report)}
                                            className="glass-panel p-5 cursor-pointer group hover:border-primary/40 transition relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowUpRight className="w-5 h-5 text-primary" />
                                            </div>

                                            <div className="flex items-start gap-5">
                                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    <FileText className="w-8 h-8" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 text-lg truncate pr-8 mb-1">
                                                                {report.file_url.split('/').pop().split('_').slice(1).join('_') || "Medical Report"}
                                                            </h3>
                                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                                                {new Date(report.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                        <span className={`shrink-0 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${report.risk_level === 'GREEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            report.risk_level === 'YELLOW' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                'bg-rose-50 text-rose-700 border-rose-100'
                                                            }`}>
                                                            {report.risk_level} Risk
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed flex-1">
                                                            {report.summary}
                                                        </p>

                                                        <button
                                                            onClick={(e) => handleDeleteReport(e, report.id)}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                            title="Delete Report"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.section>
                </div>
            </div>

            {/* Modal */}
            <ReportModal
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </div>
    );
};

export default Analysis;
