import { Inter } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ThemeManager from '../components/ThemeManager'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'CodeCollab',
    description: 'A social network for developers',
    icons: {
        icon: '/icon.svg',
    },
}

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