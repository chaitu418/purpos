export default function App() {
  return (
    <main className="page">
      <nav className="nav">
        <a className="brand" href="/">purpos</a>
        <span className="beta">BENGALURU BETA</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">FOR BUILDERS, FOUNDERS & CREATIVE PEOPLE</p>
        <h1>Every connection has a purpose.</h1>
        <p className="subtitle">
          Tell Bengaluru what you are building, looking for, or ready to offer.
          Meet people with a reason to connect.
        </p>

        <div className="actions">
          <button className="primary">Create your purpose</button>
          <button className="secondary">Explore connections</button>
        </div>
      </section>
    </main>
  );
}