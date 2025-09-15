import React, { useState } from 'react';
import { Plus, Search, Filter, Copy, Edit, Trash2, Eye, Star } from 'lucide-react';

const templates = [
  {
    id: 1,
    name: 'Welcome Series - Email 1',
    description: 'Perfect introduction for new subscribers',
    category: 'Welcome',
    thumbnail: '/api/placeholder/300/200',
    rating: 4.8,
    uses: 142,
    createdAt: '2024-01-15',
    isPopular: true
  },
  {
    id: 2,
    name: 'Product Launch Announcement',
    description: 'Showcase your latest products with style',
    category: 'Product',
    thumbnail: '/api/placeholder/300/200',
    rating: 4.6,
    uses: 89,
    createdAt: '2024-01-12',
    isPopular: true
  },
  {
    id: 3,
    name: 'Newsletter - Tech Focus',
    description: 'Clean newsletter design for tech content',
    category: 'Newsletter',
    thumbnail: '/api/placeholder/300/200',
    rating: 4.5,
    uses: 201,
    createdAt: '2024-01-10',
    isPopular: false
  },
  {
    id: 4,
    name: 'Holiday Sale Promotion',
    description: 'Eye-catching design for seasonal sales',
    category: 'Promotional',
    thumbnail: '/api/placeholder/300/200',
    rating: 4.7,
    uses: 156,
    createdAt: '2024-01-08',
    isPopular: true
  },
  {
    id: 5,
    name: 'Event Invitation',
    description: 'Elegant template for event invitations',
    category: 'Event',
    thumbnail: '/api/placeholder/300/200',
    rating: 4.4,
    uses: 73,
    createdAt: '2024-01-05',
    isPopular: false
  },
  {
    id: 6,
    name: 'Abandoned Cart Recovery',
    description: 'Win back customers with gentle reminders',
    category: 'Transactional',
    thumbnail: '/api/placeholder/300/200',
    rating: 4.9,
    uses: 287,
    createdAt: '2024-01-03',
    isPopular: true
  }
];

const categories = [
  'All',
  'Welcome',
  'Newsletter',
  'Promotional',
  'Product',
  'Event',
  'Transactional'
];

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.uses - a.uses;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1">Choose from our collection of professionally designed templates</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-w-4 aspect-h-3 bg-gray-100">
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {template.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Template Preview</p>
                </div>
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full text-gray-600 hover:text-green-600 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full text-gray-600 hover:text-orange-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              {/* Popular Badge */}
              {template.isPopular && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </span>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {template.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                  {template.name}
                </h3>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span>{template.rating}</span>
                  </div>
                  <div>
                    {template.uses} uses
                  </div>
                </div>
                <div>
                  {new Date(template.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4">
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                  Use Template
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Templates;