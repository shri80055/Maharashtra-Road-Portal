import { ChevronRight, LayoutDashboard } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs?: Crumb[];
}

export default function Breadcrumb({ crumbs = [{ label: "Dashboard" }] }: Props) {
  return (
    <nav className="app-breadcrumb">
      <LayoutDashboard size={12} className="app-breadcrumb-icon" />
      <ChevronRight size={11} className="app-breadcrumb-separator" />
      {crumbs.map((crumb, i) => (
        <span key={i} className="app-breadcrumb-item">
          {i > 0 && <ChevronRight size={11} className="app-breadcrumb-separator" />}
          <span
            className={i === crumbs.length - 1 ? "app-breadcrumb-current" : "app-breadcrumb-link"}
          >
            {crumb.label}
          </span>
        </span>
      ))}
    </nav>
  );
}