import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import ReportModal from '../components/ReportModal';
import axios from 'axios';
import { FileText, Trash2, Loader2, Wand2, ArrowUpRight, Sparkles } from 'lucide-react';
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
        setSelectedReport(newReport);
    };

    const handleDeleteReport = async (e, reportId) => {
        e.stopPropagation();

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

    const getRiskBadgeClass = (riskLevel) => {
        switch (riskLevel) {
            case 'GREEN': return 'badge-success';
            case 'YELLOW': return 'badge-warning';
            case 'RED': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32 lg:pb-12 gradient-calm">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8 pt-28 lg:pt-32">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-4 border border-primary-100">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Insights</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Health Analysis</h1>
                    <p className="text-slate-500 text-lg">Upload medical reports for instant, simplified health summaries.</p>
                </motion.header>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Upload Section */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                                <Wand2 className="w-5 h-5 text-primary" />
                                New Analysis
                            </h2>
                            <FileUpload onUploadSuccess={handleUploadSuccess} />

                            <div className="mt-6 p-4 bg-primary-50/50 rounded-xl border border-primary-100 text-sm text-slate-600">
                                <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Supported Formats
                                </p>
                                <ul className="space-y-1.5 list-disc list-inside opacity-80 pl-1">
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
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Recent Reports
                            </h2>
                            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 uppercase tracking-wide">
                                {reports.length} Documents
                            </span>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-16">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">Loading your medical history...</p>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="text-center py-16 card border-dashed border-2 border-slate-200 bg-slate-50/50">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 shadow-sm">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-slate-700 mb-2">No reports found</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto text-sm">Upload your first medical report to unlock AI-powered insights.</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {reports.map((report) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={report.id}
                                            onClick={() => setSelectedReport(report)}
                                            className="card-interactive p-5 group relative overflow-hidden bg-white hover:bg-slate-50/50"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-primary-100/50 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                                    <FileText className="w-7 h-7" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-8">
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 truncate pr-4 mb-1 text-lg group-hover:text-primary transition-colors">
                                                                {report.file_url.split('/').pop().split('_').slice(1).join('_') || "Medical Report"}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                                                                <span className="uppercase tracking-wide">
                                                                    {new Date(report.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                <span>{report.file_type?.split('/')?.[1]?.toUpperCase() || 'PDF'}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`shrink-0 ${getRiskBadgeClass(report.risk_level)} shadow-sm`}>
                                                            {report.risk_level} Risk
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-slate-100/60 flex items-center justify-between gap-4">
                                                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed flex-1 opacity-90">
                                                            {report.summary}
                                                        </p>

                                                        <button
                                                            onClick={(e) => handleDeleteReport(e, report.id)}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
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
