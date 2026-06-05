import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './MoodChart.css';

const MoodChart = ({ data }) => {
  // تحويل البيانات إلى صيغة مناسبة للرسم البياني
  const chartData = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
    }),
    mood: entry.mood,
    note: entry.note || '',
  }));

  return (
    <div className="mood-chart">
      <h2 className="chart-title">الرسم البياني للحالة المزاجية</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[0, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 14 }}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#667eea', strokeWidth: 2 }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="mood"
            name="المزاج"
            stroke="#667eea"
            strokeWidth={3}
            dot={{ r: 6, fill: '#667eea' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{data.date}</p>
        <p className="tooltip-mood">المزاج: {data.mood}/5</p>
        {data.note && <p className="tooltip-note">ملاحظة: {data.note}</p>}
      </div>
    );
  }
  return null;
};

export default MoodChart;
