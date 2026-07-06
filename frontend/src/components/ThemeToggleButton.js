'use client'

import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useContext(ThemeContext)

    const buttonStyle = {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff',
    }

    return (
        <button onClick={toggleTheme} style={buttonStyle}>
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
    )
}