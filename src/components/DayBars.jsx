import "./DayBars.css";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * The signature visual: a week of seven bars that begin scattered
 * (misaligned heights, slight rotation) and settle into one
 * perfectly even, aligned row — a literal reading of
 * "Every workday, perfectly aligned."
 *
 * size="lg" -> hero, full animated entrance, weekday labels
 * size="sm" -> quiet, idle version for secondary contexts (login rail)
 */
export default function DayBars({ size = "lg", animated = true }) {
  const isLg = size === "lg";

  return (
    <div className={`daybars daybars--${size}`} aria-hidden="true">
      {DAYS.map((d, i) => (
        <div
          className={`daybars__col ${animated ? "is-animated" : ""}`}
          key={i}
          style={{ "--i": i }}
        >
          <span className="daybars__bar" data-weekend={i >= 5 ? "true" : "false"} />
          {isLg && <span className="daybars__label mono">{d}</span>}
        </div>
      ))}
    </div>
  );
}
