'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ThemeIcon from './ThemeIcon'
import styles from './Navbar.module.css'

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