'use client'

import { useContext, useEffect } from 'react'
import { ThemeContext } from '../context/ThemeContext'

/**
 * ThemeManager Component
 * 
 * This component is responsible for applying the current theme to the application.
 * It listens for changes in the ThemeContext and updates the `data-theme` attribute on the `html` element.
 * 
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} The children wrapped by the theme manager.
 */
export default function ThemeManager({ children }) {
    const { theme } = useContext(ThemeContext)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return <>{children}</>
}