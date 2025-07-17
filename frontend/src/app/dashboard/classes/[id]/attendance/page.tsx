'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Check, 
  X, 
  Clock, 
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { classApi, studentApi, attendanceApi } from '@/lib/api/classes';
import { Class, Student, AttendanceRecord } from '@/types/class';

interface AttendancePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AttendancePage({ params }: AttendancePageProps) {
  const [id, setId] = useState<string>('');
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [classResult, studentsResult] = await Promise.all([
        classApi.getClass(id),
        studentApi.getClassStudents(id)
      ]);
      
      setClassData(classResult);
      setStudents(studentsResult);
      
      // Initialize attendance records with all students present by default
      const initialRecords: Record<string, AttendanceRecord> = {};
      studentsResult.forEach(student => {
        initialRecords[student.id] = {
          student_id: student.id,
          status: 'present',
          notes: ''
        };
      });
      setAttendanceRecords(initialRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
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
      fetchData();
    }
  }, [id, fetchData]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes
      }
    }));
  };

  const handleBulkStatus = (status: 'present' | 'absent' | 'late' | 'excused') => {
    const updatedRecords = { ...attendanceRecords };
    students.forEach(student => {
      updatedRecords[student.id] = {
        ...updatedRecords[student.id],
        status
      };
    });
    setAttendanceRecords(updatedRecords);
  };

  const handleSubmit = async () => {
    if (!classData || !id) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const records = Object.values(attendanceRecords);
      await attendanceApi.createAttendance({
        class_id: id,
        date: selectedDate,
        records
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/classes/${id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/dashboard/classes/${id}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <Check className="text-green-600" size={20} />;
      case 'absent':
        return <X className="text-red-600" size={20} />;
      case 'late':
        return <Clock className="text-yellow-600" size={20} />;
      case 'excused':
        return <FileText className="text-blue-600" size={20} />;
      default:
        return <Check className="text-green-600" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'حاضر';
      case 'absent':
        return 'غائب';
      case 'late':
        return 'متأخر';
      case 'excused':
        return 'غياب مبرر';
      default:
        return 'حاضر';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'absent':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'late':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendanceRecords).filter(r => r.status === 'present').length;
    const absent = Object.values(attendanceRecords).filter(r => r.status === 'absent').length;
    const late = Object.values(attendanceRecords).filter(r => r.status === 'late').length;
    const excused = Object.values(attendanceRecords).filter(r => r.status === 'excused').length;

    return { total, present, absent, late, excused };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !classData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const stats = getAttendanceStats();

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
          <h1 className="text-3xl font-bold text-gray-900">تسجيل الحضور</h1>
          <p className="text-gray-600 mt-1">
            {classData?.name} - {classData?.subject_name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={16} />
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ الحضور'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-800">تم حفظ الحضور بنجاح! سيتم تحويلك إلى صفحة الفصل...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <XCircle className="text-red-600" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">المجموع</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="text-gray-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">حاضر</h3>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">غائب</h3>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <XCircle className="text-red-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">متأخر</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">غياب مبرر</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
            </div>
            <FileText className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleBulkStatus('present')}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            جميع الطلاب حاضرون
          </button>
          <button
            onClick={() => handleBulkStatus('absent')}
            className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            جميع الطلاب غائبون
          </button>
          <button
            onClick={() => handleBulkStatus('late')}
            className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-2"
          >
            <Clock size={16} />
            جميع الطلاب متأخرون
          </button>
        </div>
      </div>

      {/* Attendance Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">قائمة الطلاب</h3>
          
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد طلاب</h3>
              <p className="text-gray-600">لا يوجد طلاب في هذا الفصل لتسجيل الحضور</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {student.arabic_name} - {student.student_number}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(attendanceRecords[student.id]?.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(attendanceRecords[student.id]?.status)}`}>
                        {getStatusText(attendanceRecords[student.id]?.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <button
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${
                        attendanceRecords[student.id]?.status === 'present'
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      <Check size={16} />
                      حاضر
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${
                        attendanceRecords[student.id]?.status === 'absent'
                          ? 'bg-red-100 border-red-300 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      <X size={16} />
                      غائب
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'late')}
                      className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${
                        attendanceRecords[student.id]?.status === 'late'
                          ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-yellow-50'
                      }`}
                    >
                      <Clock size={16} />
                      متأخر
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'excused')}
                      className={`p-2 rounded-lg border transition-colors flex items-center gap-2 ${
                        attendanceRecords[student.id]?.status === 'excused'
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      <FileText size={16} />
                      غياب مبرر
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ملاحظات
                    </label>
                    <input
                      type="text"
                      value={attendanceRecords[student.id]?.notes || ''}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                      placeholder="أضف ملاحظة (اختياري)"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}