import type { AssessEventData } from "../types/assessment";
import {
  formatDate,
  formatProfile,
  weatherCodeLabel,
} from "../utils/weather";
import { ScoreRing } from "./ScoreRing";

interface AssessmentResultProps {
  data: AssessEventData;
}

export function AssessmentResult({ data }: AssessmentResultProps) {
  const { event, location, weather, assessment } = data;

  return (
    <section className="result-panel" aria-live="polite">
      <div className="result-header">
        <div>
          <p className="eyebrow">Assessment result</p>
          <h2>{event.name}</h2>
          <p className="result-meta">
            {location.city}, {location.country} · {formatDate(event.date)} ·{" "}
            <span className="profile-badge">{formatProfile(event.profile)}</span>
          </p>
        </div>
        <ScoreRing score={assessment.score} rating={assessment.rating} />
      </div>

      <p className="result-summary">{assessment.summary}</p>

      <div className="weather-grid">
        <article className="stat-card">
          <span className="stat-label">Conditions</span>
          <strong>{weatherCodeLabel(weather.weatherCode)}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Temperature</span>
          <strong>
            {weather.minTemperature}° – {weather.maxTemperature}°C
          </strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Precipitation</span>
          <strong>{weather.precipitation} mm</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Wind speed</span>
          <strong>{weather.windSpeed} km/h</strong>
        </article>
      </div>

      <div className="insights-grid">
        <article className="insight-card">
          <h3>Risks</h3>
          {assessment.risks.length > 0 ? (
            <ul>
              {assessment.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">No significant risks identified.</p>
          )}
        </article>

        <article className="insight-card">
          <h3>Recommendations</h3>
          {assessment.recommendations.length > 0 ? (
            <ul>
              {assessment.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">No additional recommendations.</p>
          )}
        </article>
      </div>
    </section>
  );
}
