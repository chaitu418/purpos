import { useState } from "react";
import { createPurpose } from "./api.js";

export default function PurposeForm({ onBack, onPublish }) {
  const [form, setForm] = useState({
    name: "",
    area: "Bengaluru",
    purpose: "",
    timeframe: "This month",
    budget: "Not decided",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function submitForm(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const savedPurpose = await createPurpose(form);
      onPublish(savedPurpose);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page">
      <nav className="nav">
        <button className="text-button" onClick={onBack}>
          ← Back
        </button>
        <span className="beta">BENGALURU BETA</span>
      </nav>

      <section className="form-section">
        <p className="eyebrow">CREATE YOUR PURPOSE</p>
        <h1>What are you looking to make happen?</h1>
        <p className="subtitle">
          Share only what helps the right Bengaluru people find you.
        </p>

        <form className="purpose-form" onSubmit={submitForm}>
          <label>
            Your name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="For example, Chaitanya"
              required
            />
          </label>

          <label>
            Your Bengaluru area
            <input
              name="area"
              value={form.area}
              onChange={updateField}
              placeholder="For example, HSR Layout"
              required
            />
          </label>

          <label>
            Your purpose
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={updateField}
              placeholder="For example, I am looking for a technical co-founder for a local business-matching platform."
              rows="5"
              minLength="10"
              required
            />
          </label>

          <label>
            When do you want to start?
            <select
              name="timeframe"
              value={form.timeframe}
              onChange={updateField}
            >
              <option>This week</option>
              <option>This month</option>
              <option>Within 3 months</option>
              <option>Just exploring</option>
            </select>
          </label>

          <label>
            Budget
            <select name="budget" value={form.budget} onChange={updateField}>
              <option>Not decided</option>
              <option>Under ₹10,000</option>
              <option>₹10,000 – ₹50,000</option>
              <option>₹50,000+</option>
            </select>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish my purpose"}
          </button>
        </form>
      </section>
    </main>
  );
}