'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    type: 'increase' | 'decrease' | 'neutral';
    value: string;
  };
  description?: string;
  onClick?: () => void;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  description, 
  onClick 
}: StatsCardProps) {
  const changeColor = change?.type === 'increase' 
    ? 'text-green-600' 
    : change?.type === 'decrease' 
    ? 'text-red-600' 
    : 'text-gray-600';

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6
        ${onClick ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
      `}
    >
      <div>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <div className="h-5 w-5 text-white">
                {icon}
              </div>
            </div>
          </div>
          <div className="mr-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
        
        {(change || description) && (
          <div className="mt-4 flex items-center justify-between">
            {change && (
              <div className={`flex items-center text-sm ${changeColor}`}>
                <span className="font-medium">{change.value}</span>
                <span className="mr-2 text-gray-500">من الشهر الماضي</span>
              </div>
            )}
            {description && (
              <p className="text-sm text-gray-500 truncate">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </Component>
  );
}