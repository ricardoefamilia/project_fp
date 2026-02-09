import axios from 'axios'
import { env } from '@/env'

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    )
  }
)

export default api
