import axios from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs'; // Thêm thư viện qs để tùy chỉnh query string
import { normalizePath } from '@/lib/utils';
import { LoginResType } from '@/schemaValidations/auth.schema'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';  // Thay bằng URL backend FastAPI

type CustomOptions = {
  baseUrl?: string | undefined
  params?: Record<string, string | number>
  headers?: Record<string, string>
  body?: any
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  success: boolean
  message: string
  details: {
    field: string
    msg: string
  }[]
}

type UnauthorizedErrorPayload = {
  success: boolean
  message: string
  details: string | null
}

export class HttpError extends Error {
  status: number
  payload: {
    success: boolean
    message: string
    details: any
    // [key: string]: any
  }
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

export class UnauthorizedError extends HttpError {
  status: 401
  payload: UnauthorizedErrorPayload
  constructor({
    status,
    payload
  }: {
    status: 401
    payload: UnauthorizedErrorPayload
  }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload
  constructor({
    status,
    payload
  }: {
    status: 422
    payload: EntityErrorPayload
  }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

let clientRefreshRequest: null | Promise<any> = null

export const isClient = () => typeof window !== 'undefined'

const handleLogout = () => {
  if (isClient()) {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    Cookies.remove('role')
    location.href = '/signin'
    // console.log("handleLogout in axios.ts");
  }
}

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL, headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,  // Gửi cookie nếu cần (nhưng chúng ta sẽ set header manual)
});

// Request Interceptor: Thêm Authorization header từ cookie và xử lý FormData
api.interceptors.request.use((config) => {
  if (isClient()) {
    const accessToken = Cookies.get('access_token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }
  // Nếu body là FormData, loại bỏ Content-Type để browser tự set
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Response Interceptor: Xử lý lưu/xóa token và lỗi (bao gồm refresh token)
api.interceptors.response.use(
  (response) => {
    // Xử lý lưu/xóa token dựa trên URL (interceptor cho login/register/logout)
    const url = normalizePath(response.config.url || '')
    if (isClient()) {
      if (url === 'auth/login'){
        const { access_token, refresh_token } = response.data.data as LoginResType['data']
        const role = response.data.data.user.role;
        Cookies.set('access_token', access_token,
            // { expires: new Date(expiresAt) }
        )
        Cookies.set('refresh_token', refresh_token,
          // { expires: new Date(expiresAt) }
        );
        Cookies.set('role', role);
      }
    }

    console.log("response from axios.ts: ", response);
    return response
  },

  async (error) => {

    console.log("error from axios.ts: ", error);
    // console.log("error.response.status from axios.ts: ", error.response.status);
    // console.log("error.response.data from axios.ts: ", error.response.data);
    if (!error.response) {
      throw error // Lỗi mạng hoặc không có response
    }

    if (error.response.status == AUTHENTICATION_ERROR_STATUS) {
      const url = normalizePath(error.config.url || '')
      if (isClient() && url === 'auth/login') { 
        throw new UnauthorizedError({ status: error.response.status, payload: error.response.data })
      }
    }

    const originalRequest = error.config
    if (
      (error.response.status == AUTHENTICATION_ERROR_STATUS) &&
      isClient() &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true // Đánh dấu để tránh loop refresh
      if (!clientRefreshRequest) {
        const refreshToken = Cookies.get('refresh_token')
        if (refreshToken) {
          clientRefreshRequest = api.post('/auth/refresh', { refresh_token: refreshToken })
          try {
            const refreshResponse = await clientRefreshRequest
            const { access_token } = refreshResponse.data
            console.log("access_token from /auth/refresh", access_token);
            Cookies.set('access_token', access_token /*, { expires: new Date(expiresAt) } */)
            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return api(originalRequest) // Retry request gốc với token mới
          } catch (refreshError) {
            handleLogout()
            console.log(refreshError);
            throw refreshError
          } finally {
            clientRefreshRequest = null
          }
        } else {
          handleLogout()
        }
      }
    }

    // Xử lý lỗi khác
    const data = error.response.data
    if (error.response.status == ENTITY_ERROR_STATUS) { // Lỗi validation
      // console.log("error.response.data 422 from axios.ts: ", error.response.data);
      throw new EntityError({ status: 422, payload: data })
    } else {
      throw new HttpError({ status: error.response.status, payload: data })
    }
  }
)

// Object http với các method, hỗ trợ options (baseUrl, params, body)
const http = {
  get<Response>(url: string, options?: CustomOptions) {
    const fullUrl = options?.baseUrl
      ? (url.startsWith('/') ? `${options.baseUrl}${url}` : `${options.baseUrl}/${url}`)
      : url
    return api.get(fullUrl, {
      params: options?.params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }), // Sử dụng qs để mã hóa query string, đảm bảo (status=value1&status=value2)
      headers: options?.headers
    }).then((res) => ({
      status: res.status,
      payload: res.data as Response
    }))
  },
  post<Response>(url: string, body: any, options?: CustomOptions) {
    const fullUrl = options?.baseUrl
      ? (url.startsWith('/') ? `${options.baseUrl}${url}` : `${options.baseUrl}/${url}`)
      : url
    return api.post(fullUrl, body, {
      params: options?.params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
      headers: options?.headers
    }).then((res) => ({
      status: res.status,
      payload: res.data as Response
    }))
  },
  put<Response>(url: string, body: any, options?: CustomOptions) {
    const fullUrl = options?.baseUrl
      ? (url.startsWith('/') ? `${options.baseUrl}${url}` : `${options.baseUrl}/${url}`)
      : url
    return api.put(fullUrl, body, {
      params: options?.params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
      headers: options?.headers
    }).then((res) => ({
      status: res.status,
      payload: res.data as Response
    }))
  },
  delete<Response>(url: string, options?: CustomOptions) {
    const fullUrl = options?.baseUrl
      ? (url.startsWith('/') ? `${options.baseUrl}${url}` : `${options.baseUrl}/${url}`)
      : url
    return api.delete(fullUrl, {
      params: options?.params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
      headers: options?.headers
    }).then((res) => ({
      status: res.status,
      payload: res.data as Response
    }))
  }
}

export default http;