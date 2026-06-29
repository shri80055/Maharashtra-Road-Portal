/**
 * NumberStepper — input with increment/decrement buttons.
 *
 * Usage:
 *   <NumberStepper
 *     label="Beneficiary Farmer Count"
 *     labelMarathi="लाभार्थी शेतकऱ्यांची संख्या"
 *     value={form.beneficiaryCount}
 *     onChange={(v) => setField("beneficiaryCount", v)}
 *     min={0}
 *     suffixIcon={<Users size={13} />}
 *   />
 */

export interface NumberStepperProps {
  label: string;
  labelMarathi?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  suffixIcon?: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
  disable?: string;
}

export default function NumberStepper({
  label,
  labelMarathi,
  required = false,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder = "0",
  suffixIcon,
  error,
  hint,
  className = "",
}: NumberStepperProps) {
  const current = parseFloat(value) || 0;

  const decrement = () => {
    const next = current - step;
    if (min !== undefined && next < min) return;
    onChange(String(next));
  };

  const increment = () => {
    const next = current + step;
    if (max !== undefined && next > max) return;
    onChange(String(next));
  };

  const btnCls =
    "w-[42px] h-[42px] rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-secondary)] text-lg font-bold flex items-center justify-center hover:bg-[#f8fafc] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex-shrink-0 select-none";

  const inputCls = [
    "flex-1 h-[42px] text-center text-[13px] bg-[#f8fafc] border border-[var(--border)] rounded-[10px] outline-none transition-all",
    "focus:border-[var(--primary)] focus:bg-white",
    suffixIcon ? "pr-8" : "",
    error ? "border-red-300 bg-[#fff5f5]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
          {label}
        </span>
        {labelMarathi && (
          <span className="text-[11px] text-[var(--text-muted)]">({labelMarathi})</span>
        )}
        {required && <span className="text-red-500 text-[13px] leading-none">*</span>}
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={decrement} className={btnCls} aria-label="Decrease">
          −
        </button>
        <div className="relative flex-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
          {suffixIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              {suffixIcon}
            </span>
          )}
        </div>
        <button type="button" onClick={increment} className={btnCls} aria-label="Increase">
          +
        </button>
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
