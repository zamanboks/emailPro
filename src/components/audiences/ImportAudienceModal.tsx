import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface ImportAudienceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ImportAudienceModal: React.FC<ImportAudienceModalProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    total: number;
    success: number;
    errors: number;
    duplicates: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const csvColumns = ['email', 'first_name', 'last_name', 'phone', 'company', 'tags'];
  const detectedColumns = file ? ['Email Address', 'First Name', 'Last Name', 'Phone Number', 'Company Name'] : [];

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Simulate column detection
    setTimeout(() => {
      setCurrentStep(2);
    }, 500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileSelect(droppedFile);
    }
  };

  const handleImport = () => {
    setCurrentStep(3);
    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        setImportProgress(100);
        setImportResults({
          total: 1250,
          success: 1185,
          errors: 23,
          duplicates: 42
        });
        setCurrentStep(4);
      } else {
        setImportProgress(progress);
      }
    }, 200);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Upload CSV File</h3>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Drop your CSV file here
              </h4>
              <p className="text-gray-500 mb-4">
                Or click to browse and select a file
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) handleFileSelect(selectedFile);
                }}
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• First row should contain column headers</li>
                <li>• At minimum, include an email column</li>
                <li>• UTF-8 encoding recommended</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Download className="w-4 h-4" />
              <button className="text-blue-600 hover:text-blue-700 underline">
                Download sample CSV template
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Map Your Columns</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{file?.name}</span>
                <span className="text-sm text-gray-500">({Math.round((file?.size || 0) / 1024)} KB)</span>
              </div>
              <p className="text-sm text-gray-600">
                Detected {detectedColumns.length} columns, estimated 1,250 rows
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Column Mapping</h4>
              {detectedColumns.map((column, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-700">{column}</label>
                  </div>
                  <div className="w-1/2">
                    <select
                      value={mapping[column] || ''}
                      onChange={(e) => setMapping({ ...mapping, [column]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Skip this column</option>
                      {csvColumns.map((col) => (
                        <option key={col} value={col}>
                          {col.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Email column mapping is required</li>
                    <li>• Duplicate emails will be automatically merged</li>
                    <li>• Invalid emails will be skipped</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Importing Your Data</h3>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {Math.round(importProgress)}% complete
                </p>
              </div>

              <p className="text-sm text-gray-500">
                Processing your CSV file and validating email addresses...
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Import Complete!</h3>
            </div>

            {importResults && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {importResults.success.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Successfully Imported</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResults.total.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">Total Records</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {importResults.duplicates.toLocaleString()}
                  </div>
                  <div className="text-sm text-yellow-700">Duplicates Merged</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {importResults.errors.toLocaleString()}
                  </div>
                  <div className="text-sm text-red-700">Errors/Skipped</div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Review your new audience in the Audiences section</li>
                <li>• Create segments or apply tags as needed</li>
                <li>• Start creating campaigns for this audience</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Import Audience</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step === 4 && currentStep >= 4 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={() => currentStep > 1 && currentStep < 4 ? setCurrentStep(currentStep - 1) : onClose()}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {currentStep === 4 ? 'Close' : currentStep > 1 ? 'Previous' : 'Cancel'}
            </button>
            
            <div className="flex space-x-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!mapping['Email Address']}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Start Import
                </button>
              )}
              {currentStep === 4 && (
                <button
                  type="button"
                  onClick={onSuccess}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  View Audience
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportAudienceModal;