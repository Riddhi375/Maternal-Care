import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MetricDataPoint } from '../../data/mockData';
import { HealthMetricType } from '../../types';

export interface HealthMetricChartProps {
  type: HealthMetricType;
  data: MetricDataPoint[];
  timeframe: '24h' | '7d' | '30d';
  unit: string;
}

export const HealthMetricChart: React.FC<HealthMetricChartProps> = ({
  type,
  data,
  timeframe,
  unit,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center bg-[#FAF6FE] rounded-2xl border border-dashed border-[#DCBEEF] text-[#766C82] text-xs">
        <p>No sensor readings available for this interval.</p>
        <span className="text-[11px] text-[#A77FD3] mt-1">Connect device to view timeline</span>
      </div>
    );
  }

  const getMetricConfig = () => {
    switch (type) {
      case 'heartRate':
        return {
          dataKey: 'heartRate',
          color: '#D95783',
          fill: '#F7DCE8',
          domain: [55, 120],
          name: 'Heart Rate',
        };
      case 'spo2':
        return {
          dataKey: 'spo2',
          color: '#36866A',
          fill: '#E8F5F0',
          domain: [90, 100],
          name: 'SpO2 Oxygen',
        };
      case 'temperature':
        return {
          dataKey: 'temperature',
          color: '#D58A35',
          fill: '#FDF5EC',
          domain: [97, 101],
          name: 'Body Temp',
        };
      case 'movement':
        return {
          dataKey: 'movement',
          color: '#8B5FBF',
          fill: '#EDE3F7',
          domain: [0, 'auto'],
          name: 'Fetal Movements',
        };
      case 'bloodPressure':
        return {
          dataKey: 'systolic',
          secondaryKey: 'diastolic',
          color: '#503477',
          domain: [60, 150],
          name: 'Blood Pressure',
        };
      default:
        return {
          dataKey: 'heartRate',
          color: '#8B5FBF',
          fill: '#EDE3F7',
          domain: ['auto', 'auto'],
          name: 'Metric',
        };
    }
  };

  const config = getMetricConfig();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#EDE3F7] shadow-soft text-xs">
          <p className="font-bold text-[#503477] mb-1">
            {timeframe === '24h' ? `Time: ${label}` : label}
          </p>
          {type === 'bloodPressure' ? (
            <div className="space-y-0.5">
              <p className="text-[#503477] font-semibold">
                Systolic: <span className="font-bold">{payload[0]?.value}</span> mmHg
              </p>
              <p className="text-[#8B5FBF] font-semibold">
                Diastolic: <span className="font-bold">{payload[1]?.value}</span> mmHg
              </p>
            </div>
          ) : (
            <p className="font-semibold text-[#29213A]">
              {config.name}: <span className="text-[#8B5FBF] font-bold">{payload[0]?.value}</span> {unit}
            </p>
          )}
          {payload[0]?.payload?.status && (
            <p className="text-[10px] text-[#766C82] mt-1 pt-1 border-t border-[#F6F0FC]">
              State: {payload[0]?.payload?.status}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (type === 'bloodPressure') {
    return (
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F6F0FC" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#766C82' }}
              tickLine={false}
              axisLine={{ stroke: '#EDE3F7' }}
            />
            <YAxis
              domain={[60, 140]}
              tick={{ fontSize: 11, fill: '#766C82' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="systolic"
              name="Systolic"
              stroke="#503477"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#503477' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              name="Diastolic"
              stroke="#D95783"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#D95783' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-56 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={config.color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F6F0FC" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#766C82' }}
            tickLine={false}
            axisLine={{ stroke: '#EDE3F7' }}
          />
          <YAxis
            domain={config.domain as any}
            tick={{ fontSize: 11, fill: '#766C82' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#grad-${type})`}
            dot={{ r: 2.5, fill: config.color }}
            activeDot={{ r: 5, fill: config.color, stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
