import { CalendarDays, Activity } from "lucide-react";

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function WelcomeBanner() {
  return (
    <div className="welcome-banner">
      <div className="welcome-orb-large" />
      <div className="welcome-orb-small" />

      <div
        className="welcome-grid-lines"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="welcome-content">
        <div>
          <div className="welcome-pill-row">
            <span className="welcome-pill">
              <Activity size={9} />
              Live Portal
            </span>
          </div>
          <h1 className="welcome-title">
            Maharashtra Road Registration Portal
          </h1>
          <p className="welcome-subtitle">
            Monitor registrations, approvals and district records — Talathi Level Administration
          </p>
        </div>

        <div className="welcome-date-chip">
          <CalendarDays size={13} className="welcome-date-icon" />
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
}