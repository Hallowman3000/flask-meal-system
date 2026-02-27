import './globals.css';
import Nav from '../components/Nav';

export const metadata = {
  title: 'Meal Hub',
  description: 'Meal ordering system built with Next.js and React.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
