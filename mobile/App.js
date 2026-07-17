import React from 'react'
import { AuthProvider } from './context/AuthContext'
import AppNavigator from './navigation/AppNavigator'

/**
 * The root component of the application.
 * It wraps the entire app with the authentication provider and the main navigator.
 * @returns {JSX.Element} The main application component.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  )
}