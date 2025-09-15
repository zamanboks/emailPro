import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Eye, 
  Users, 
  Calendar, 
  Settings,
  Palette,
  TestTube,
  Clock
} from 'lucide-react';

const CampaignBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    preheader: '',
    fromName: 'MailPro',
    fromEmail: 'noreply@mailpro.com',
    replyTo: '',
    audience: '',
    sendTime: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
    template: 'blank',
    content: '',
    enableTracking: true,
    enableABTest: false,
    abTestSubject: '',
    abTestPercentage: 50
  });

  const steps = [
    { id: 1, name: 'Setup', icon: Settings },
    { id: 2, name: 'Audience', icon: Users },
    { id: 3, name: 'Design', icon: Palette },
    { id: 4, name: 'Schedule', icon: Calendar },
    { id: 5, name: 'Review', icon: Eye }
  ];

  const templates = [
    {
      id: 'blank',
      name: 'Blank Template',
      description: 'Start from scratch with a blank canvas',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Perfect for weekly updates and news',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'promotion',
      name: 'Promotional',
      description: 'Great for sales and special offers',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'welcome',
      name: 'Welcome Series',
      description: 'Onboard new subscribers effectively',
      preview: '/api/placeholder/300/200'
    }
  ];

  const audiences = [
    { id: 'all', name: 'All Subscribers', count: 12847 },
    { id: 'premium', name: 'Premium Customers', count: 1847 },
    { id: 'new', name: 'New Subscribers (Last 30 Days)', count: 543 },
    { id: 'engaged', name: 'Newsletter Enthusiasts', count: 2934 }
  ];

  const handleSave = () => {
    console.log('Saving campaign:', campaignData);
    navigate('/campaigns');
  };

  const handleSend = () => {
    console.log('Sending campaign:', campaignData);
    navigate('/campaigns');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Setup
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Setup</h2>
              <p className="text-gray-600 mb-6">Configure the basic settings for your email campaign.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter campaign name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={campaignData.subject}
                  onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter subject line..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preheader Text (Optional)
                </label>
                <input
                  type="text"
                  value={campaignData.preheader}
                  onChange={(e) => setCampaignData({ ...campaignData, preheader: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Preview text that appears next to subject line..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={campaignData.fromName}
                    onChange={(e) => setCampaignData({ ...campaignData, fromName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={campaignData.fromEmail}
                    onChange={(e) => setCampaignData({ ...campaignData, fromEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply-To Email (Optional)
                </label>
                <input
                  type="email"
                  value={campaignData.replyTo}
                  onChange={(e) => setCampaignData({ ...campaignData, replyTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Different email for replies..."
                />
              </div>

              {/* A/B Testing Toggle */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TestTube className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">A/B Testing</h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaignData.enableABTest}
                      onChange={(e) => setCampaignData({ ...campaignData, enableABTest: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {campaignData.enableABTest && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Alternative Subject Line
                      </label>
                      <input
                        type="text"
                        value={campaignData.abTestSubject}
                        onChange={(e) => setCampaignData({ ...campaignData, abTestSubject: e.target.value })}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter alternative subject line..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Test Split: {campaignData.abTestPercentage}% / {100 - campaignData.abTestPercentage}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="10"
                        value={campaignData.abTestPercentage}
                        onChange={(e) => setCampaignData({ ...campaignData, abTestPercentage: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2: // Audience
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Audience</h2>
              <p className="text-gray-600 mb-6">Choose who will receive this campaign.</p>
            </div>

            <div className="grid gap-4">
              {audiences.map((audience) => (
                <div
                  key={audience.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    campaignData.audience === audience.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCampaignData({ ...campaignData, audience: audience.id })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{audience.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {audience.count.toLocaleString()} subscribers
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Need a different audience?</h4>
              <p className="text-sm text-gray-600 mb-3">
                You can create new audiences or segments from the Audiences page.
              </p>
              <button
                onClick={() => navigate('/audiences')}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Manage Audiences →
              </button>
            </div>
          </div>
        );

      case 3: // Design
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Design Your Email</h2>
              <p className="text-gray-600 mb-6">Choose a template or start from scratch.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    campaignData.template === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCampaignData({ ...campaignData, template: template.id })}
                >
                  <div className="aspect-w-3 aspect-h-2 bg-gray-100">
                    <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <Palette className="w-12 h-12 text-blue-400" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {campaignData.template && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Content Editor</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Customize your email content using our drag-and-drop editor.
                </p>
                <textarea
                  value={campaignData.content}
                  onChange={(e) => setCampaignData({ ...campaignData, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email content here..."
                />
              </div>
            )}
          </div>
        );

      case 4: // Schedule
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule Delivery</h2>
              <p className="text-gray-600 mb-6">When would you like to send this campaign?</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="immediate"
                  name="sendTime"
                  value="immediate"
                  checked={campaignData.sendTime === 'immediate'}
                  onChange={(e) => setCampaignData({ ...campaignData, sendTime: e.target.value })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="immediate" className="text-sm font-medium text-gray-900">
                  Send immediately
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="scheduled"
                  name="sendTime"
                  value="scheduled"
                  checked={campaignData.sendTime === 'scheduled'}
                  onChange={(e) => setCampaignData({ ...campaignData, sendTime: e.target.value })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="scheduled" className="text-sm font-medium text-gray-900">
                  Schedule for later
                </label>
              </div>

              {campaignData.sendTime === 'scheduled' && (
                <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={campaignData.scheduledDate}
                      onChange={(e) => setCampaignData({ ...campaignData, scheduledDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={campaignData.scheduledTime}
                      onChange={(e) => setCampaignData({ ...campaignData, scheduledTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Optimal Send Time</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Based on your audience's past engagement, we recommend sending on 
                    <strong> Tuesday at 10:00 AM</strong> for the best open rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Review
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Send</h2>
              <p className="text-gray-600 mb-6">Please review your campaign before sending.</p>
            </div>

            <div className="space-y-6">
              {/* Campaign Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Campaign Summary</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{campaignData.name || 'Untitled Campaign'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subject</dt>
                    <dd className="text-sm text-gray-900">{campaignData.subject || 'No subject'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">From</dt>
                    <dd className="text-sm text-gray-900">
                      {campaignData.fromName} &lt;{campaignData.fromEmail}&gt;
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Audience</dt>
                    <dd className="text-sm text-gray-900">
                      {audiences.find(a => a.id === campaignData.audience)?.name || 'No audience selected'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Recipients</dt>
                    <dd className="text-sm text-gray-900">
                      {audiences.find(a => a.id === campaignData.audience)?.count.toLocaleString() || '0'} subscribers
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Send Time</dt>
                    <dd className="text-sm text-gray-900">
                      {campaignData.sendTime === 'immediate' 
                        ? 'Immediately' 
                        : `${campaignData.scheduledDate} at ${campaignData.scheduledTime}`}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* A/B Test Summary */}
              {campaignData.enableABTest && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-medium text-blue-900 mb-4">A/B Test Configuration</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-blue-700">Subject A</dt>
                      <dd className="text-sm text-blue-900">{campaignData.subject}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-blue-700">Subject B</dt>
                      <dd className="text-sm text-blue-900">{campaignData.abTestSubject}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-blue-700">Split</dt>
                      <dd className="text-sm text-blue-900">
                        {campaignData.abTestPercentage}% will receive Subject A, 
                        {100 - campaignData.abTestPercentage}% will receive Subject B
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Email Preview</h3>
                <div className="bg-white rounded border p-4">
                  <div className="border-b pb-2 mb-4">
                    <div className="text-sm text-gray-600">
                      <strong>From:</strong> {campaignData.fromName} &lt;{campaignData.fromEmail}&gt;
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Subject:</strong> {campaignData.subject || 'No subject'}
                    </div>
                    {campaignData.preheader && (
                      <div className="text-sm text-gray-500">
                        {campaignData.preheader}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    {campaignData.content || 'No content added yet.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/campaigns')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
            </h1>
            <p className="text-gray-600">
              {campaignData.name || 'Untitled Campaign'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          {currentStep === 5 && (
            <button
              onClick={handleSend}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              {campaignData.sendTime === 'immediate' ? 'Send Now' : 'Schedule Campaign'}
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : isCompleted
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{step.name}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={() => currentStep < 5 && setCurrentStep(currentStep + 1)}
          disabled={currentStep === 5}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentStep === 5 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CampaignBuilder;