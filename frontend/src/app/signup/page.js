'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import styles from './signup.module.css'

/**
 * SignUpPage Component
 * 
 * This page provides a form for users to create a new account.
 * It captures the user's username, email, and password and uses the AuthContext to register them.
 * 
 * @returns {JSX.Element} The sign-up page with a form.
 */
export default function SignUpPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState(null)
    const { register } = useContext(AuthContext)

    /**
     * Handles changes to the form inputs.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    /**
     * Handles the form submission to register the new user.
     * @param {React.FormEvent} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await register(formData.username, formData.email, formData.password)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        }
    }

    return (
        <main className={styles.page}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Create an Account</h2>
                {error && <p className={styles.error}>{error}</p>}
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                />
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
                <button type="submit">Sign Up</button>
            </form>
        </main>
    )
}