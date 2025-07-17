'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { RegisterRequest, School, Subject } from '@/types/auth';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated, getCurrentUser } = useAuthStore();
  const [formData, setFormData] = useState<RegisterRequest>({
    civil_id: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    school_id: '',
    primary_subject_id: '',
    secondary_subject_id: '',
    school_type: 'primary',
    school_gender: 'male',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      await getCurrentUser();
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [isAuthenticated, getCurrentUser, router]);

  // Fetch all schools and subjects on component mount
  useEffect(() => {
    const fetchData = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      
      // Fetch all schools
      try {
        const schoolsResponse = await fetch(`${API_BASE_URL}/schools`);
        if (schoolsResponse.ok) {
          const schoolsData = await schoolsResponse.json();
          setSchools(schoolsData || []);
        } else {
          console.warn('Failed to fetch schools, using empty array');
          setSchools([]);
        }
      } catch (error) {
        console.warn('Error fetching schools:', error);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }

      // Fetch all subjects
      try {
        const subjectsResponse = await fetch(`${API_BASE_URL}/subjects`);
        if (subjectsResponse.ok) {
          const subjectsData = await subjectsResponse.json();
          setSubjects(subjectsData || []);
        } else {
          console.warn('Failed to fetch subjects, using empty array');
          setSubjects([]);
        }
      } catch (error) {
        console.warn('Error fetching subjects:', error);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset dependent fields when school type or gender changes
      ...(name === 'school_type' ? { school_id: '', primary_subject_id: '', secondary_subject_id: '' } : {}),
      ...(name === 'school_gender' ? { school_id: '', primary_subject_id: '', secondary_subject_id: '' } : {}),
      // Clear subjects when school changes
      ...(name === 'school_id' ? { primary_subject_id: '', secondary_subject_id: '' } : {}),
      // Clear secondary subject if changing to non-Islamic education
      ...(name === 'primary_subject_id' && !isIslamicEducation(value) ? { secondary_subject_id: '' } : {})
    }));
    if (error) clearError();
  };

  // Check if a subject is Islamic Education (التربية الإسلامية)
  const isIslamicEducation = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name_arabic === 'التربية الإسلامية' || subject?.code?.startsWith('IS');
  };

  // Get filtered subjects based on school type
  const getFilteredSubjects = () => {
    // Group subjects by subject name to show unique subjects
    const subjectGroups = subjects.reduce((acc, subject) => {
      const key = subject.name_arabic || subject.name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(subject);
      return acc;
    }, {} as Record<string, typeof subjects>);

    // Filter by school type and return one subject per group
    return Object.values(subjectGroups)
      .filter(group => group.some(subject => subject.school_type === formData.school_type))
      .map(group => group.find(subject => subject.school_type === formData.school_type) || group[0]);
  };

  // Get schools filtered by type and gender
  const getFilteredSchools = () => {
    return schools.filter(school => 
      school.type === formData.school_type && 
      school.attendees === formData.school_gender
    );
  };

  // Get Quran subject for secondary selection
  const getQuranSubject = () => {
    return subjects.find(s => 
      (s.name_arabic === 'القرآن الكريم' || s.code?.startsWith('QR')) && 
      s.school_type === formData.school_type
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.civil_id || !formData.full_name || !formData.email || !formData.phone || 
        !formData.password || !formData.school_id || !formData.primary_subject_id || 
        !formData.school_type || !formData.school_gender) {
      return;
    }

    if (formData.password !== confirmPassword) {
      return;
    }

    try {
      // Add +965 prefix to phone number before submitting
      const submitData = {
        ...formData,
        phone: `+965${formData.phone}`,
        // Only include secondary_subject_id if it's filled
        secondary_subject_id: formData.secondary_subject_id || undefined
      };
      await register(submitData);
      router.push('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };

  const getSchoolTypeText = (type: string) => {
    switch (type) {
      case 'primary': return 'ابتدائي';
      case 'intermediate': return 'متوسط';
      case 'secondary': return 'ثانوي';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">م+</span>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            انضم إلى معلم+
          </h2>
          <p className="text-gray-600 mb-6">
            أنشئ حسابك الآن واستمتع بتجربة تعليمية متميزة
          </p>
          
          {/* Switch to Login */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Civil ID */}
              <div className="md:col-span-2">
                <label htmlFor="civil_id" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم البطاقة المدنية
                </label>
                <div className="relative">
                  <input
                    id="civil_id"
                    name="civil_id"
                    type="text"
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="123456789012"
                    value={formData.civil_id}
                    onChange={handleChange}
                    maxLength={12}
                    pattern="[0-9]{12}"
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0v2m0 6h.01M16 12h.01" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="md:col-span-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="أحمد محمد الكويتي"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="teacher@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">+965</span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none relative block w-full pl-16 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="12345678"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="ltr"
                    maxLength={8}
                    pattern="[0-9]{8}"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>


              {/* School Type */}
              <div>
                <label htmlFor="school_type" className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المدرسة
                </label>
                <div className="relative">
                  <select
                    id="school_type"
                    name="school_type"
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900"
                    value={formData.school_type}
                    onChange={handleChange}
                  >
                    <option value="primary" className="text-gray-900">ابتدائي</option>
                    <option value="intermediate" className="text-gray-900">متوسط</option>
                    <option value="secondary" className="text-gray-900">ثانوي</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* School Gender */}
              <div>
                <label htmlFor="school_gender" className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الطلاب
                </label>
                <div className="relative">
                  <select
                    id="school_gender"
                    name="school_gender"
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900"
                    value={formData.school_gender}
                    onChange={handleChange}
                  >
                    <option value="male" className="text-gray-900">بنين</option>
                    <option value="female" className="text-gray-900">بنات</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* School Selection */}
              <div className="md:col-span-2">
                <label htmlFor="school_id" className="block text-sm font-medium text-gray-700 mb-2">
                  المدرسة
                </label>
                {loadingSchools ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                    <svg className="animate-spin h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري تحميل المدارس...
                  </div>
                ) : getFilteredSchools().length === 0 ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-yellow-50 flex items-center">
                    <svg className="h-5 w-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    لا توجد مدارس متاحة للنوع والجنس المحدد
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      id="school_id"
                      name="school_id"
                      required
                      className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900"
                      value={formData.school_id}
                      onChange={handleChange}
                    >
                      <option value="" className="text-gray-500">اختر المدرسة</option>
                      {getFilteredSchools().map((school) => (
                        <option key={school.id} value={school.id} className="text-gray-900 py-2">
                          {school.name} - {school.district}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Subject - Only show when school is selected */}
              {formData.school_id && (
                <div className="md:col-span-2">
                  <label htmlFor="primary_subject_id" className="block text-sm font-medium text-gray-700 mb-2">
                    المادة التي تدرسها
                  </label>
                  {loadingSubjects ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                      <svg className="animate-spin h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري تحميل المواد...
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        id="primary_subject_id"
                        name="primary_subject_id"
                        required
                        className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900"
                        value={formData.primary_subject_id}
                        onChange={handleChange}
                      >
                        <option value="" className="text-gray-500">اختر المادة</option>
                        {getFilteredSubjects().map((subject) => (
                          <option key={subject.id} value={subject.id} className="text-gray-900 py-2">
                            {subject.name_arabic || subject.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Secondary Subject (only for Islamic Education teachers) */}
              {isIslamicEducation(formData.primary_subject_id) && (
                <div className="md:col-span-2">
                  <label htmlFor="secondary_subject_id" className="block text-sm font-medium text-gray-700 mb-2">
                    المادة الثانية (اختياري للتربية الإسلامية)
                  </label>
                  <div className="relative">
                    <select
                      id="secondary_subject_id"
                      name="secondary_subject_id"
                      className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-gray-900"
                      value={formData.secondary_subject_id || ''}
                      onChange={handleChange}
                    >
                      <option value="" className="text-gray-500">لا توجد مادة ثانية</option>
                      {getQuranSubject() && (
                        <option value={getQuranSubject()!.id} className="text-gray-900 py-2">
                          {getQuranSubject()!.name_arabic || getQuranSubject()!.name}
                        </option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    معلمو التربية الإسلامية يمكنهم اختيار القرآن الكريم كمادة ثانية
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    required
                    className="appearance-none relative block w-full pl-4 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                {confirmPassword && formData.password !== confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    كلمات المرور غير متطابقة
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || formData.password !== confirmPassword}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                )}
                {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </button>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}