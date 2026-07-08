import axios from 'axios'

/**
 * Axios instance for making API requests to the backend.
 * It automatically includes the authorization token from local storage in request headers.
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Intercepts outgoing requests to attach the authorization token.
 * The token is retrieved from local storage if available.
 */
api.interceptors.request.use(
    (config) => {
        // Ensure execution only on the client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api