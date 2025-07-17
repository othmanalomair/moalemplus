'use client';

import { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  PlusIcon,
  PlayIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import ActivityFeed from './ActivityFeed';
import UpcomingClasses from './UpcomingClasses';

interface DashboardStats {
  totalStudents: number;
  activeClasses: number;
  upcomingTests: number;
  attendanceRate: number;
}

export default function DashboardHome() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeClasses: 0,
    upcomingTests: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalStudents: 156,
          activeClasses: 8,
          upcomingTests: 3,
          attendanceRate: 87.5
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'إجمالي الطلاب',
      value: stats.totalStudents,
      icon: <UserGroupIcon />,
      change: { type: 'increase' as const, value: '+12' },
      description: 'طالب جديد هذا الشهر'
    },
    {
      title: 'الفصول النشطة',
      value: stats.activeClasses,
      icon: <AcademicCapIcon />,
      change: { type: 'neutral' as const, value: '0' },
      description: 'فصول مفعلة'
    },
    {
      title: 'الاختبارات القادمة',
      value: stats.upcomingTests,
      icon: <DocumentTextIcon />,
      change: { type: 'increase' as const, value: '+1' },
      description: 'اختبار جديد هذا الأسبوع'
    },
    {
      title: 'نسبة الحضور',
      value: `${stats.attendanceRate}%`,
      icon: <ChartBarIcon />,
      change: { type: 'increase' as const, value: '+2.3%' },
      description: 'متوسط الحضور'
    }
  ];

  const quickActions = [
    {
      name: 'إنشاء اختبار سريع',
      description: 'إنشاء اختبار جديد للطلاب',
      icon: <PlusIcon />,
      color: 'bg-blue-600',
      href: '/tests/create'
    },
    {
      name: 'بدء حصة',
      description: 'بدء حصة دراسية جديدة',
      icon: <PlayIcon />,
      color: 'bg-green-600',
      href: '/classes/start'
    },
    {
      name: 'تسجيل حضور',
      description: 'تسجيل حضور الطلاب',
      icon: <ClipboardDocumentCheckIcon />,
      color: 'bg-yellow-600',
      href: '/attendance'
    },
    {
      name: 'إرسال رسالة',
      description: 'إرسال رسالة لأولياء الأمور',
      icon: <ChatBubbleLeftIcon />,
      color: 'bg-purple-600',
      href: '/messages/compose'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {user?.full_name?.charAt(0) || 'م'}
              </span>
            </div>
          </div>
          <div className="mr-4">
            <h1 className="text-2xl font-bold text-white">
              مرحباً، {user?.full_name || 'المعلم'}
            </h1>
            <p className="text-blue-100">
              {new Date().toLocaleDateString('ar-KW', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            change={card.change}
            description={card.description}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <UpcomingClasses />
        </div>
        <div className="space-y-6">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}