/**
 * RadioGroup — horizontal pill-style radio buttons.
 *
 * Usage:
 *   <RadioGroup
 *     label="Encroachment present?"
 *     options={[{ value: "yes", label: "होय (Yes)", danger: true }, { value: "no", label: "नाही (No)" }]}
 *     value={form.encroachment}
 *     onChange={(v) => setField("encroachment", v)}
 *   />
 */

export interface RadioGroupOption {
  value: string;
  label: string;
  /** If true, active state uses red palette instead of primary */
  danger?: boolean;
}

export interface RadioGroupProps {
  /** Group label */
  label?: string;
  /** Secondary label */
  labelMarathi?: string;
  /** Options */
  options: RadioGroupOption[];
  /** Currently selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Default value — if set, pre-selects on render (handled externally; just for docs) */
  defaultValue?: string;
  /** Extra wrapper class */
  className?: string;
}

export default function RadioGroup({
  label,
  labelMarathi,
  options,
  value,
  onChange,
  className = "",
}: RadioGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
            {label}
          </span>
          {labelMarathi && (
            <span className="text-[11px] text-[var(--text-muted)]">({labelMarathi})</span>
          )}
        </div>
      )}

      {/* Pills */}
      <div className="flex gap-3 flex-wrap">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 text-[13px] font-semibold transition-all",
                active
                  ? opt.danger
                    ? "bg-red-50 border-red-400 text-red-600"
                    : "bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary)]"
                  : "border-[var(--border)] bg-[#f8fafc] text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-white",
              ].join(" ")}
            >
              {/* Radio dot */}
              <span
                className={[
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  active
                    ? opt.danger
                      ? "border-red-500"
                      : "border-[var(--primary)]"
                    : "border-[var(--border)]",
                ].join(" ")}
              >
                {active && (
                  <span
                    className={[
                      "w-2 h-2 rounded-full",
                      opt.danger ? "bg-red-500" : "bg-[var(--primary)]",
                    ].join(" ")}
                  />
                )}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
