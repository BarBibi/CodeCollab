'use client'

import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '../services/api'

/**
 * @typedef {object} User
 * @property {string} _id - The user's unique ID.
 * @property {string} username - The user's username.
 * @property {string} email - The user's email address.
 * @property {string} token - The user's authentication token.
 */

/**
 * @typedef {object} AuthContextType
 * @property {User|null} user - The currently authenticated user, or null if not authenticated.
 * @property {boolean} loading - A flag indicating if the authentication state is being loaded.
 * @property {(email: string, password: string) => Promise<void>} login - A function to log the user in.
 * @property {(username: string, email: string, password: string) => Promise<void>} register - A function to register a new user.
 * @property {() => void} logout - A function to log the user out.
 */

/**
 * The authentication context for the application.
 * @type {React.Context<AuthContextType>}
 */
export const AuthContext = createContext()

/**
 * AuthProvider Component
 * 
 * This component provides authentication state and functions to its children.
 * It manages the user's authentication status, including login, registration, and logout.
 * 
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The authentication provider.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkUserLoggedIn = () => {
            const token = localStorage.getItem('token')
            const storedUser = localStorage.getItem('user')
            
            if (token && storedUser) {
                setUser(JSON.parse(storedUser))
            }
            setLoading(false)
        }
        checkUserLoggedIn()
    }, [])

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/signin', { email, password })
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
            router.push('/profile')
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message)
            throw error
        }
    }

    const register = async (username, email, password) => {
        try {
            const { data } = await api.post('/auth/signup', { username, email, password })
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
            router.push('/profile')
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        router.push('/signin')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}