import { promises as fs } from 'fs';
import path from 'path';

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
    <>
      <section className="hero">
        <p>Meal ordering simplified</p>
        <h1>{content.headline}</h1>
        <p>{content.subheadline}</p>
      </section>
      <section className="grid grid-3" style={{ marginTop: '1rem' }}>
        {content.featuredItems?.map((item) => (
          <article className="card" key={item.title}>
            <img className="thumb" src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p className="muted">{item.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}
