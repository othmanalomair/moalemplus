'use client';

import { useEffect, useState } from 'react';
import { 
  ClockIcon, 
  UserGroupIcon, 
  CalendarIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline';

interface UpcomingClass {
  id: string;
  subject: string;
  className: string;
  time: string;
  duration: string;
  studentCount: number;
  room: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

export default function UpcomingClasses() {
  const [classes, setClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingClasses = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 700));
        
        const mockClasses: UpcomingClass[] = [
          {
            id: '1',
            subject: 'الرياضيات',
            className: 'الصف الخامس - أ',
            time: '09:00 ص',
            duration: '45 دقيقة',
            studentCount: 28,
            room: 'فصل 201',
            status: 'upcoming'
          },
          {
            id: '2',
            subject: 'اللغة العربية',
            className: 'الصف الرابع - ب',
            time: '10:00 ص',
            duration: '45 دقيقة',
            studentCount: 25,
            room: 'فصل 105',
            status: 'upcoming'
          },
          {
            id: '3',
            subject: 'العلوم',
            className: 'الصف السادس - أ',
            time: '11:00 ص',
            duration: '45 دقيقة',
            studentCount: 30,
            room: 'مختبر العلوم',
            status: 'upcoming'
          },
          {
            id: '4',
            subject: 'التربية الإسلامية',
            className: 'الصف الثالث - ج',
            time: '12:00 م',
            duration: '45 دقيقة',
            studentCount: 22,
            room: 'فصل 302',
            status: 'upcoming'
          }
        ];
        
        setClasses(mockClasses);
      } catch (error) {
        console.error('Error loading upcoming classes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingClasses();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'قادمة';
      case 'in-progress':
        return 'جارية';
      case 'completed':
        return 'مكتملة';
      default:
        return 'غير محدد';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            الحصص القادمة
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          الحصص القادمة
        </h3>
        <p className="text-sm text-gray-500">
          جدول الحصص لليوم
        </p>
      </div>
      
      <div className="p-6">
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              لا توجد حصص قادمة
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              لا توجد حصص مجدولة لبقية اليوم
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium text-gray-900">
                      {classItem.subject}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(classItem.status)}`}>
                      {getStatusText(classItem.status)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 ml-1" />
                    {classItem.time}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <UserGroupIcon className="h-4 w-4 ml-1" />
                      {classItem.className}
                    </div>
                    <div className="text-gray-500">
                      {classItem.studentCount} طالب
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-4 w-4 ml-1" />
                      {classItem.room}
                    </div>
                    <div className="text-gray-500">
                      {classItem.duration}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    بدء الحصة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          عرض الجدول الكامل
        </button>
      </div>
    </div>
  );
}