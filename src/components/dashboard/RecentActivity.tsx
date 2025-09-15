import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const activities = [
  {
    id: 1,
    type: 'campaign_sent',
    message: 'Campaign "Summer Sale 2024" sent to 4,283 subscribers',
    time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    status: 'success'
  },
  {
    id: 2,
    type: 'audience_created',
    message: 'New audience "High-Value Customers" created with 1,847 subscribers',
    time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'info'
  },
  {
    id: 3,
    type: 'campaign_paused',
    message: 'Campaign "Product Launch" paused due to high unsubscribe rate',
    time: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    status: 'warning'
  },
  {
    id: 4,
    type: 'template_created',
    message: 'New email template "Modern Newsletter" created',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'success'
  },
  {
    id: 5,
    type: 'automation_triggered',
    message: 'Welcome automation triggered for 23 new subscribers',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'info'
  }
];

const statusColors = {
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800'
};

const RecentActivity: React.FC = () => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    statusColors[activity.status]
                  }`}>
                    <div className="w-2 h-2 bg-current rounded-full" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">{activity.message}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDistanceToNow(activity.time, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;