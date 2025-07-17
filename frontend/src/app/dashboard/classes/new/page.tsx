'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Users, Calendar, BookOpen, Hash } from 'lucide-react';
import { classApi, subjectsApi } from '@/lib/api/classes';
import { CreateClassRequest } from '@/types/class';
import { Subject } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';

export default function NewClassPage() {
  const [formData, setFormData] = useState<CreateClassRequest>({
    name: '',
    subject_id: '',
    school_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    semester: 'first',
    class_section: '1',
    max_students: 30,
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) return;
      
      try {
        const allSubjects = await subjectsApi.getSubjects();
        
        // Filter subjects based on what the teacher teaches
        const teacherSubjects = [];
        
        // Add primary subject
        if (user.primary_subject_id) {
          const primarySubject = allSubjects.find(s => s.id === user.primary_subject_id);
          if (primarySubject) {
            // Find all subjects of the same type for the teacher's school type
            const sameTypeSubjects = allSubjects.filter(s => 
              s.name_arabic === primarySubject.name_arabic && 
              s.school_type === user.school_type
            );
            teacherSubjects.push(...sameTypeSubjects);
          }
        }
        
        // Add secondary subject (for Islamic Education teachers who also teach Quran)
        if (user.secondary_subject_id) {
          const secondarySubject = allSubjects.find(s => s.id === user.secondary_subject_id);
          if (secondarySubject) {
            const sameTypeSubjects = allSubjects.filter(s => 
              s.name_arabic === secondarySubject.name_arabic && 
              s.school_type === user.school_type
            );
            teacherSubjects.push(...sameTypeSubjects);
          }
        }
        
        setSubjects(teacherSubjects || []);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, [user]);

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

  // Helper function to format subject name with grade level
  const formatSubjectName = (subject: Subject) => {
    const gradeText = getGradeText(subject.grade_level);
    return `${subject.name_arabic || subject.name} - ${gradeText}`;
  };

  // Helper function to convert grade number to Arabic text
  const getGradeText = (grade: number) => {
    const gradeNames = {
      1: 'الصف الأول',
      2: 'الصف الثاني', 
      3: 'الصف الثالث',
      4: 'الصف الرابع',
      5: 'الصف الخامس',
      6: 'الصف السادس',
      7: 'الصف السابع',
      8: 'الصف الثامن',
      9: 'الصف التاسع',
      10: 'الصف العاشر',
      11: 'الصف الحادي عشر',
      12: 'الصف الثاني عشر'
    };
    return gradeNames[grade as keyof typeof gradeNames] || `الصف ${grade}`;
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
                    {formatSubjectName(subject)}
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
              <select
                name="class_section"
                value={formData.class_section}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="">اختر الشعبة</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num.toString()}>الشعبة {num}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                اختر رقم الشعبة (1-12 أو أكثر حسب حجم المدرسة)
              </p>
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