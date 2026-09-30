import { useEffect, useState } from "react";
import { getPurposes } from "./api.js";

export default function PurposeFeed({ onBack }) {
  const [purposes, setPurposes] = useState([]);
  const [requestedIds, setRequestedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPurposes() {
      try {
        const savedPurposes = await getPurposes();
        setPurposes(savedPurposes);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPurposes();
  }, []);

  function requestConnection(id) {
    setRequestedIds([...requestedIds, id]);
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
          Relevant purposes published around Bengaluru.
        </p>

        {isLoading && <p className="subtitle">Loading purposes…</p>}

        {error && <p className="form-error">{error}</p>}

        {!isLoading && !error && purposes.length === 0 && (
          <div className="empty-state">
            <h2>No purposes yet.</h2>
            <p>Be the first person to publish a purpose in Bengaluru.</p>
          </div>
        )}

        <div className="purpose-grid">
          {purposes.map((person, index) => {
            const requested = requestedIds.includes(person.id);
            const match = Math.max(72, 92 - index * 6);

            return (
              <article className="purpose-card" key={person.id}>
                <div className="card-top">
                  <span className="match-score">{match}% match</span>
                  <span className="area">{person.area}</span>
                </div>

                <h2>{person.name}</h2>
                <p className="role">Purpose profile</p>
                <p className="purpose-text">{person.purpose}</p>

                <div className="card-bottom">
                  <span>{person.timeframe}</span>
                  <button
                    className={requested ? "requested-button" : "secondary"}
                    disabled={requested}
                    onClick={() => requestConnection(person.id)}
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