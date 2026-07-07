import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

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