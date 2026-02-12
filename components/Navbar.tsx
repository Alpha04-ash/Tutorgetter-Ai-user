'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, FileText, User } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className="cosmic-text-gradient">Softclub</span>
                </Link>

                <div className={styles.links}>
                    <Link href="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                    <Link href="/terms" className={`${styles.link} ${isActive('/terms') ? styles.active : ''}`}>
                        <FileText size={18} />
                        <span>Terms</span>
                    </Link>
                    {/* We can add more links here later, e.g. Login or Dashboard if we had auth state */}
                </div>
            </div>
        </nav>
    );
}
