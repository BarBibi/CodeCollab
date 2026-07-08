import { Inter } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ThemeManager from '../components/ThemeManager'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

/**
 * Metadata for the application.
 * @type {import('next').Metadata}
 */
export const metadata = {
    title: 'CodeCollab',
    description: 'A social network for developers',
    icons: {
        icon: '/icon.svg',
    },
}

/**
 * RootLayout Component
 * 
 * This is the root layout for the entire application. It wraps all pages with necessary providers
 * (AuthProvider, ThemeProvider) and common UI elements like the Navbar and Footer.
 * 
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root layout structure.
 */
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AuthProvider>
                    <ThemeProvider>
                        <ThemeManager>
                            <Navbar />
                            <div className="container" style={{ flex: 1 }}>
                                {children}
                            </div>
                            <Footer />
                        </ThemeManager>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}