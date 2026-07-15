import type { AssessmentRating } from "../types/assessment";

interface ScoreRingProps {
  score: number;
  rating: AssessmentRating;
}

const RATING_CLASS: Record<AssessmentRating, string> = {
  Excellent: "rating-excellent",
  Good: "rating-good",
  Fair: "rating-fair",
  Poor: "rating-poor",
};

export function ScoreRing({ score, rating }: ScoreRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`score-ring ${RATING_CLASS[rating]}`}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle className="score-ring-track" cx="64" cy="64" r={radius} />
        <circle
          className="score-ring-progress"
          cx="64"
          cy="64"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring-content">
        <strong>{score}</strong>
        <span>{rating}</span>
      </div>
    </div>
  );
}
