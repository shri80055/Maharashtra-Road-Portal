import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export type ModuleAccent = "teal" | "orange" | "blue" | "green" | "amber";

export interface ModuleCardModel {
  title: string;
  description: string;
  icon: LucideIcon;
  cta: string;
  accent: ModuleAccent;
  onClick?: () => void;
}

const accentClass: Record<ModuleAccent, string> = {
  teal: "rr-module-accent-teal",
  orange: "rr-module-accent-orange",
  blue: "rr-module-accent-blue",
  green: "rr-module-accent-green",
  amber: "rr-module-accent-amber",
};

export default function ModuleCard({ title, description, icon: Icon, cta, accent, onClick }: ModuleCardModel) {
  return (
    <button type="button" className={`rr-module ${accentClass[accent]}`} onClick={onClick}>
      <div className="rr-module-top">
        <div className="rr-module-icon">
          <Icon size={18} />
        </div>
        <div className="rr-module-title-wrap">
          <h4 className="rr-module-title">{title}</h4>
        </div>
      </div>

      <p className="rr-module-desc">{description}</p>

      <div className="rr-module-cta">
        <span className="rr-module-cta-text">{cta}</span>
        <ArrowRight size={16} />
      </div>
    </button>
  );
}

