interface Props {
    title: string;
    value: number;
  }
  
  export default function KpiCard({
    title,
    value,
  }: Props) {
    return (
      <div className="kpi-card">
  
        <p className="kpi-title">
          {title}
        </p>
  
        <h2 className="kpi-value">
          {value}
        </h2>
  
      </div>
    );
  }