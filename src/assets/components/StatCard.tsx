import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: Props) {
  return (
    <div className="stat-card">
      <div
        className="stat-card-accent"
        style={{ background: color }}
      />

      <div className="stat-card-inner">

        <div>
          <p className="stat-card-title">
            {title}
          </p>

          <h2 className="stat-card-value">
            {value}
          </h2>

          <p className="stat-card-subtitle">
            {subtitle}
          </p>
        </div>

        <div
          className="stat-card-icon-wrap"
          style={{
            backgroundColor: `${color}15`,
          }}
        >
          <Icon
            size={22}
            color={color}
          />
        </div>

      </div>
    </div>
  );
}