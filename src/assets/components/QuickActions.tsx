import { FilePlus, FolderOpen, FileCheck, BarChart3, ArrowRight } from "lucide-react";


export default function QuickActions() {

    


      const actions = [
        {
          title: "Register Road",
          description: "Start a new road registration entry",
          icon: FilePlus,
          accent: "teal" as const,
          
        },
        {
          title: "Draft Records",
          description: "Continue editing saved drafts",
          icon: FolderOpen,
          accent: "blue" as const,
          badge: "2",
        },
        {
          title: "Submitted",
          description: "View all submitted registrations",
          icon: FileCheck,
          accent: "emerald" as const,
        },
        {
          title: "MIS Reports",
          description: "Generate and download reports",
          icon: BarChart3,
          accent: "violet" as const,
        },
      ];
      
      const accentMap = {
        teal: {
          bg: "bg-teal-500/10",
          text: "text-teal-400",
          border: "border-teal-500/20",
          hover: "hover:border-teal-500/40 hover:bg-teal-500/[0.07]",
        },
        blue: {
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          border: "border-blue-500/20",
          hover: "hover:border-blue-500/40 hover:bg-blue-500/[0.07]",
        },
        emerald: {
          bg: "bg-emerald-500/10",
          text: "text-emerald-400",
          border: "border-emerald-500/20",
          hover: "hover:border-emerald-500/40 hover:bg-emerald-500/[0.07]",
        },
        violet: {
          bg: "bg-violet-500/10",
          text: "text-violet-400",
          border: "border-violet-500/20",
          hover: "hover:border-violet-500/40 hover:bg-violet-500/[0.07]",
        },
      };
  return (
    <div className="quick-actions">
      {/* <div className="quick-actions-header">
        <h3 className="quick-actions-title">
          Quick Actions
        </h3>
      </div> */}
      <div className="quick-actions-grid">
        {actions.map((item) => {
          const Icon = item.icon;
          const a = accentMap[item.accent];
          return (
            <button
              key={item.title}
              className={`quick-action-card ${a.border} ${a.hover}`}
            >
              <div className="quick-action-top">
                <div className={`quick-action-icon-wrap ${a.bg}`}>
                  <Icon size={17} className={a.text} />
                </div>
                {item.badge && (
                  <span className="quick-action-badge">
                    {item.badge}
                  </span>
                )}
              </div>
              <div>
                <p className="quick-action-name">{item.title}</p>
                <p className="quick-action-description">{item.description}</p>
              </div>
              <ArrowRight size={13} className={`quick-action-arrow ${a.text}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}