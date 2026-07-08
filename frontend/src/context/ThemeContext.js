'use client'

import { createContext, useState, useEffect } from 'react'

/**
 * @typedef {'light' | 'dark'} Theme
 */

/**
 * @typedef {object} ThemeContextType
 * @property {Theme} theme - The current theme of the application.
 * @property {() => void} toggleTheme - A function to toggle the theme between light and dark.
 */

/**
 * The theme context for the application.
 * @type {React.Context<ThemeContextType>}
 */
export const ThemeContext = createContext()

/**
 * ThemeProvider Component
 * 
 * This component provides theme state and a function to toggle the theme to its children.
 * It manages the application's theme, persisting the user's preference in local storage.
 * 
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The theme provider.
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme')
        if (storedTheme) {
            setTheme(storedTheme)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}