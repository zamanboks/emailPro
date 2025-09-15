import React, { useState } from 'react';
import { 
  TrendingUp, 
  Mail, 
  Eye, 
  MousePointer, 
  Users, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('opens');

  const performanceData = [
    { date: '2024-01-14', sent: 1200, opens: 360, clicks: 72, unsubscribes: 3 },
    { date: '2024-01-15', sent: 1450, opens: 435, clicks: 87, unsubscribes: 5 },
    { date: '2024-01-16', sent: 1100, opens: 330, clicks: 66, unsubscribes: 2 },
    { date: '2024-01-17', sent: 1600, opens: 480, clicks: 96, unsubscribes: 4 },
    { date: '2024-01-18', sent: 1350, opens: 405, clicks: 81, unsubscribes: 3 },
    { date: '2024-01-19', sent: 1800, opens: 540, clicks: 108, unsubscribes: 6 },
    { date: '2024-01-20', sent: 1550, opens: 465, clicks: 93, unsubscribes: 4 }
  ];

  const campaignData = [
    { name: 'Summer Sale 2024', opens: 1216, clicks: 223, sent: 4283, rate: 28.4 },
    { name: 'Product Launch', opens: 902, clicks: 194, sent: 2847, rate: 31.7 },
    { name: 'Weekly Newsletter', opens: 1854, clicks: 285, sent: 8392, rate: 22.1 },
    { name: 'Welcome Series', opens: 586, clicks: 158, sent: 1284, rate: 45.6 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 42, color: '#10B981' },
    { name: 'Tablet', value: 13, color: '#F59E0B' }
  ];

  const audienceGrowth = [
    { month: 'Jul', subscribers: 8420, unsubscribed: 45 },
    { month: 'Aug', subscribers: 9180, unsubscribed: 38 },
    { month: 'Sep', subscribers: 9850, unsubscribed: 52 },
    { month: 'Oct', subscribers: 10680, unsubscribed: 41 },
    { month: 'Nov', subscribers: 11420, unsubscribed: 49 },
    { month: 'Dec', subscribers: 12150, unsubscribed: 56 },
    { month: 'Jan', subscribers: 12847, unsubscribed: 43 }
  ];

  const topPerformingCampaigns = [
    { name: 'Welcome Series - Email 1', openRate: 45.6, clickRate: 12.3, revenue: 2840 },
    { name: 'Product Launch Announcement', openRate: 31.7, clickRate: 6.8, revenue: 5620 },
    { name: 'Summer Sale 2024', openRate: 28.4, clickRate: 5.2, revenue: 8950 },
    { name: 'Weekly Newsletter #42', openRate: 22.1, clickRate: 3.4, revenue: 1200 }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '12m', label: 'Last 12 months' }
  ];

  const metrics = [
    {
      title: 'Total Emails Sent',
      value: '125,847',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Mail,
      color: 'blue'
    },
    {
      title: 'Average Open Rate',
      value: '24.8%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'green'
    },
    {
      title: 'Average Click Rate',
      value: '4.2%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: MousePointer,
      color: 'purple'
    },
    {
      title: 'Active Subscribers',
      value: '12,847',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your email campaign performance and subscriber engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div key={metric.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    metric.changeType === 'positive' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metric.change}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[metric.color]}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Email Performance Over Time</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="opens">Opens</option>
              <option value="clicks">Clicks</option>
              <option value="sent">Sent</option>
              <option value="unsubscribes">Unsubscribes</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#3b82f6"
              fill="#dbeafe"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign Performance and Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                width={120}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="opens" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: device.color }}
                />
                <span className="text-sm text-gray-600">
                  {device.name} ({device.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audience Growth and Top Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Growth */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Audience Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={audienceGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="subscribers"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Campaigns */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Campaigns</h3>
          <div className="space-y-4">
            {topPerformingCampaigns.map((campaign, index) => (
              <div key={campaign.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{campaign.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {campaign.openRate}%
                    </span>
                    <span className="flex items-center">
                      <MousePointer className="w-3 h-3 mr-1" />
                      {campaign.clickRate}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${campaign.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;