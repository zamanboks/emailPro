import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Edit, 
  Copy, 
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { Menu } from '@headlessui/react';

interface AudienceCardProps {
  audience: {
    id: number;
    name: string;
    description: string;
    count: number;
    type: string;
    growth: string;
    lastUpdated: string;
    tags: string[];
    engagementRate: number;
  };
  audienceType: {
    label: string;
    color: string;
    icon: React.ElementType;
  };
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

const AudienceCard: React.FC<AudienceCardProps> = ({ 
  audience, 
  audienceType, 
  isSelected, 
  onSelect 
}) => {
  const isGrowthPositive = !audience.growth.startsWith('-');
  const IconComponent = audienceType.icon;

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className={`p-2 rounded-lg ${audienceType.color.replace('text-', 'bg-').replace('800', '100')}`}>
              <IconComponent className={`w-5 h-5 ${audienceType.color}`} />
            </div>
          </div>
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors">
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
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Audience
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
                    <button className={`${active ? 'bg-gray-100' : ''} flex items-center w-full px-4 py-2 text-sm text-gray-700`}>
                      <Download className="w-4 h-4 mr-3" />
                      Export
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

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{audience.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{audience.description}</p>
          </div>

          {/* Type and Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${audienceType.color}`}>
              {audienceType.label}
            </span>
            {audience.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
            {audience.tags.length > 2 && (
              <span className="text-xs text-gray-400">
                +{audience.tags.length - 2} more
              </span>
            )}
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {audience.count.toLocaleString()}
              </span>
              <div className={`flex items-center text-sm ${
                isGrowthPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isGrowthPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {audience.growth}
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Engagement Rate</span>
                <span className="font-medium">{audience.engagementRate}%</span>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(audience.engagementRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-400 border-t pt-3">
            Updated {formatDistanceToNow(new Date(audience.lastUpdated), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceCard;