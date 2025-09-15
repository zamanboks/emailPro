import React, { useState } from 'react';
import { X, Upload, Users, Link as LinkIcon, Filter } from 'lucide-react';

interface CreateAudienceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAudienceModal: React.FC<CreateAudienceModalProps> = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [audienceType, setAudienceType] = useState<'manual' | 'import' | 'integration' | 'segment'>('manual');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    emails: '',
    csvFile: null as File | null
  });

  const audienceTypes = [
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Add subscribers manually by entering email addresses',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'import',
      title: 'CSV Import',
      description: 'Upload a CSV file with subscriber information',
      icon: Upload,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'integration',
      title: 'Integration',
      description: 'Connect with external services and platforms',
      icon: LinkIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'segment',
      title: 'Smart Segment',
      description: 'Create dynamic audiences based on user behavior and attributes',
      icon: Filter,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form submission based on audience type
    console.log('Creating audience:', { audienceType, formData });
    onSuccess();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Choose Audience Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audienceTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAudienceType(type.id as any)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      audienceType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${type.bgColor}`}>
                        <IconComponent className={`w-6 h-6 ${type.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{type.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Audience Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audience Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter audience name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe this audience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="premium, engaged, newsletter..."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Add Subscribers</h3>
            
            {audienceType === 'manual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Addresses (one per line)
                </label>
                <textarea
                  value={formData.emails}
                  onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter one email address per line. We'll validate and deduplicate automatically.
                </p>
              </div>
            )}

            {audienceType === 'import' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFormData({ ...formData, csvFile: e.target.files?.[0] || null })}
                    className="hidden"
                    id="csv-file"
                  />
                  <label
                    htmlFor="csv-file"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                </div>
                {formData.csvFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {formData.csvFile.name}
                  </p>
                )}
              </div>
            )}

            {audienceType === 'integration' && (
              <div className="text-center py-8">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Connect Your Platform</h4>
                <p className="text-gray-500 mb-6">
                  Choose from our available integrations to sync your audience data
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
                      <span className="text-sm font-medium">Shopify</span>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-orange-600 rounded mx-auto mb-2"></div>
                      <span className="text-sm font-medium">WooCommerce</span>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-600 rounded mx-auto mb-2"></div>
                      <span className="text-sm font-medium">Zapier</span>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-600 rounded mx-auto mb-2"></div>
                      <span className="text-sm font-medium">API</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {audienceType === 'segment' && (
              <div className="text-center py-8">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Smart Segment Builder</h4>
                <p className="text-gray-500 mb-6">
                  This will open the advanced segment builder to create dynamic audiences
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Open Segment Builder
                </button>
              </div>
            )}
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
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Create New Audience</h2>
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
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
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
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {currentStep > 1 ? 'Previous' : 'Cancel'}
              </button>
              
              <div className="flex space-x-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Audience
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAudienceModal;