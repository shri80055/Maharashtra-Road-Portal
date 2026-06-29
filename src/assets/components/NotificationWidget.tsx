import { CheckCircle2, Clock, FileText, Bell, ArrowRight } from "lucide-react";

const notifications = [
  {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Road MH001 Approved",
    time: "2h ago",
    unread: true,
  },
  {
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Draft saved successfully",
    time: "4h ago",
    unread: true,
  },
  {
    icon: Bell,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    title: "MIS report available",
    time: "Yesterday",
    unread: false,
  },
  {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "MH005 deadline in 2 days",
    time: "Yesterday",
    unread: false,
  },
];

export default function NotificationWidget() {
  return (
    <div className="widget-shell widget-notification">
      <div className="widget-header">
        <div className="widget-header-group">
          <h3 className="widget-heading">Notifications</h3>
          <span className="widget-count-badge">
            2
          </span>
        </div>
        <button className="widget-link-button">
          Mark all read
        </button>
      </div>

      <div className="widget-list">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <div
              key={i}
              className={`notification-item ${
                i < notifications.length - 1 ? "notification-item-divider" : ""
              }`}
            >
              {n.unread && (
                <span className="notification-unread-dot" />
              )}

              <div className={`notification-icon-wrap ${n.bg}`}>
                <Icon size={13} className={n.color} />
              </div>

              <div className="notification-content">
                <p className={`notification-title ${n.unread ? "notification-title-unread" : "notification-title-read"}`}>
                  {n.title}
                </p>
                <p className="notification-time">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="widget-footer">
        <button className="widget-link-button widget-link-inline">
          View all notifications <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}