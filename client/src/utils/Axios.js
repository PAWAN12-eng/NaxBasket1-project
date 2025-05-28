import axios from 'axios'
import SummaryApi, { baseURL } from '../common/SummaryApi'

// ✅ Axios instance setup
const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
})

// ✅ Request Interceptor: Add accessToken in headers
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ Response Interceptor: Handle 401 errors and refresh token
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken)

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return Axios(originalRequest)
        }
      }
    }

    return Promise.reject(error)
  }
)

// ✅ Token Refresh Handler
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    const accessToken = response.data.data.accessToken
    localStorage.setItem('accessToken', accessToken)
    return accessToken
  } catch (error) {
    console.error("Error while refreshing token:", error.message)
    return null
  }
}

export default Axios
