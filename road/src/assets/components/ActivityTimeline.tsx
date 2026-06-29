import { CheckCircle2, Clock, FileEdit, ArrowUpRight, ArrowRight } from "lucide-react";

const activity = [
  {
    id: "MH001",
    action: "Submitted for Review",
    district: "Pune",
    user: "Rahul Patil",
    time: "2 hours ago",
    status: "submitted" as const,
  },
  {
    id: "MH002",
    action: "Approved by Authority",
    district: "Nashik",
    user: "System",
    time: "4 hours ago",
    status: "approved" as const,
  },
  {
    id: "MH003",
    action: "Draft Saved",
    district: "Aurangabad",
    user: "Suresh Kadam",
    time: "Yesterday, 5:30 PM",
    status: "draft" as const,
  },
  {
    id: "MH004",
    action: "Record Updated",
    district: "Nagpur",
    user: "Priya Shinde",
    time: "Yesterday, 2:15 PM",
    status: "updated" as const,
  },
  {
    id: "MH005",
    action: "Pending Approval",
    district: "Kolhapur",
    user: "Mohan Jadhav",
    time: "2 days ago",
    status: "pending" as const,
  },
];

const statusConfig = {
  submitted: { icon: ArrowUpRight, color: "text-blue-400", bg: "bg-blue-500/10", dot: "bg-blue-400" },
  approved: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  draft: { icon: FileEdit, color: "text-white/40", bg: "bg-white/[0.05]", dot: "bg-white/30" },
  updated: { icon: FileEdit, color: "text-violet-400", bg: "bg-violet-500/10", dot: "bg-violet-400" },
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
};

const statusLabel = {
  submitted: "Submitted",
  approved: "Approved",
  draft: "Draft",
  updated: "Updated",
  pending: "Pending",
};

export default function ActivityTimeline() {
  return (
    <div className="widget-shell">
      <div className="widget-header">
        <div>
          <h3 className="widget-heading">Recent Activity</h3>
          <p className="widget-subheading">Last 48 hours across all districts</p>
        </div>
        <button className="widget-link-button widget-link-inline">
          View all <ArrowRight size={13} />
        </button>
      </div>

      <div className="activity-table-head">
        {["Road ID", "Action", "District", "User", "Status"].map((h) => (
          <span key={h} className="activity-head-cell">
            {h}
          </span>
        ))}
      </div>

      <div className="activity-table-body">
        {activity.map((item, i) => {
          const cfg = statusConfig[item.status];
          const Icon = cfg.icon;
          return (
            <div
              key={item.id}
              className={`activity-row ${
                i < activity.length - 1 ? "activity-row-divider" : ""
              }`}
            >
              <span className="activity-road-id">
                {item.id}
              </span>

              <div className="activity-action">
                <div className={`activity-action-icon ${cfg.bg}`}>
                  <Icon size={12} className={cfg.color} />
                </div>
                <span className="activity-action-text">{item.action}</span>
              </div>

              <span className="activity-cell-muted">{item.district}</span>

              <span className="activity-cell-muted">{item.user}</span>

              <div className="activity-status">
                <span className={`activity-status-dot ${cfg.dot}`} />
                <span className={`activity-status-text ${cfg.color}`}>
                  {statusLabel[item.status]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}