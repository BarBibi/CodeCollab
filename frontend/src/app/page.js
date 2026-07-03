import Link from 'next/link';

export default function HomePage() {
    return (
        <main>
            <h1>Welcome to CodeCollab</h1>
            <p>Connect with developers, share snippets, and review code.</p>
            <nav>
                <ul>
                    <li><Link href="/signin">Sign In</Link></li>
                    <li><Link href="/signup">Sign Up</Link></li>
                </ul>
            </nav>
        </main>
    );
}