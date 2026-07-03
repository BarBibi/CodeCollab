'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
            <ul style={{ display: 'flex', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><Link href="/">Home</Link></li>
                {user ? (
                    <>
                        <li><Link href="/profile">Profile</Link></li>
                        <li><Link href="/chat">Chat</Link></li>
                        <li>
                            <button onClick={logout} style={{ cursor: 'pointer' }}>
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
        </nav>
    );
}