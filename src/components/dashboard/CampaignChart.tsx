import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan 1', sent: 1200, opened: 720, clicked: 144 },
  { date: 'Jan 2', sent: 1450, opened: 870, clicked: 174 },
  { date: 'Jan 3', sent: 1100, opened: 660, clicked: 132 },
  { date: 'Jan 4', sent: 1600, opened: 960, clicked: 192 },
  { date: 'Jan 5', sent: 1350, opened: 810, clicked: 162 },
  { date: 'Jan 6', sent: 1800, opened: 1080, clicked: 216 },
  { date: 'Jan 7', sent: 1550, opened: 930, clicked: 186 },
];

const CampaignChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
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
        <Area
          type="monotone"
          dataKey="sent"
          stackId="1"
          stroke="#3b82f6"
          fill="#dbeafe"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="opened"
          stackId="2"
          stroke="#10b981"
          fill="#d1fae5"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="clicked"
          stackId="3"
          stroke="#f59e0b"
          fill="#fef3c7"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CampaignChart;