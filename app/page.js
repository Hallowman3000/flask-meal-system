import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

async function getHomeContent() {
  try {
    const file = path.join(process.cwd(), 'public', 'assets', 'data', 'home-content.json');
    const content = await fs.readFile(file, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { headline: 'Welcome to Meal Hub', subheadline: 'Browse meals and order instantly.', featuredItems: [] };
  }
}

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <div className="home-figma">
      <section className="figma-hero card">
        <div className="figma-hero-content">
          <p className="figma-kicker">Figma-inspired meal delivery template</p>
          <h1>{content.headline}</h1>
          <p className="figma-subheadline">{content.subheadline}</p>
          <div className="figma-actions">
            <Link href="/menu" className="figma-btn-primary">
              Browse menu
            </Link>
            <Link href="/register" className="figma-btn-secondary">
              Create account
            </Link>
          </div>
        </div>

        <div className="figma-highlight">
          <h2>Why customers choose Meal Hub</h2>
          <ul>
            <li>Curated dishes from local chefs</li>
            <li>Real-time order updates</li>
            <li>Fast checkout and secure payment flow</li>
          </ul>
        </div>
      </section>

      <section className="figma-featured">
        <div className="figma-section-heading">
          <p>Featured right now</p>
          <h2>Popular picks from our kitchen</h2>
        </div>
        <div className="grid grid-3">
          {content.featuredItems?.map((item) => (
            <article className="card figma-item" key={item.title}>
              <img className="thumb" src={item.image} alt={item.title} />
              <div className="figma-item-content">
                <h3>{item.title}</h3>
                <p className="muted">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
