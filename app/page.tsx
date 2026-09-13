"use client";

import { useEffect, useMemo, useState } from "react";

type Step = "welcome" | "profile" | "purpose" | "summary" | "discover" | "requests";

const people = [
  { name: "Ananya Rao", role: "Co-founder · Sustainable consumer brand", area: "Koramangala", match: 96, initials: "AR", color: "#ffd8cc", why: "You both need an operating partner and value consumer experience." },
  { name: "Vikram Menon", role: "Angel investor · Consumer & retail", area: "Indiranagar", match: 92, initials: "VM", color: "#c8e8ff", why: "Your investment range and category align." },
  { name: "Neha Iyer", role: "Growth consultant · F&B", area: "HSR Layout", match: 89, initials: "NI", color: "#e8d6ff", why: "She offers local launch and growth support." },
  { name: "Karan Shah", role: "Business partner · Operations", area: "Whitefield", match: 86, initials: "KS", color: "#d5f5d4", why: "Your needs and his operating expertise are complementary." },
];

function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  return <span className={`avatar avatar-${size}`} style={{ background: color }}>{initials}</span>;
}

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("Chaitanya Bonagiri");
  const [area, setArea] = useState("HSR Layout, Bengaluru");
  const [role, setRole] = useState("Founder / entrepreneur");
  const [purpose, setPurpose] = useState("Looking for a co-founder with ₹1 crore investment for a coffee shop in Bangalore. I can invest the same amount and handle operations. Let’s build together.");
  const [notice, setNotice] = useState<{ title: string; detail: string } | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const activeStep = useMemo(() => ["welcome", "profile", "purpose", "summary", "discover"].indexOf(step) + 1, [step]);
  useEffect(() => {
    void fetch("/api/onboarding").then(async (response) => {
      if (!response.ok) return;
      const data = await response.json() as { profile?: { fullName: string; area: string; role: string } | null; purpose?: { statement: string } | null };
      if (data.profile) { setName(data.profile.fullName); setArea(data.profile.area); setRole(data.profile.role); }
      if (data.purpose) setPurpose(data.purpose.statement);
    }).catch(() => undefined);
  }, []);

  const saveAndContinue = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/onboarding", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ fullName: name, area, role, statement: purpose }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) { setNotice({ title: "Couldn’t save yet", detail: data.error ?? "Please try again." }); return; }
      setNotice({ title: "Profile and purpose saved", detail: "Only you can edit this information." });
      setStep("summary");
    } catch { setNotice({ title: "Couldn’t save yet", detail: "Check your connection and try again." }); }
    finally { setSaving(false); }
  };

  const request = (person: string) => { setNotice({ title: `Request sent to ${person}`, detail: "They will see why you want to connect." }); setSent((items) => [...new Set([...items, person])]); };

  return <main className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => setStep("welcome")} aria-label="Purpos home"><span>p</span>urpos</button><div className="location">⌖ Bengaluru, India</div><button className="quiet-button" onClick={() => setStep("requests")}>Requests {sent.length ? <b>{sent.length}</b> : ""}</button></header>
    <section className="workspace"><aside className="progress" aria-label="Onboarding progress">{["Welcome", "Profile", "Your purpose", "Review", "Discover"].map((label, i) => <div className={i + 1 <= activeStep ? "progress-item active" : "progress-item"} key={label}><span>{i + 1}</span><small>{label}</small></div>)}</aside>
      <div className="screen">
        {step === "welcome" && <section className="welcome-card"><div className="eyebrow">Bengaluru beta</div><div className="mark">p</div><h1>Every connection<br />has a <em>purpose.</em></h1><p>Tell us what you are looking for. Purpos helps you meet the right people—not collect more followers.</p><div className="value-list"><span>◎ Share a clear need</span><span>♧ Discover complementary people</span><span>↗ Request a private connection</span></div><button className="primary" onClick={() => setStep("profile")}>Create your profile <i>→</i></button><button className="link-button" onClick={() => setStep("discover")}>Explore a demo first</button></section>}
        {step === "profile" && <section className="form-card"><span className="step-label">01 / Create profile</span><h2>Start with the basics.</h2><p>This makes your matches local and relevant.</p><label>Full name<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Location<input value={area} onChange={(e) => setArea(e.target.value)} /></label><label>Your role<select value={role} onChange={(e) => setRole(e.target.value)}><option>Founder / entrepreneur</option><option>Investor</option><option>Professional</option><option>Freelancer / consultant</option><option>Service provider</option></select></label><button className="primary" onClick={() => setStep("purpose")}>Continue <i>→</i></button></section>}
        {step === "purpose" && <section className="form-card purpose-card"><span className="step-label">02 / What brings you here?</span><h2>Say it naturally.</h2><p>Describe what you need, what you offer, and the people you hope to meet.</p><label>Your purpose<textarea value={purpose} maxLength={500} onChange={(e) => setPurpose(e.target.value)} /></label><div className="chips"><button>Investment</button><button>Co-founder</button><button>Skills</button><button>Local business</button></div><button className="primary" disabled={saving} onClick={saveAndContinue}>{saving ? "Saving…" : "Structure my purpose"} <i>✦</i></button></section>}
        {step === "summary" && <section className="summary-card"><span className="step-label">03 / Review purpose</span><h2>Here’s what we understood.</h2><p>You can edit any detail before it becomes visible.</p><div className="purpose-quote">“{purpose}”</div><div className="summary-grid"><span><b>Intent</b> Find a co-founder</span><span><b>Category</b> Coffee shop / F&B</span><span><b>Capital</b> ₹1 crore</span><span><b>Location</b> {area}</span><span><b>What you offer</b> Investment + operations</span><span><b>Commitment</b> Full-time</span></div><div className="actions"><button className="secondary" onClick={() => setStep("purpose")}>Edit purpose</button><button className="primary" onClick={() => setStep("discover")}>Find my matches <i>→</i></button></div></section>}
        {step === "discover" && <section className="discover-card"><div className="discover-heading"><div><span className="step-label">03 / Discover people</span><h2>Your strongest matches</h2><p>Based on your purpose and Bengaluru location.</p></div><button className="filter">⚙ Filters</button></div><div className="match-grid">{people.map((person) => <article className="match-card" key={person.name}><div className="match-top"><Avatar initials={person.initials} color={person.color} /><span className="score">{person.match}%<small>match</small></span></div><h3>{person.name}</h3><p>{person.role}</p><small>⌖ {person.area}</small><div className="why">Why this match: {person.why}</div><button className={sent.includes(person.name) ? "sent-button" : "card-button"} onClick={() => request(person.name)}>{sent.includes(person.name) ? "Request sent ✓" : "Connect"}</button></article>)}</div></section>}
        {step === "requests" && <section className="requests-card"><span className="step-label">Connection requests</span><h2>Keep connections intentional.</h2><div className="request-tabs"><button className="tab active">Sent ({sent.length})</button><button className="tab">Received</button></div>{sent.length === 0 ? <div className="empty">No requests yet. Return to Discover to find people with a complementary purpose.</div> : sent.map((person) => { const p = people.find((x) => x.name === person)!; return <article className="request-row" key={person}><Avatar initials={p.initials} color={p.color} /><div><strong>{p.name}</strong><p>{p.role} · {p.area}</p></div>{accepted && person === "Ananya Rao" ? <span className="accepted">Connected ✓</span> : <button className="secondary" onClick={() => person === "Ananya Rao" && setAccepted(true)}>{person === "Ananya Rao" ? "Simulate accept" : "Pending"}</button>}</article>})}</section>}
      </div></section>
    {notice && <div className="toast"><span>✓</span><div><strong>{notice.title}</strong><small>{notice.detail}</small></div><button onClick={() => setNotice(null)}>×</button></div>}
  </main>;
}
