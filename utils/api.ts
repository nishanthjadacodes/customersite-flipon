import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, Booking, Service } from '@/types'

// Use the public Render URL as the default so the deployed site works even
// if NEXT_PUBLIC_API_URL isn't configured on Vercel. Local dev can still
// override via .env.local.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://flipon-backend.onrender.com/api'

// Single shared axios instance.
// Render's free-tier dyno cold-starts can take up to 50s. The previous
// 15s timeout fired before the server even woke, leaving the page
// spinning forever. 60s gives the dyno enough headroom; subsequent
// requests within the same warm window return in <500ms.
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

const TOKEN_KEY = 'flipon_token'
const USER_KEY = 'flipon_user'

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}
const setToken = (t: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TOKEN_KEY, t)
  } catch {
    /* ignore */
  }
}
const clearToken = (): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
  } catch {
    /* ignore */
  }
}

// Auto-attach the bearer token to every outbound request.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const t = getToken()
    if (t) config.headers.Authorization = `Bearer ${t}`
    return config
  },
  (e) => Promise.reject(e),
)

// Coalesce concurrent guest-login attempts so we only fire one even if
// several requests 401 at the same time.
let inFlightGuest: Promise<string | undefined> | null = null
const acquireGuestToken = async (): Promise<string | undefined> => {
  if (!inFlightGuest) {
    inFlightGuest = (async () => {
      const { data } = await axios.post<{ token?: string; user?: unknown }>(
        `${API_BASE_URL}/auth/guest-login`,
        {},
        { timeout: 60000 },
      )
      if (data?.token) {
        setToken(data.token)
        if (typeof window !== 'undefined' && data.user) {
          try {
            window.localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          } catch {
            /* ignore */
          }
        }
      }
      return data?.token
    })().finally(() => {
      setTimeout(() => {
        inFlightGuest = null
      }, 0)
    })
  }
  return inFlightGuest
}

// On 401 or 403, silently provision a guest JWT and retry the
// original request once. Same pattern the mobile app uses.
//
// 403 was added because of a real-world issue: if the user has a
// stale token from a previous session whose role no longer matches
// (e.g., signed up under role X, role got renamed/deactivated),
// every subsequent request returns 403 and the page errors out.
// Forcing a fresh guest token recovers seamlessly. Diagnostic log
// surfaces the failing URL so future 403 reports can be triaged.
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _guestRetried?: boolean }) | undefined
    const status = error.response?.status
    const url = original?.url || ''
    if ((status === 401 || status === 403) && original && !original._guestRetried) {
      console.log(`[api] ${status} on ${url} — forcing guest token + retry`)
      try {
        // Clear the bad token first so acquireGuestToken doesn't
        // accidentally short-circuit on a cached one.
        clearToken()
        const t = await acquireGuestToken()
        if (t) {
          original._guestRetried = true
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${t}` } as any
          return axios.request(original)
        }
      } catch (e: any) {
        console.log('[api] guest-login failed:', e?.message)
      }
      // Retry exhausted — clear stale token, let the page render its own
      // friendly error rather than bouncing to a non-existent /login route.
      clearToken()
    }
    return Promise.reject(error)
  },
)

// ─── Service API ──────────────────────────────────────────────────────────
export const servicesAPI = {
  getAllServices: (type: string = 'consumer'): Promise<AxiosResponse<ApiResponse<Service[]>>> =>
    api.get(`/services?type=${type}`),
  getServiceById: (id: string): Promise<AxiosResponse<ApiResponse<Service>>> =>
    api.get(`/services/${id}`),
  getServicesByCategory: (category: string): Promise<AxiosResponse<ApiResponse<Service[]>>> =>
    api.get(`/services?category=${category}`),
}

// ─── Booking API ──────────────────────────────────────────────────────────
export interface CreateBookingPayload {
  service_id: string
  booking_type?: 'consumer' | 'industrial'
  customer_name: string
  customer_mobile: string
  customer_email?: string
  service_address: string | Record<string, unknown>
  preferred_date?: string
  preferred_time?: string
  notes?: string
  [key: string]: unknown
}

export const bookingAPI = {
  createBooking: (bookingData: CreateBookingPayload): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    api.post('/bookings', bookingData),
  getBookingById: (id: string): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    api.get(`/bookings/${id}`),
  getCustomerBookings: (customerId: string): Promise<AxiosResponse<ApiResponse<Booking[]>>> =>
    api.get(`/bookings/customer/${customerId}`),
  getMyBookings: (): Promise<AxiosResponse<ApiResponse<Booking[]>>> =>
    api.get('/bookings/my-bookings'),
  cancelBooking: (id: string): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    api.put(`/bookings/${id}/cancel`),
  rescheduleBooking: (
    id: string,
    newDate: string,
    newTime: string,
  ): Promise<AxiosResponse<ApiResponse<Booking>>> =>
    api.put(`/bookings/${id}/reschedule`, { newDate, newTime }),
}

// ─── Customer API ─────────────────────────────────────────────────────────
export interface CustomerPayload {
  name?: string
  mobile?: string
  email?: string
  [key: string]: unknown
}

export const customerAPI = {
  createCustomer: (customerData: CustomerPayload): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.post('/customers', customerData),
  getCustomerById: (id: string): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.get(`/customers/${id}`),
  updateCustomer: (id: string, customerData: CustomerPayload): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.put(`/customers/${id}`, customerData),
}

// ─── Auth API ─────────────────────────────────────────────────────────────
export interface AuthCredentials {
  mobile?: string
  otp?: string
  email?: string
  password?: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: unknown
  message?: string
}

export const authAPI = {
  login: (credentials: AuthCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', credentials),
  register: (userData: AuthCredentials & Record<string, unknown>): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', userData),
  logout: (): Promise<AxiosResponse<{ success: boolean }>> => api.post('/auth/logout'),
  refreshToken: (): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/refresh'),
  guestLogin: (): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/guest-login'),
}

export default api
