import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
    return (
        <main className={styles.page}>
            <div className={styles.main}>
                <div className={styles.intro}>
                    <h1>Welcome to CodeCollab</h1>
                    <p>Connect with developers, share snippets, and review code.</p>
                    <div className={styles.ctas}>
                        <Link className={styles.primary} href="/signup">Sign Up</Link>
                        <Link className={styles.secondary} href="/signin">Sign In</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}