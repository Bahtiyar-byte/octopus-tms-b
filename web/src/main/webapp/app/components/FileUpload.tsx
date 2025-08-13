import React, { useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const onFileUpload = async () => {
        if (!file) {
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Handle success (e.g., show a success message, clear the file input)
            setFile(null);
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h3>File Upload</h3>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload} disabled={!file || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default FileUpload;