import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { pdfService } from '../lib/pdf';

interface DocumentUploadProps {
  onUpload: (file: File, extractedContent: string) => void;
  isLoading?: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(false);

    // Validate PDF
    const validation = await pdfService.validatePDFFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Extract text from PDF
      const { content } = await pdfService.extractTextFromPDF(file);
      setSuccess(true);
      onUpload(file, content);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process PDF'
      );
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      <button
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isLoading}
        className={`w-full p-8 rounded-xl border-2 border-dashed transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <Upload className="w-8 h-8 text-gray-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              Drag and drop your PDF here
            </p>
            <p className="text-xs text-gray-600 mt-1">
              or click to select (max 50MB)
            </p>
          </div>
        </div>
      </button>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            PDF processed successfully!
          </p>
        </div>
      )}
    </div>
  );
};
