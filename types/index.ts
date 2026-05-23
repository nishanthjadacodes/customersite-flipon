// Shared API/domain types for the customer-facing Next.js site.
// Mirror of customerandroidapp/src/types/api.ts so the two stay in lockstep.

export type Id = string;
export type ISODate = string;

export type BookingType = 'consumer' | 'industrial';

export interface Service {
  id: Id;
  name: string;
  category?: string;
  description?: string;
  user_cost?: number;
  partner_earning?: number;
  expected_timeline?: string;
  required_documents?: Array<{ type: string; label?: string }>;
}

export interface Booking {
  id: Id;
  booking_number?: number;
  service_id: Id;
  service?: Service;
  customer_name: string;
  customer_mobile: string;
  status: 'pending' | 'assigned' | 'accepted' | 'documents_collected' | 'submitted' | 'completed' | 'cancelled';
  service_address?: string | Record<string, unknown>;
  preferred_date?: string;
  preferred_time?: string;
  price_quoted?: number;
  created_at?: ISODate;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}
