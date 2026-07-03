'use client'

import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '../services/api'

export const AuthContext = createContext()

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