import { Mail, Linkedin, Github } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.contactLinks}>
                <a href="mailto:barbibi7556@gmail.com" aria-label="Email">
                    <Mail />
                </a>
                <a href="https://www.linkedin.com/in/bar-bibi-computer-science" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin />
                </a>
                <a href="https://github.com/BarBibi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github />
                </a>
            </div>
            <p>© 2026 Bar Bibi - Created for Client-Server Side Development Course</p>
        </footer>
    )
}