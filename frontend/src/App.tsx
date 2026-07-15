import { useState } from "react";
import { assessEvent, AssessApiError } from "./api/assess";
import { AssessmentForm } from "./components/AssessmentForm";
import { AssessmentResult } from "./components/AssessmentResult";
import { ErrorAlert } from "./components/ErrorAlert";
import type { AssessEventData, AssessEventRequest } from "./types/assessment";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessEventData | null>(null);
  const [error, setError] = useState<{
    message: string;
    fieldErrors?: Record<string, string[]>;
  } | null>(null);

  async function handleSubmit(payload: AssessEventRequest) {
    setLoading(true);
    setError(null);

    try {
      const data = await assessEvent(payload);
      setResult(data);
    } catch (err) {
      setResult(null);

      if (err instanceof AssessApiError) {
        setError({ message: err.message, fieldErrors: err.fieldErrors });
      } else {
        setError({
          message: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-badge">EventCast</div>
        <h1>Plan outdoor events with confidence</h1>
        <p>
          Enter your event details and get an instant weather suitability
          score with risks and recommendations.
        </p>
      </header>

      <main className="content">
        <section className="form-card">
          <AssessmentForm loading={loading} onSubmit={handleSubmit} />
          {error && (
            <ErrorAlert
              message={error.message}
              fieldErrors={error.fieldErrors}
            />
          )}
        </section>

        {result && <AssessmentResult data={result} />}
      </main>
    </div>
  );
}
