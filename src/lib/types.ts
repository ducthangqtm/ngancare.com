export type ServiceCategory = 'thong_tac' | 'tam_be' | 'sau_sinh' | 'me_bau' | 'san_pham';

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  price: number | null;
  duration: number | null; // minutes
  description: string;
  features: string[]; // parsed from JSON
  image_url: string;
  is_active: number;
  created_at?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  service_id: string;
  service_name?: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
  status: BookingStatus;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author: string;
  views: number;
  is_published: number;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  created_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
