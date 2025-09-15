import React, { useState } from 'react';
import { Plus, Users, Filter, Search, Upload, Download, Target, Zap } from 'lucide-react';
import AudienceCard from './AudienceCard';
import CreateAudienceModal from './CreateAudienceModal';
import ImportAudienceModal from './ImportAudienceModal';
import SegmentBuilder from './SegmentBuilder';

const audiences = [
  {
    id: 1,
    name: 'All Subscribers',
    description: 'Complete list of all active subscribers',
    count: 12847,
    type: 'static',
    growth: '+5.2%',
    lastUpdated: '2024-01-20T10:30:00Z',
    tags: ['all', 'active'],
    engagementRate: 24.8
  },
  {
    id: 2,
    name: 'High-Value Customers',
    description: 'Customers who have spent over $500 in the last 6 months',
    count: 1847,
    type: 'dynamic',
    growth: '+12.4%',
    lastUpdated: '2024-01-20T14:15:00Z',
    tags: ['premium', 'high-value'],
    engagementRate: 45.2
  },
  {
    id: 3,
    name: 'New Subscribers (Last 30 Days)',
    description: 'Users who subscribed in the past month',
    count: 543,
    type: 'dynamic',
    growth: '+18.7%',
    lastUpdated: '2024-01-20T16:00:00Z',
    tags: ['new', 'recent'],
    engagementRate: 52.1
  },
  {
    id: 4,
    name: 'Newsletter Enthusiasts',
    description: 'Subscribers with high newsletter engagement rates',
    count: 2934,
    type: 'behavioral',
    growth: '+3.1%',
    lastUpdated: '2024-01-20T09:45:00Z',
    tags: ['engaged', 'newsletter'],
    engagementRate: 67.8
  },
  {
    id: 5,
    name: 'Abandoned Cart Users',
    description: 'Users who added items to cart but didn\'t complete purchase',
    count: 827,
    type: 'behavioral',
    growth: '-2.3%',
    lastUpdated: '2024-01-20T11:20:00Z',
    tags: ['abandoned-cart', 'retargeting'],
    engagementRate: 31.4
  }
];

const audienceTypes = {
  static: { label: 'Static List', color: 'bg-gray-100 text-gray-800', icon: Users },
  dynamic: { label: 'Smart Segment', color: 'bg-blue-100 text-blue-800', icon: Target },
  behavioral: { label: 'Behavioral', color: 'bg-purple-100 text-purple-800', icon: Zap }
};

const Audiences: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false);
  const [selectedAudiences, setSelectedAudiences] = useState<number[]>([]);

  const filteredAudiences = audiences.filter(audience => {
    const matchesSearch = audience.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audience.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audience.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || audience.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for audiences:`, selectedAudiences);
    setSelectedAudiences([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audiences</h1>
          <p className="text-gray-600 mt-1">Manage and segment your subscribers</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button
            onClick={() => setShowSegmentBuilder(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
          >
            <Target className="w-4 h-4 mr-2" />
            Create Segment
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Audience
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">12,847</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Segments</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Behavioral Audiences</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Filter className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
              <p className="text-2xl font-bold text-gray-900">38.4%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search audiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="static">Static Lists</option>
              <option value="dynamic">Smart Segments</option>
              <option value="behavioral">Behavioral</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAudiences.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedAudiences.length} audiences selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAudiences.map((audience) => (
          <AudienceCard
            key={audience.id}
            audience={audience}
            audienceType={audienceTypes[audience.type]}
            isSelected={selectedAudiences.includes(audience.id)}
            onSelect={(selected) => {
              if (selected) {
                setSelectedAudiences([...selectedAudiences, audience.id]);
              } else {
                setSelectedAudiences(selectedAudiences.filter(id => id !== audience.id));
              }
            }}
          />
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateAudienceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // Refresh audiences list
          }}
        />
      )}

      {showImportModal && (
        <ImportAudienceModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            // Refresh audiences list
          }}
        />
      )}

      {showSegmentBuilder && (
        <SegmentBuilder
          onClose={() => setShowSegmentBuilder(false)}
          onSuccess={() => {
            setShowSegmentBuilder(false);
            // Refresh audiences list
          }}
        />
      )}
    </div>
  );
};

export default Audiences;