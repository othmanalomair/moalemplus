import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  مرحباً بك في لوحة التحكم
                </h1>
                <p className="text-gray-600">
                  هذه صفحة محمية تتطلب تسجيل الدخول
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export const metadata = {
  title: 'لوحة التحكم - معلم+',
  description: 'لوحة تحكم المعلم في منصة معلم+',
};