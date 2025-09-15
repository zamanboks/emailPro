import React, { useState } from 'react';
import { X, Plus, Trash2, Users, Calendar, ShoppingBag, Activity } from 'lucide-react';

interface SegmentBuilderProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
  type: 'and' | 'or';
}

const SegmentBuilder: React.FC<SegmentBuilderProps> = ({ onClose, onSuccess }) => {
  const [segmentName, setSegmentName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', field: '', operator: '', value: '', type: 'and' }
  ]);
  const [estimatedCount, setEstimatedCount] = useState(0);

  const fieldOptions = [
    { 
      category: 'User Information',
      icon: Users,
      fields: [
        { value: 'email', label: 'Email Address' },
        { value: 'firstName', label: 'First Name' },
        { value: 'lastName', label: 'Last Name' },
        { value: 'location', label: 'Location' },
        { value: 'tags', label: 'Tags' }
      ]
    },
    {
      category: 'Engagement',
      icon: Activity,
      fields: [
        { value: 'openRate', label: 'Open Rate' },
        { value: 'clickRate', label: 'Click Rate' },
        { value: 'lastOpened', label: 'Last Email Opened' },
        { value: 'totalOpens', label: 'Total Opens' },
        { value: 'subscribeDate', label: 'Subscribe Date' }
      ]
    },
    {
      category: 'Purchase Behavior',
      icon: ShoppingBag,
      fields: [
        { value: 'totalSpent', label: 'Total Amount Spent' },
        { value: 'orderCount', label: 'Number of Orders' },
        { value: 'lastPurchase', label: 'Last Purchase Date' },
        { value: 'avgOrderValue', label: 'Average Order Value' },
        { value: 'productCategory', label: 'Purchased Category' }
      ]
    },
    {
      category: 'Timeline',
      icon: Calendar,
      fields: [
        { value: 'createdAt', label: 'Account Created' },
        { value: 'lastActive', label: 'Last Activity' },
        { value: 'emailSent', label: 'Email Sent Date' },
        { value: 'campaignReceived', label: 'Campaign Received' }
      ]
    }
  ];

  const getOperatorOptions = (fieldType: string) => {
    const commonOperators = [
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'does not equal' },
      { value: 'contains', label: 'contains' },
      { value: 'not_contains', label: 'does not contain' }
    ];

    const numericOperators = [
      { value: 'greater_than', label: 'greater than' },
      { value: 'less_than', label: 'less than' },
      { value: 'greater_equal', label: 'greater than or equal' },
      { value: 'less_equal', label: 'less than or equal' }
    ];

    const dateOperators = [
      { value: 'after', label: 'after' },
      { value: 'before', label: 'before' },
      { value: 'in_last', label: 'in the last' },
      { value: 'not_in_last', label: 'not in the last' }
    ];

    if (['totalSpent', 'orderCount', 'avgOrderValue', 'totalOpens', 'openRate', 'clickRate'].includes(fieldType)) {
      return [...commonOperators, ...numericOperators];
    }

    if (['createdAt', 'lastActive', 'lastOpened', 'lastPurchase', 'subscribeDate'].includes(fieldType)) {
      return [...commonOperators, ...dateOperators];
    }

    return commonOperators;
  };

  const addRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: '',
      type: 'and'
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, ...updates } : rule));
    // Simulate count update
    setEstimatedCount(Math.floor(Math.random() * 5000) + 100);
  };

  const removeRule = (id: string) => {
    if (rules.length > 1) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  const handleSave = () => {
    const segment = {
      name: segmentName,
      description,
      rules,
      estimatedCount
    };
    console.log('Creating segment:', segment);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Smart Segment Builder</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex">
            {/* Sidebar - Field Categories */}
            <div className="w-80 bg-gray-50 border-r border-gray-200">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Available Fields</h3>
                <div className="space-y-4">
                  {fieldOptions.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 text-gray-500" />
                          <h4 className="text-sm font-medium text-gray-700">{category.category}</h4>
                        </div>
                        <div className="space-y-1 ml-6">
                          {category.fields.map((field) => (
                            <button
                              key={field.value}
                              className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                              onClick={() => {
                                const emptyRule = rules.find(r => !r.field);
                                if (emptyRule) {
                                  updateRule(emptyRule.id, { field: field.value });
                                } else {
                                  addRule();
                                }
                              }}
                            >
                              {field.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="p-6 space-y-6">
                {/* Segment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Segment Name
                    </label>
                    <input
                      type="text"
                      value={segmentName}
                      onChange={(e) => setSegmentName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter segment name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Describe this segment..."
                    />
                  </div>
                </div>

                {/* Rules Builder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Segment Conditions</h3>
                    <div className="bg-purple-50 px-3 py-1 rounded-full">
                      <span className="text-sm text-purple-700">
                        Estimated: {estimatedCount.toLocaleString()} subscribers
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Include subscribers who match:
                    </p>

                    <div className="space-y-3">
                      {rules.map((rule, index) => (
                        <div key={rule.id} className="space-y-3">
                          {index > 0 && (
                            <div className="flex items-center">
                              <select
                                value={rule.type}
                                onChange={(e) => updateRule(rule.id, { type: e.target.value as 'and' | 'or' })}
                                className="px-2 py-1 border border-gray-300 rounded text-sm font-medium bg-white"
                              >
                                <option value="and">AND</option>
                                <option value="or">OR</option>
                              </select>
                            </div>
                          )}

                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-12 gap-3 items-center">
                              <div className="col-span-4">
                                <select
                                  value={rule.field}
                                  onChange={(e) => updateRule(rule.id, { field: e.target.value, operator: '', value: '' })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                  <option value="">Select field...</option>
                                  {fieldOptions.map((category) =>
                                    category.fields.map((field) => (
                                      <option key={field.value} value={field.value}>
                                        {field.label}
                                      </option>
                                    ))
                                  )}
                                </select>
                              </div>

                              <div className="col-span-3">
                                <select
                                  value={rule.operator}
                                  onChange={(e) => updateRule(rule.id, { operator: e.target.value, value: '' })}
                                  disabled={!rule.field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                                >
                                  <option value="">Operator...</option>
                                  {rule.field && getOperatorOptions(rule.field).map((op) => (
                                    <option key={op.value} value={op.value}>
                                      {op.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-span-4">
                                <input
                                  type="text"
                                  value={rule.value}
                                  onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                                  disabled={!rule.operator}
                                  placeholder="Enter value..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                                />
                              </div>

                              <div className="col-span-1">
                                <button
                                  onClick={() => removeRule(rule.id)}
                                  disabled={rules.length === 1}
                                  className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addRule}
                      className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Condition
                    </button>
                  </div>
                </div>

                {/* Preview */}
                {estimatedCount > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <h4 className="font-medium text-purple-900">Segment Preview</h4>
                    </div>
                    <p className="text-purple-700 mt-2">
                      This segment will include approximately <strong>{estimatedCount.toLocaleString()}</strong> subscribers
                      based on your current conditions. The actual count may vary as your data updates.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!segmentName || rules.every(r => !r.field)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Create Segment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentBuilder;