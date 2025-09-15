import React from 'react';
import { TrendingUp, Eye, MousePointer, Users } from 'lucide-react';

const campaigns = [
  {
    name: 'Summer Sale 2024',
    status: 'active',
    openRate: '28.4%',
    clickRate: '5.2%',
    subscribers: '4,283',
    trend: 'up'
  },
  {
    name: 'Product Launch',
    status: 'completed',
    openRate: '31.7%',
    clickRate: '6.8%',
    subscribers: '2,847',
    trend: 'up'
  },
  {
    name: 'Weekly Newsletter',
    status: 'active',
    openRate: '22.1%',
    clickRate: '3.4%',
    subscribers: '8,392',
    trend: 'down'
  },
  {
    name: 'Welcome Series',
    status: 'active',
    openRate: '45.6%',
    clickRate: '12.3%',
    subscribers: '1,284',
    trend: 'up'
  }
];

const TopCampaigns: React.FC = () => {
  return (
    <div className="space-y-4">
      {campaigns.map((campaign, index) => (
        <div key={campaign.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h4 className="font-medium text-gray-900">{campaign.name}</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                campaign.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {campaign.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {campaign.openRate}
              </div>
              <div className="flex items-center">
                <MousePointer className="w-4 h-4 mr-1" />
                {campaign.clickRate}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {campaign.subscribers}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <TrendingUp className={`w-5 h-5 ${
              campaign.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCampaigns;