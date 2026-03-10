import { useAuth } from '@clerk/clerk-react'
import { api } from '../api/client'
import { useEffect } from 'react'

export const useApi = () => {
  const { getToken } = useAuth()

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (error) {
          console.error('Failed to get auth token:', error)
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor)
    }
  }, [getToken])

  return api
}