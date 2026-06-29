/**
 * RadioCard — a styled radio‑button group rendered as clickable cards.
 *
 * Usage:
 *   <RadioCard
 *     label="Designated Road Type"
 *     required
 *     options={[
 *       { value: "A", title: "Road Type A", subtitle: "Village Map Roads", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
 *     ]}
 *     value={form.roadType}
 *     onChange={(val) => setField("roadType", val)}
 *   />
 */

export interface RadioCardOption {
  /** Stored value */
  value: string;
  /** Bold title inside card */
  title: string;
  /** Muted subtitle / description */
  subtitle?: string;
  /** Active accent color (border dot, text) */
  color?: string;
  /** Active background fill */
  bg?: string;
  /** Active border color */
  border?: string;
}

export interface RadioCardProps {
  /** Group label above cards */
  label: string;
  /** Secondary / marathi label */
  labelMarathi?: string;
  /** Show required asterisk */
  required?: boolean;
  /** Options array */
  options: RadioCardOption[];
  /** Currently selected value */
  value: string;
  /** Called with new value when user picks a card */
  onChange: (value: string) => void;
  /** Error message below cards */
  error?: string;
  /** Layout: default is equal-width columns */
  columns?: number;
  /** Extra wrapper class */
  className?: string;
}

export default function RadioCard({
  label,
  labelMarathi,
  required = false,
  options,
  value,
  onChange,
  error,
  columns = 3,
  className = "",
}: RadioCardProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
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

      {/* Card grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const active = value === opt.value;
          const accentColor = opt.color ?? "var(--primary)";
          const activeBg = opt.bg ?? "var(--primary-light)";
          const activeBorder = opt.border ?? "var(--primary)";

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                active
                  ? "shadow-sm scale-[1.01]"
                  : "border-[var(--border)] bg-white hover:shadow-sm hover:bg-[#fafbfc]",
              ].join(" ")}
              style={
                active
                  ? {
                      borderColor: activeBorder,
                      backgroundColor: activeBg,
                    }
                  : {}
              }
            >
              {/* Radio dot */}
              <span
                className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: active ? accentColor : "#cbd5e1",
                  backgroundColor: "transparent",
                }}
              >
                {active && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </span>

              {/* Text */}
              <span className="min-w-0">
                <span
                  className="block text-[13px] font-bold leading-tight"
                  style={active ? { color: accentColor } : { color: "var(--text-primary)" }}
                >
                  {opt.title}
                </span>
                {opt.subtitle && (
                  <span className="block text-[11px] text-[var(--text-muted)] mt-0.5 leading-tight">
                    {opt.subtitle}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
