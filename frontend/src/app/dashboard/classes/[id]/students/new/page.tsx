'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Hash, Calendar, MapPin, Flag } from 'lucide-react';
import { studentApi, classApi } from '@/lib/api/classes';
import { CreateStudentRequest, Class } from '@/types/class';

interface NewStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NewStudentPage({ params }: NewStudentPageProps) {
  const [id, setId] = useState<string>('');
  const [classData, setClassData] = useState<Class | null>(null);
  const [formData, setFormData] = useState<CreateStudentRequest>({
    student_number: '',
    civil_id: '',
    first_name: '',
    last_name: '',
    arabic_name: '',
    date_of_birth: '',
    gender: 'male',
    nationality: 'الكويت',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchClassData = useCallback(async () => {
    try {
      const data = await classApi.getClass(id);
      setClassData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class data');
    }
  }, [id]);

  useEffect(() => {
    const initializeId = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    initializeId();
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchClassData();
    }
  }, [id, fetchClassData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      await studentApi.createStudent(id, formData);
      router.push(`/dashboard/classes/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إضافة الطالب');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      router.push(`/dashboard/classes/${id}`);
    } else {
      router.push('/dashboard/classes');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إضافة طالب جديد</h1>
          <p className="text-gray-600 mt-1">
            {classData ? `إضافة طالب إلى ${classData.name}` : 'جاري تحميل بيانات الفصل...'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline ml-1" size={16} />
                رقم الطالب <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleInputChange}
                required
                placeholder="مثال: 2024001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Civil ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline ml-1" size={16} />
                الرقم المدني
              </label>
              <input
                type="text"
                name="civil_id"
                value={formData.civil_id}
                onChange={handleInputChange}
                placeholder="12 رقم"
                maxLength={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline ml-1" size={16} />
                الاسم الأول <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                placeholder="مثال: أحمد"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline ml-1" size={16} />
                الاسم الأخير <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                placeholder="مثال: المحمد"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Arabic Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline ml-1" size={16} />
                الاسم الكامل بالعربية <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="arabic_name"
                value={formData.arabic_name}
                onChange={handleInputChange}
                required
                placeholder="مثال: أحمد محمد علي المحمد"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline ml-1" size={16} />
                تاريخ الميلاد <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline ml-1" size={16} />
                الجنس <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="inline ml-1" size={16} />
                الجنسية <span className="text-red-500">*</span>
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              >
                <option value="الكويت">الكويت</option>
                <option value="السعودية">السعودية</option>
                <option value="الإمارات">الإمارات</option>
                <option value="قطر">قطر</option>
                <option value="البحرين">البحرين</option>
                <option value="عمان">عمان</option>
                <option value="مصر">مصر</option>
                <option value="الأردن">الأردن</option>
                <option value="لبنان">لبنان</option>
                <option value="سوريا">سوريا</option>
                <option value="العراق">العراق</option>
                <option value="فلسطين">فلسطين</option>
                <option value="اليمن">اليمن</option>
                <option value="المغرب">المغرب</option>
                <option value="الجزائر">الجزائر</option>
                <option value="تونس">تونس</option>
                <option value="ليبيا">ليبيا</option>
                <option value="السودان">السودان</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline ml-1" size={16} />
                العنوان
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="مثال: منطقة الجهراء، قطعة 1، شارع 12، منزل 34"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={16} />
              )}
              {loading ? 'جاري الحفظ...' : 'إضافة الطالب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}