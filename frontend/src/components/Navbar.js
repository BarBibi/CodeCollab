'use client'

import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ThemeToggleButton from './ThemeToggleButton'

export default function Navbar() {
    const { user, logout } = useContext(AuthContext)

    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <ul style={{ display: 'flex', gap: '15px', listStyle: 'none' }}>
                <li><Link href="/">Home</Link></li>
                {user ? (
                    <>
                        <li><Link href="/profile">Profile</Link></li>
                        <li><Link href="/chat">Chat</Link></li>
                        <li>
                            <button onClick={logout} style={{ padding: '0.5rem 1rem' }}>
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
            <ThemeToggleButton />
        </nav>
    )
}