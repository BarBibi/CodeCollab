'use client'

import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

/**
 * ThemeIcon Component
 * 
 * This component renders a button that allows the user to toggle the application's theme.
 * It displays a moon icon for light mode and a sun icon for dark mode.
 * 
 * @returns {JSX.Element} A button to toggle the theme.
 */
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