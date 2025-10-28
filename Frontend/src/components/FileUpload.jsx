import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/constants';

export default function FileUpload({ onFilesSelected, selectedFiles }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setError(null);

    // Validate files
    const validFiles = files.filter(file => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError('Invalid file type. Only images, PDFs, and documents allowed.');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds 10MB limit.');
        return false;
      }
      return true;
    });

    if (validFiles.length > 5) {
      setError('Maximum 5 files allowed per message.');
      return;
    }

    onFilesSelected([...selectedFiles, ...validFiles]);
    fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    onFilesSelected(selectedFiles.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div className="space-y-2">
      {/* File Input */}
      <div className="relative inline-block">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
          title="Upload files"
        >
          <Upload size={20} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-400 px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/30">
          {error}
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-1">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 bg-slate-700/30 px-3 py-2 rounded-lg text-xs text-gray-300 border border-slate-600/50"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span>📎</span>
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-gray-500 shrink-0">
                  ({(file.size / 1024 / 1024).toFixed(1)}MB)
                </span>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}