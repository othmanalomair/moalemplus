'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Search, 
  Filter,
  Edit,
  Trash2,
  UserPlus,
  ClipboardList,
  BarChart3,
  Settings
} from 'lucide-react';
import { classApi, studentApi } from '@/lib/api/classes';
import { Class, Student, ClassStats } from '@/types/class';

interface ClassDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClassDetailsPage({ params }: ClassDetailsPageProps) {
  const [id, setId] = useState<string>('');
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedTab, setSelectedTab] = useState<'students' | 'attendance' | 'stats'>('students');
  const router = useRouter();

  const fetchClassData = useCallback(async () => {
    try {
      const data = await classApi.getClass(id);
      setClassData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class data');
    }
  }, [id]);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await studentApi.getClassStudents(id);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    }
  }, [id]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await classApi.getClassStats(id);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
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
      fetchStudents();
      fetchStats();
    }
  }, [id, fetchClassData, fetchStudents, fetchStats]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.arabic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = filterGender === 'all' || student.gender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  const handleAddStudent = () => {
    router.push(`/dashboard/classes/${id}/students/new`);
  };

  const handleTakeAttendance = () => {
    router.push(`/dashboard/classes/${id}/attendance`);
  };

  const handleViewStudent = (studentId: string) => {
    router.push(`/dashboard/classes/${id}/students/${studentId}`);
  };

  const handleBack = () => {
    router.push('/dashboard/classes');
  };

  const getSemesterText = (semester: string) => {
    return semester === 'first' ? 'الفصل الأول' : 'الفصل الثاني';
  };

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'ذكر' : 'أنثى';
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-gray-600">{error || 'لم يتم العثور على الفصل'}</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            العودة إلى الفصول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
          <p className="text-gray-600 mt-1">
            {classData.subject_name} - {getSemesterText(classData.semester)} - {classData.school_year}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTakeAttendance}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <ClipboardList size={16} />
            تسجيل الحضور
          </button>
          <button
            onClick={handleAddStudent}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <UserPlus size={16} />
            إضافة طالب
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">إجمالي الطلاب</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_students || 0}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">الطلاب النشطون</h3>
              <p className="text-2xl font-bold text-gray-900">{stats?.active_students || 0}</p>
            </div>
            <Users className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">معدل الحضور</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.average_attendance?.toFixed(1) || 0}%
              </p>
            </div>
            <BarChart3 className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">السعة</h3>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_students || 0}/{classData.max_students}
              </p>
            </div>
            <Calendar className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الطلاب ({filteredStudents.length})
            </button>
            <button
              onClick={() => setSelectedTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الحضور
            </button>
            <button
              onClick={() => setSelectedTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الإحصائيات
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {selectedTab === 'students' && (
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="البحث في الطلاب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={20} />
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value as 'all' | 'male' | 'female')}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">جميع الطلاب</option>
                    <option value="male">الذكور</option>
                    <option value="female">الإناث</option>
                  </select>
                </div>
              </div>

              {/* Students Table */}
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد طلاب</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterGender !== 'all' 
                      ? 'لا يوجد طلاب يطابقون معايير البحث'
                      : 'لم يتم إضافة أي طلاب لهذا الفصل بعد'
                    }
                  </p>
                  {!searchTerm && filterGender === 'all' && (
                    <button
                      onClick={handleAddStudent}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      إضافة طالب جديد
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-medium text-gray-700">الطالب</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">رقم الطالب</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">الجنس</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">الجنسية</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">نسبة الحضور</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {student.first_name} {student.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{student.arabic_name}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900">{student.student_number}</td>
                          <td className="py-3 px-4 text-gray-900">{getGenderText(student.gender)}</td>
                          <td className="py-3 px-4 text-gray-900">{student.nationality}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${getAttendanceColor(student.attendance_rate || 0)}`}>
                              {student.attendance_rate?.toFixed(1) || 0}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewStudent(student.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  // Handle delete
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'attendance' && (
            <div className="text-center py-12">
              <ClipboardList className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">سجل الحضور</h3>
              <p className="text-gray-600 mb-4">ستتمكن من مشاهدة سجل الحضور هنا</p>
              <button
                onClick={handleTakeAttendance}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                تسجيل الحضور اليوم
              </button>
            </div>
          )}

          {selectedTab === 'stats' && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">إحصائيات مفصلة</h3>
              <p className="text-gray-600">ستتمكن من مشاهدة الإحصائيات المفصلة هنا</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}