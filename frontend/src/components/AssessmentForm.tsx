import { type FormEvent, useState } from "react";
import type { AssessEventRequest } from "../types/assessment";

interface AssessmentFormProps {
  loading: boolean;
  onSubmit: (payload: AssessEventRequest) => void;
}

function defaultDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

export function AssessmentForm({ loading, onSubmit }: AssessmentFormProps) {
  const [eventName, setEventName] = useState("Wedding Ceremony");
  const [location, setLocation] = useState("Lekki");
  const [eventDate, setEventDate] = useState(defaultDate);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ eventName, location, eventDate });
  }

  return (
    <form className="assessment-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Event name</span>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Wedding Ceremony"
            required
            disabled={loading}
          />
        </label>

        <label className="field">
          <span>Location</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Lekki, Lagos"
            required
            disabled={loading}
          />
        </label>

        <label className="field">
          <span>Event date</span>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            disabled={loading}
          />
        </label>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Assessing weather…
          </>
        ) : (
          "Check suitability"
        )}
      </button>
    </form>
  );
}
