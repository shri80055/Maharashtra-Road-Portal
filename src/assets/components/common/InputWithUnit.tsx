/**
 * InputWithUnit — number input with an attached unit selector dropdown.
 *
 * Usage:
 *   <InputWithUnit
 *     label="Road Length"
 *     labelMarathi="रस्त्याची अंदाजित लांबी"
 *     value={form.roadLength}
 *     unit={form.lengthUnit}
 *     units={[{ label: "m", value: "m" }, { label: "km", value: "km" }]}
 *     onValueChange={(v) => setField("roadLength", v)}
 *     onUnitChange={(u) => setField("lengthUnit", u)}
 *   />
 */

import { ChevronDown } from "lucide-react";

export interface UnitOption {
  label: string;
  value: string;
}

export interface InputWithUnitProps {
  label: string;
  labelMarathi?: string;
  required?: boolean;
  /** Numeric string value */
  value: string;
  onValueChange: (value: string) => void;
  /** Currently selected unit */
  unit: string;
  onUnitChange: (unit: string) => void;
  /** Available unit options */
  units: UnitOption[];
  placeholder?: string;
  min?: number;
  step?: number;
  error?: string;
  hint?: string;
  className?: string;
}

export default function InputWithUnit({
  label,
  labelMarathi,
  required = false,
  value,
  onValueChange,
  unit,
  onUnitChange,
  units,
  placeholder = "0.00",
  min = 0,
  step = 0.01,
  error,
  hint,
  className = "",
}: InputWithUnitProps) {
  const inputCls = [
    "flex-1 h-[42px] px-3 text-[13px] bg-[#f8fafc] border border-[var(--border)] rounded-l-[10px] border-r-0 outline-none transition-all",
    "focus:border-[var(--primary)] focus:bg-white focus:z-10 focus:relative",
    error ? "border-red-300 bg-[#fff5f5]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
          {label}
        </span>
        {labelMarathi && (
          <span className="text-[11px] text-[var(--text-muted)]">({labelMarathi})</span>
        )}
        {required && <span className="text-red-500 text-[13px] leading-none">*</span>}
      </div>

      {/* Input + Unit joined */}
      <div className="flex items-stretch">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onValueChange(e.target.value)}
          className={inputCls}
        />
        <div className="relative flex-shrink-0">
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="h-[42px] pl-3 pr-8 text-[13px] font-semibold bg-[#f1f5f9] border border-[var(--border)] rounded-r-[10px] outline-none appearance-none cursor-pointer focus:border-[var(--primary)] transition-all min-w-[72px] text-[var(--text-secondary)]"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </p>
      )}
      {!error && hint && <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
