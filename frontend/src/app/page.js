import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

/**
 * HomePage Component
 * 
 * This is the main landing page of the CodeCollab application.
 * It provides a welcoming message and navigation links for users to sign in or sign up.
 * 
 * @returns {JSX.Element} The rendered homepage with a logo, welcome text, and call-to-action buttons.
 */
export default function HomePage() {
    return (
        <main className={styles.page}>
            <div className={styles.main}>
                <div className={styles.intro}>
                    <Image
                        src="/icon.svg"
                        alt="CodeCollab Logo"
                        width={100}
                        height={100}
                        className={styles.logo}
                    />
                    <h1>Welcome to CodeCollab</h1>
                    <p>Connect with developers, share snippets, and review code.</p>
                    <div className={styles.ctas}>
                        <Link className={styles.secondary} href="/signin">Sign In</Link>
                        <Link className={styles.primary} href="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}