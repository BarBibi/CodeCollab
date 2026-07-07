'use client'

import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeIcon() {
    const { theme, toggleTheme } = useContext(ThemeContext)

    return (
        <button 
            onClick={toggleTheme} 
            style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--text-primary)',
                marginRight: '1rem'
            }}
        >
            {theme === 'light' ? <Moon /> : <Sun />}
        </button>
    )
}