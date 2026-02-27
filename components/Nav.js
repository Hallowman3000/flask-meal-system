'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['/', 'Home'],
  ['/menu', 'Menu'],
  ['/cart', 'Cart'],
  ['/admin', 'Admin'],
  ['/login', 'Login'],
  ['/register', 'Register'],
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/">Meal Hub</Link>
        <nav className="links">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
