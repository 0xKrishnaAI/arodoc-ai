import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, X, Image } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        setFile(selectedFile);

        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post('/api/v1/analysis/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            onUploadSuccess(res.data);
            setFile(null);
            setPreview(null);
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${dragActive
                    ? 'border-primary bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
                    : file
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
            >
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-3"
                        >
                            {preview ? (
                                <div className="relative w-20 h-20 mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-soft">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto border border-primary-100 dark:border-primary-900/30">
                                    <FileText className="w-8 h-8 text-primary" />
                                </div>
                            )}
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</p>
                            </div>
                            <button
                                onClick={(e) => { e.preventDefault(); clearFile(); }}
                                className="text-xs text-slate-500 hover:text-red-500 transition-colors inline-flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Remove
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto transition-colors duration-300 ${dragActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                }`}>
                                <Upload className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Drop your file here, or <span className="text-primary">browse</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Upload Button */}
            {file && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full btn-primary py-3 disabled:opacity-60"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload & Analyze
                        </>
                    )}
                </motion.button>
            )}
        </div>
    );
};

export default FileUpload;
