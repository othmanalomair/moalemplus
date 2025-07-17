export interface User {
  id: string;
  civil_id: string;
  full_name: string;
  email: string;
  phone: string;
  school_id: string;
  primary_subject_id?: string;
  secondary_subject_id?: string;
  school_type: 'primary' | 'intermediate' | 'secondary';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  district: string;
  area: string;
  type: 'primary' | 'intermediate' | 'secondary';
  attendees: 'male' | 'female';
  creation_date: number;
  phone_numbers: string[];
  automatic_number: string;
  location_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  civil_id: string;
  password: string;
}

export interface RegisterRequest {
  civil_id: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  school_id: string;
  primary_subject_id: string;
  secondary_subject_id?: string;
  school_type: 'primary' | 'intermediate' | 'secondary';
  school_gender: 'male' | 'female';
}

export interface Subject {
  id: string;
  name: string;
  name_arabic: string;
  code: string;
  school_type: string;
  grade_level: number;
  is_active: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ApiError {
  error: boolean;
  message: string;
}

export interface ApiSuccess<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}