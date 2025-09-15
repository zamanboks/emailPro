import React from 'react';
import { Mail, Users, TrendingUp, Clock, ArrowUp, ArrowDown, Eye, MousePointer } from 'lucide-react';
import MetricCard from './MetricCard';
import RecentActivity from './RecentActivity';
import CampaignChart from './CampaignChart';
import TopCampaigns from './TopCampaigns';

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Total Campaigns',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Mail,
      color: 'blue'
    },
    {
      title: 'Active Subscribers',
      value: '12,847',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Open Rate',
      value: '24.8%',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Eye,
      color: 'purple'
    },
    {
      title: 'Click Rate',
      value: '4.2%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: MousePointer,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your campaigns.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Performance</h3>
          <CampaignChart />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Campaigns</h3>
          <TopCampaigns />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;