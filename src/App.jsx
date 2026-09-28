import { useState } from "react";
import PurposeForm from "./PurposeForm.jsx";
import PurposeFeed from "./PurposeFeed.jsx";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [publishedPurpose, setPublishedPurpose] = useState(null);

  function publishPurpose(formData) {
    setPublishedPurpose(formData);
    setScreen("published");
  }

  if (screen === "create") {
    return (
      <PurposeForm
        onBack={() => setScreen("home")}
        onPublish={publishPurpose}
      />
    );
  }

  if (screen === "discover") {
    return <PurposeFeed onBack={() => setScreen("home")} />;
  }

  if (screen === "published") {
    return (
      <main className="page">
        <nav className="nav">
          <a className="brand" href="/">purpos</a>
          <span className="beta">BENGALURU BETA</span>
        </nav>

        <section className="hero">
          <p className="eyebrow">PURPOSE PUBLISHED</p>
          <h1>You are ready to be discovered.</h1>
          <p className="subtitle">
            Thanks, {publishedPurpose.name}. We will look for relevant people
            around {publishedPurpose.area}.
          </p>

          <div className="actions">
            <button className="primary" onClick={() => setScreen("discover")}>
              Explore connections
            </button>
            <button className="secondary" onClick={() => setScreen("home")}>
              Back to home
            </button>
          </div>
        </section>
      </main>
    );
  }

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
          <button className="primary" onClick={() => setScreen("create")}>
            Create your purpose
          </button>
          <button className="secondary" onClick={() => setScreen("discover")}>
            Explore connections
          </button>
        </div>
      </section>
    </main>
  );
}