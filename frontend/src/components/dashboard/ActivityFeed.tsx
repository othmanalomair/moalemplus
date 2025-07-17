'use client';

import { useEffect, useState } from 'react';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'test' | 'student' | 'class' | 'message' | 'success' | 'warning';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  iconColor: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockActivities: Activity[] = [
          {
            id: '1',
            type: 'test',
            title: 'اختبار الرياضيات',
            description: 'تم إنشاء اختبار جديد للصف الخامس',
            time: 'منذ 10 دقائق',
            icon: <DocumentTextIcon className="h-5 w-5" />,
            iconColor: 'bg-blue-600'
          },
          {
            id: '2',
            type: 'student',
            title: 'طالب جديد',
            description: 'انضم أحمد محمد إلى فصل اللغة العربية',
            time: 'منذ 30 دقيقة',
            icon: <UserGroupIcon className="h-5 w-5" />,
            iconColor: 'bg-green-600'
          },
          {
            id: '3',
            type: 'success',
            title: 'اكتمال الحضور',
            description: 'تم تسجيل حضور جميع الطلاب للحصة الأولى',
            time: 'منذ ساعة',
            icon: <CheckCircleIcon className="h-5 w-5" />,
            iconColor: 'bg-green-600'
          },
          {
            id: '4',
            type: 'class',
            title: 'حصة العلوم',
            description: 'تم بدء حصة العلوم للصف الرابع',
            time: 'منذ ساعتين',
            icon: <AcademicCapIcon className="h-5 w-5" />,
            iconColor: 'bg-purple-600'
          },
          {
            id: '5',
            type: 'message',
            title: 'رسالة جديدة',
            description: 'رسالة من ولي أمر الطالب سارة أحمد',
            time: 'منذ 3 ساعات',
            icon: <ChatBubbleLeftIcon className="h-5 w-5" />,
            iconColor: 'bg-yellow-600'
          },
          {
            id: '6',
            type: 'warning',
            title: 'تذكير مهم',
            description: 'موعد تسليم تقرير الدرجات غداً',
            time: 'منذ 4 ساعات',
            icon: <ExclamationCircleIcon className="h-5 w-5" />,
            iconColor: 'bg-red-600'
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            النشاطات الأخيرة
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          النشاطات الأخيرة
        </h3>
        <p className="text-sm text-gray-500">
          آخر الأحداث والتحديثات
        </p>
      </div>
      
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.iconColor}`}>
                  <div className="text-white">
                    {activity.icon}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {activity.time}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          عرض جميع النشاطات
        </button>
      </div>
    </div>
  );
}