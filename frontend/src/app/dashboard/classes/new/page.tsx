'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Users, Calendar, BookOpen, Hash } from 'lucide-react';
import { classApi, subjectsApi } from '@/lib/api/classes';
import { CreateClassRequest, Subject } from '@/types/class';

export default function NewClassPage() {
  const [formData, setFormData] = useState<CreateClassRequest>({
    name: '',
    subject_id: '',
    school_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    semester: 'first',
    class_section: '',
    max_students: 30,
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectsApi.getSubjects();
        setSubjects(data || []);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        // Fallback to mock data if API fails
        setSubjects([
          { id: '1', name: 'الرياضيات', code: 'MATH', is_active: true, created_at: '', updated_at: '' },
          { id: '2', name: 'العلوم', code: 'SCI', is_active: true, created_at: '', updated_at: '' },
          { id: '3', name: 'اللغة العربية', code: 'AR', is_active: true, created_at: '', updated_at: '' },
          { id: '4', name: 'اللغة الإنجليزية', code: 'EN', is_active: true, created_at: '', updated_at: '' },
          { id: '5', name: 'التربية الإسلامية', code: 'IS', is_active: true, created_at: '', updated_at: '' },
          { id: '6', name: 'الدراسات الاجتماعية', code: 'SS', is_active: true, created_at: '', updated_at: '' },
        ]);
      }
    };

    fetchSubjects();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_students' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await classApi.createClass(formData);
      router.push('/dashboard/classes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الفصل');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/classes');
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
          <h1 className="text-3xl font-bold text-gray-900">إنشاء فصل جديد</h1>
          <p className="text-gray-600 mt-1">أضف فصلاً جديداً لإدارة الطلاب</p>
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
            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline ml-1" size={16} />
                اسم الفصل
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="مثال: الرياضيات - الصف الرابع"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline ml-1" size={16} />
                المادة
              </label>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="">اختر المادة</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name_arabic || subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* School Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline ml-1" size={16} />
                السنة الدراسية
              </label>
              <input
                type="text"
                name="school_year"
                value={formData.school_year}
                onChange={handleInputChange}
                required
                placeholder="2024-2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline ml-1" size={16} />
                الفصل الدراسي
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="first">الفصل الأول</option>
                <option value="second">الفصل الثاني</option>
              </select>
            </div>

            {/* Class Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline ml-1" size={16} />
                الشعبة
              </label>
              <input
                type="text"
                name="class_section"
                value={formData.class_section}
                onChange={handleInputChange}
                required
                placeholder="مثال: أ، ب، ج"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            {/* Max Students */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline ml-1" size={16} />
                الحد الأقصى للطلاب
              </label>
              <input
                type="number"
                name="max_students"
                value={formData.max_students}
                onChange={handleInputChange}
                required
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={16} />
              )}
              {loading ? 'جاري الحفظ...' : 'إنشاء الفصل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}