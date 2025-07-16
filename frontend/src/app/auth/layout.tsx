import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المصادقة - معلم+',
  description: 'تسجيل الدخول وإنشاء الحساب في منصة معلم+ التعليمية',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}