import { AlertTriangle, ArrowRight, X } from "lucide-react";
import { useState } from "react";

export default function AlertCard() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="alert-card">
      <div className="alert-card-icon-wrap">
        <AlertTriangle size={15} className="alert-card-icon" />
      </div>

      <div className="alert-card-content">
        <p className="alert-card-title">
          2 Records Awaiting Approval
        </p>
        <p className="alert-card-description">
          Road MH003 and MH005 require Talathi review before submission deadline.
        </p>
      </div>

      <button className="alert-card-action">
        Review
        <ArrowRight size={12} />
      </button>

      <button
        onClick={() => setDismissed(true)}
        className="alert-card-close"
      >
        <X size={15} />
      </button>
    </div>
  );
}