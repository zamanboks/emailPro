import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Trash2, 
  Copy,
  MoreHorizontal,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Menu } from '@headlessui/react';

const campaigns = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    status: 'active',
    subject: '🌞 Summer Sale: Up to 50% Off Everything!',
    audience: 'All Subscribers',
    audienceCount: 4283,
    sent: 4283,
    opened: 1216,
    clicked: 223,
    openRate: 28.4,
    clickRate: 5.2,
    createdAt: '2024-01-15T10:00:00Z',
    sentAt: '2024-01-15T14:30:00Z',
    type: 'regular'
  },
  {
    id: 2,
    name: 'Product Launch Announcement',
    status: 'completed',
    subject: 'Introducing Our Revolutionary New Product',
    audience: 'Premium Customers',
    audienceCount: 2847,
    sent: 2847,
    opened: 902,
    clicked: 194,
    openRate: 31.7,
    clickRate: 6.8,
    createdAt: '2024-01-10T09:00:00Z',
    sentAt: '2024-01-10T16:00:00Z',
    type: 'regular'
  },
  {
    id: 3,
    name: 'Weekly Newsletter #42',
    status: 'draft',
    subject: 'This Week in Tech: AI Breakthroughs',
    audience: 'Newsletter Subscribers',
    audienceCount: 8392,
    sent: 0,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: '2024-01-20T11:00:00Z',
    sentAt: null,
    type: 'newsletter'
  },
  {
    id: 4,
    name: 'Welcome Series - Email 1',
    status: 'active',
    subject: 'Welcome to Our Community! 🎉',
    audience: 'New Subscribers',
    audienceCount: 1284,
    sent: 1284,
    opened: 586,
    clicked: 158,
    openRate: 45.6,
    clickRate: 12.3,
    createdAt: '2024-01-05T08:00:00Z',
    sentAt: '2024-01-05T12:00:00Z',
    type: 'automation'
  }
];

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
  active: { color: 'bg-green-100 text-green-800', label: 'Active' },
  paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
  completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
  stopped: { color: 'bg-red-100 text-red-800', label: 'Stopped' }
};

const typeConfig = {
  regular: { color: 'bg-blue-50 text-blue-700', label: 'Regular' },
  automation: { color: 'bg-purple-50 text-purple-700', label: 'Automation' },
  newsletter: { color: 'bg-green-50 text-green-700', label: 'Newsletter' },
  'a/b-test': { color: 'bg-orange-50 text-orange-700', label: 'A/B Test' }
};

const Campaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for campaigns:`, selectedCampaigns);
    setSelectedCampaigns([]);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not sent';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage your email campaigns</p>
        </div>
        <Link
          to="/campaigns/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCampaigns.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedCampaigns.length} campaigns selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('pause')}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Pause
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

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCampaigns(campaigns.map(c => c.id));
                      } else {
                        setSelectedCampaigns([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                        } else {
                          setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{campaign.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[campaign.status].color}`}>
                          {statusConfig[campaign.status].label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig[campaign.type].color}`}>
                          {typeConfig[campaign.type].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{campaign.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{campaign.audience}</div>
                      <div className="text-gray-500">{campaign.audienceCount.toLocaleString()} subscribers</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {campaign.sent > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-gray-900">{campaign.openRate}%</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-gray-900">{campaign.clickRate}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {campaign.opened.toLocaleString()} opens, {campaign.clicked.toLocaleString()} clicks
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not sent</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(campaign.sentAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'draft' && (
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Start Campaign">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {campaign.status === 'active' && (
                        <button className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors" title="Pause Campaign">
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {(campaign.status === 'active' || campaign.status === 'paused') && (
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Stop Campaign">
                          <Square className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        to={`/campaigns/edit/${campaign.id}`}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Menu as="div" className="relative">
                        <Menu.Button className="p-1 text-gray-400 hover:bg-gray-50 rounded transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button className={`${active ? 'bg-gray-100' : ''} flex items-center w-full px-4 py-2 text-sm text-gray-700`}>
                                  <Eye className="w-4 h-4 mr-3" />
                                  View Details
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button className={`${active ? 'bg-gray-100' : ''} flex items-center w-full px-4 py-2 text-sm text-gray-700`}>
                                  <Copy className="w-4 h-4 mr-3" />
                                  Duplicate
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button className={`${active ? 'bg-gray-100' : ''} flex items-center w-full px-4 py-2 text-sm text-red-600`}>
                                  <Trash2 className="w-4 h-4 mr-3" />
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;