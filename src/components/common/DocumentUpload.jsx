import { useState } from 'react';
import api from '../../utils/api';

const DocumentUpload = ({ onUploadSuccess }) => {
    const [documentType, setDocumentType] = useState('aadhaar');
    const [documentNumber, setDocumentNumber] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const documentTypes = [
        { value: 'aadhaar', label: 'Aadhaar Card' },
        { value: 'pan', label: 'PAN Card' },
        { value: 'voter_id', label: 'Voter ID' },
        { value: 'driving_license', label: 'Driving License' },
        { value: 'passport', label: 'Passport' },
    ];

    const handleUpload = async () => {
        if (!documentNumber.trim()) {
            setMessage('Please enter document number');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            await api.post('/users/upload-documents', {
                documents: [{
                    type: documentType,
                    number: documentNumber,
                    uploadedAt: new Date().toISOString()
                }]
            });
            setMessage('Document submitted for verification!');
            setDocumentNumber('');
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Verification Documents</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                        {documentTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
                    <input
                        type="text"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                        placeholder="Enter document number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {message && (
                    <p className={`text-sm ${message.includes('success') || message.includes('submitted') ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!documentNumber.trim() || uploading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                    {uploading ? 'Submitting...' : 'Submit for Verification'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    Your documents will be reviewed by our team. Verification usually takes 24-48 hours.
                </p>
            </div>
        </div>
    );
};

export default DocumentUpload;
