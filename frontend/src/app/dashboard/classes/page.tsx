'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { classApi } from '@/lib/api/classes';
import { Class } from '@/types/class';
import { Plus, Search, Filter, Users, BookOpen, Calendar, MoreVertical } from 'lucide-react';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState<'all' | 'first' | 'second'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classApi.getClasses();
      setClasses(data || []); // Ensure we always have an array
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
      setClasses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = (classes || []).filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.class_section.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = filterSemester === 'all' || cls.semester === filterSemester;
    
    return matchesSearch && matchesSemester;
  });

  const handleCreateClass = () => {
    router.push('/dashboard/classes/new');
  };

  const handleViewClass = (classId: string) => {
    router.push(`/dashboard/classes/${classId}`);
  };

  const getSemesterText = (semester: string) => {
    return semester === 'first' ? 'الفصل الأول' : 'الفصل الثاني';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchClasses}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">فصولي</h1>
          <p className="text-gray-600 mt-1">إدارة جميع فصولك الدراسية</p>
        </div>
        <button
          onClick={handleCreateClass}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          إضافة فصل جديد
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث في الفصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value as 'all' | 'first' | 'second')}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="all">جميع الفصول</option>
              <option value="first">الفصل الأول</option>
              <option value="second">الفصل الثاني</option>
            </select>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد فصول</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterSemester !== 'all' 
              ? 'لا توجد فصول تطابق معايير البحث'
              : 'لم تقم بإنشاء أي فصول بعد'
            }
          </p>
          {!searchTerm && filterSemester === 'all' && (
            <button
              onClick={handleCreateClass}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إنشاء فصل جديد
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleViewClass(cls.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{cls.subject_name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle options menu
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{cls.student_count || 0} طالب</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{getSemesterText(cls.semester)} - {cls.school_year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen size={16} />
                    <span>الشعبة {cls.class_section}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      السعة: {cls.student_count || 0}/{cls.max_students}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(((cls.student_count || 0) / cls.max_students) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}