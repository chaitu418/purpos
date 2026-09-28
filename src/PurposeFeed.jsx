import { useState } from "react";

const samplePurposes = [
  {
    name: "Ananya Rao",
    area: "Indiranagar",
    role: "D2C skincare founder",
    purpose:
      "Looking for a performance marketer to help validate a Bengaluru-first launch.",
    timeframe: "This month",
    match: 92,
  },
  {
    name: "Rahul Menon",
    area: "HSR Layout",
    role: "Product designer",
    purpose:
      "Looking to join an early-stage startup solving a real local problem.",
    timeframe: "This week",
    match: 88,
  },
  {
    name: "Meera Iyer",
    area: "Koramangala",
    role: "Community builder",
    purpose:
      "Seeking founders who want to run small, useful offline events for builders.",
    timeframe: "Within 3 months",
    match: 81,
  },
];

export default function PurposeFeed({ onBack }) {
  const [requestedNames, setRequestedNames] = useState([]);

  function requestConnection(name) {
    setRequestedNames([...requestedNames, name]);
  }

  return (
    <main className="page">
      <nav className="nav">
        <button className="text-button" onClick={onBack}>
          ← Back
        </button>
        <span className="beta">BENGALURU BETA</span>
      </nav>

      <section className="discover-section">
        <p className="eyebrow">DISCOVER</p>
        <h1>People with a reason to connect.</h1>
        <p className="subtitle">
          A curated starting set of relevant purposes around Bengaluru.
        </p>

        <div className="purpose-grid">
          {samplePurposes.map((person) => {
            const requested = requestedNames.includes(person.name);

            return (
              <article className="purpose-card" key={person.name}>
                <div className="card-top">
                  <span className="match-score">{person.match}% match</span>
                  <span className="area">{person.area}</span>
                </div>

                <h2>{person.name}</h2>
                <p className="role">{person.role}</p>
                <p className="purpose-text">{person.purpose}</p>

                <div className="card-bottom">
                  <span>{person.timeframe}</span>
                  <button
                    className={requested ? "requested-button" : "secondary"}
                    disabled={requested}
                    onClick={() => requestConnection(person.name)}
                  >
                    {requested ? "Request sent" : "Request connection"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}