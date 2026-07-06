import { Inter } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import ThemeManager from '../components/ThemeManager'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'CodeCollab',
    description: 'A social network for developers'
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <ThemeProvider>
                        <ThemeManager>
                            <Navbar />
                            <div className="container">
                                {children}
                            </div>
                        </ThemeManager>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}