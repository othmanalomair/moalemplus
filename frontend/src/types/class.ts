export interface Subject {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  teacher_id: string;
  subject_id: string;
  school_year: string;
  semester: 'first' | 'second';
  class_section: string;
  max_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subject_name?: string;
  student_count?: number;
}

export interface Student {
  id: string;
  student_number: string;
  civil_id?: string;
  first_name: string;
  last_name: string;
  arabic_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  nationality: string;
  address?: string;
  class_id: string;
  enrollment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attendance_rate?: number;
  class_name?: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  recorded_by: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
  student_name?: string;
  student_number?: string;
}

export interface CreateClassRequest {
  name: string;
  subject_id: string;
  school_year: string;
  semester: 'first' | 'second';
  class_section: string;
  max_students: number;
}

export interface UpdateClassRequest {
  name: string;
  school_year: string;
  semester: 'first' | 'second';
  class_section: string;
  max_students: number;
  is_active: boolean;
}

export interface CreateStudentRequest {
  student_number: string;
  civil_id?: string;
  first_name: string;
  last_name: string;
  arabic_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  nationality: string;
  address?: string;
}

export interface UpdateStudentRequest {
  student_number: string;
  civil_id?: string;
  first_name: string;
  last_name: string;
  arabic_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  nationality: string;
  address?: string;
  is_active: boolean;
}

export interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface CreateAttendanceRequest {
  class_id: string;
  date: string;
  records: AttendanceRecord[];
}

export interface AttendanceStats {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  attendance_rate: number;
}

export interface ClassStats {
  total_students: number;
  average_attendance: number;
  active_students: number;
  male_students: number;
  female_students: number;
}

export interface AttendanceReport {
  date: string;
  students?: Student[];
  attendances: Attendance[];
  stats: AttendanceStats;
}