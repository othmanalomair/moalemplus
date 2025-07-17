import DashboardHome from '@/components/dashboard/DashboardHome';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}

export const metadata = {
  title: 'لوحة التحكم - معلم+',
  description: 'لوحة تحكم المعلم في منصة معلم+',
};