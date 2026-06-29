import { MapPin } from "lucide-react";

type Option = { value: string; label: string };

interface Props {
  districtOptions?: Option[];
  talukaOptions?: Option[];
  villageOptions?: Option[];
  values: { district: string; taluka: string; village: string };
  disabled?: { taluka?: boolean; village?: boolean };
  onChange: (next: { district: string; taluka: string; village: string }) => void;
}

export default function GeoFiltersCard({
  districtOptions = [{ value: "", label: "Select District" }],
  talukaOptions = [{ value: "", label: "First select District" }],
  villageOptions = [{ value: "", label: "First select Taluka" }],
  values,
  disabled,
  onChange,
}: Props) {
  return (
    <section className="rr-card">
      <div className="rr-card-header">
        <div className="rr-card-icon">
          <MapPin size={16} />
        </div>
        <h3 className="rr-card-title">Geographical Administrative Filters</h3>
      </div>

      <div className="rr-filters-grid">
        <div className="rr-field">
          <label className="rr-label">District / जिला</label>
          <select
            className="rr-select"
            value={values.district}
            onChange={(e) =>
              onChange({ district: e.target.value, taluka: "", village: "" })
            }
          >
            {districtOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rr-field">
          <label className="rr-label">Taluka / तालुका</label>
          <select
            className="rr-select"
            value={values.taluka}
            disabled={!!disabled?.taluka}
            onChange={(e) => onChange({ ...values, taluka: e.target.value, village: "" })}
          >
            {talukaOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rr-field">
          <label className="rr-label">Village / गाव</label>
          <select
            className="rr-select"
            value={values.village}
            disabled={!!disabled?.village}
            onChange={(e) => onChange({ ...values, village: e.target.value })}
          >
            {villageOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

