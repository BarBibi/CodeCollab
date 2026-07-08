'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import styles from './signin.module.css'

/**
 * SignInPage Component
 * 
 * This page provides a form for users to sign in to their accounts.
 * It captures the user's email and password and uses the AuthContext to log them in.
 * 
 * @returns {JSX.Element} The sign-in page with a form.
 */
export default function SignInPage() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState(null)
    const { login } = useContext(AuthContext)

    /**
     * Handles changes to the form inputs.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    /**
     * Handles the form submission to log the user in.
     * @param {React.FormEvent} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await login(formData.email, formData.password)
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        }
    }

    return (
        <main className={styles.page}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Sign In</h2>
                {error && <p className={styles.error}>{error}</p>}
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </main>
    )
}