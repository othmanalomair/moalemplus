import { 
  Class, 
  CreateClassRequest, 
  UpdateClassRequest, 
  ClassStats,
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  Attendance,
  CreateAttendanceRequest,
  AttendanceReport 
} from '@/types/class';
import { ApiError, ApiSuccess } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Helper function to make authenticated requests
const makeRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
      throw new Error('Authentication required');
    }
    
    try {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Request failed');
    } catch {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  }

  return response.json();
};

// Class API
export const classApi = {
  // Get all classes for the current teacher
  getClasses: async (): Promise<Class[]> => {
    return makeRequest<Class[]>('/classes');
  },

  // Get a specific class by ID
  getClass: async (id: string): Promise<Class> => {
    return makeRequest<Class>(`/classes/${id}`);
  },

  // Create a new class
  createClass: async (data: CreateClassRequest): Promise<Class> => {
    return makeRequest<Class>('/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a class
  updateClass: async (id: string, data: UpdateClassRequest): Promise<ApiSuccess> => {
    return makeRequest<ApiSuccess>(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a class
  deleteClass: async (id: string): Promise<ApiSuccess> => {
    return makeRequest<ApiSuccess>(`/classes/${id}`, {
      method: 'DELETE',
    });
  },

  // Get class statistics
  getClassStats: async (id: string): Promise<ClassStats> => {
    return makeRequest<ClassStats>(`/classes/${id}/stats`);
  },
};

// Student API
export const studentApi = {
  // Get all students in a class
  getClassStudents: async (classId: string): Promise<Student[]> => {
    return makeRequest<Student[]>(`/classes/${classId}/students`);
  },

  // Get a specific student
  getStudent: async (id: string): Promise<Student> => {
    return makeRequest<Student>(`/students/${id}`);
  },

  // Create a new student
  createStudent: async (classId: string, data: CreateStudentRequest): Promise<Student> => {
    return makeRequest<Student>(`/classes/${classId}/students`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a student
  updateStudent: async (id: string, data: UpdateStudentRequest): Promise<ApiSuccess> => {
    return makeRequest<ApiSuccess>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a student
  deleteStudent: async (id: string): Promise<ApiSuccess> => {
    return makeRequest<ApiSuccess>(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// Attendance API
export const attendanceApi = {
  // Create attendance records
  createAttendance: async (data: CreateAttendanceRequest): Promise<ApiSuccess> => {
    return makeRequest<ApiSuccess>(`/classes/${data.class_id}/attendance`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get attendance for a specific class and date
  getClassAttendance: async (classId: string, date: string): Promise<Attendance[]> => {
    return makeRequest<Attendance[]>(`/classes/${classId}/attendance/${date}`);
  },

  // Update attendance record
  updateAttendance: async (id: string, data: { status: string; notes?: string }): Promise<ApiSuccess> => {
    return makeRequest<ApiSuccess>(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Get student attendance report
  getStudentAttendanceReport: async (
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceReport> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const queryString = params.toString();
    const url = `/students/${studentId}/attendance-report${queryString ? `?${queryString}` : ''}`;
    
    return makeRequest<AttendanceReport>(url);
  },
};

// Subjects API
export const subjectsApi = {
  // Get all subjects
  getSubjects: async (): Promise<any[]> => {
    return makeRequest<any[]>('/subjects');
  },
};