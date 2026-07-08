'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ThemeIcon from './ThemeIcon'
import styles from './Navbar.module.css'

/**
 * Navbar Component
 * 
 * This component renders the main navigation bar for the application.
 * It displays navigation links based on the user's authentication status and includes a theme toggle button.
 * 
 * @returns {JSX.Element} The application's navigation bar.
 */
export default function Navbar() {
    const { user, logout } = useContext(AuthContext)

    return (
        <nav className={styles.navbar}>
            <div className={styles.navLeft}>
                <Link href="/" className={styles.logo}>
                    <Image src="/icon.svg" alt="CodeCollab Logo" width={32} height={32} />
                    <span>CodeCollab</span>
                </Link>
                <ul className={styles.navLinks}>
                    <li><Link href="/">Home</Link></li>
                    {user ? (
                        <>
                            <li><Link href="/profile">Profile</Link></li>
                            <li><Link href="/chat">Chat</Link></li>
                            <li>
                                <button onClick={logout}>
                                    Logout ({user.username})
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link href="/signin">Sign In</Link></li>
                            <li><Link href="/signup">Sign Up</Link></li>
                        </>
                    )}
                </ul>
            </div>
            <div className={styles.navRight}>
                <ThemeIcon />
            </div>
        </nav>
    )
}