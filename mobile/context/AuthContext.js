import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token')
      const storedUser = await AsyncStorage.getItem('user')

      if (token && storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/signin', { email, password })
      await AsyncStorage.setItem('token', data.token)
      await AsyncStorage.setItem('user', JSON.stringify(data))
      setUser(data)
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message)
      throw error
    }
  }

  const register = async (username, email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { username, email, password })
      await AsyncStorage.setItem('token', data.token)
      await AsyncStorage.setItem('user', JSON.stringify(data))
      setUser(data)
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message)
      throw error
    }
  }

  const logout = async () => {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}