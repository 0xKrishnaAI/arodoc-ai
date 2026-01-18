import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const FileUpload = ({ onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError('');
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/v1/analysis/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            onUploadSuccess(response.data);
            setFile(null);
        } catch (err) {
            console.error("Upload failed", err);
            setError('Upload failed. Please try again. (Ensure you are logged in)');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <label htmlFor="dropzone-file">
                <motion.div
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                            <>
                                <FileText className="w-10 h-10 mb-3 text-primary" />
                                <p className="mb-2 text-sm text-gray-500 font-semibold">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                            </>
                        )}
                    </div>
                </motion.div>
            </label>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleChange} accept="image/*,application/pdf" />

            {error && <div className="mt-2 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14} />{error}</div>}

            {
                file && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-4 w-full px-4 py-2 text-white bg-primary rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing with Gemini AI...
                            </>
                        ) : 'Analyze Report'}
                    </button>
                )
            }
        </div >
    );
};

export default FileUpload;
