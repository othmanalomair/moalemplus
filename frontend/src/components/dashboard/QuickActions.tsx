'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface QuickAction {
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
  href: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          إجراءات سريعة
        </h3>
        <p className="text-sm text-gray-500">
          الوصول السريع للميزات الأكثر استخداماً
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="relative group bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
          >
            <div>
              <span className={`inline-flex items-center justify-center p-3 rounded-lg ${action.color}`}>
                <div className="h-6 w-6 text-white">
                  {action.icon}
                </div>
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                {action.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {action.description}
              </p>
            </div>
            <span
              className="absolute top-6 left-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}