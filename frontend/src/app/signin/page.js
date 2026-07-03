'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function SignInPage() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState(null)
    const { login } = useContext(AuthContext)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

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
        <main style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Sign In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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