import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text shown above */
  label: string;
  /** Marathi / secondary label in muted style */
  labelMarathi?: string;
  /** Mark required — red asterisk */
  required?: boolean;
  /** Options list */
  options: SelectOption[];
  /** Placeholder / default empty option text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Hint text below */
  hint?: string;
  /** Extra class on wrapper div */
  wrapperClassName?: string;
}

export default function SelectInput({
  label,
  labelMarathi,
  required = false,
  options,
  placeholder = "— Select —",
  error,
  hint,
  wrapperClassName = "",
  className = "",
  disabled,
  ...rest
}: SelectInputProps) {
  const selectCls = [
    "w-full h-[42px] pl-3 pr-9 text-[13px] transition-all outline-none appearance-none rounded-[10px] border cursor-pointer",
    disabled
      ? "bg-[#f1f5f9] border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
      : error
      ? "bg-[#fff5f5] border-red-300 text-[var(--text-primary)] focus:border-red-400"
      : "bg-[#f8fafc] border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:bg-white",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {/* Label row */}
      <div className="flex items-center gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
          {label}
        </label>
        {labelMarathi && (
          <span className="text-[11px] text-[var(--text-muted)]">({labelMarathi})</span>
        )}
        {required && <span className="text-red-500 text-[13px] leading-none">*</span>}
      </div>

      {/* Select wrapper */}
      <div className="relative">
        <select disabled={disabled} className={selectCls} {...rest}>
          <option value="">{placeholder}</option>
          {/* Deduplicate by value, matching the original pattern */}
          {Array.from(new Set(options.map((o) => o.value))).map((val) => {
            const opt = options.find((o) => o.value === val)!;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={13}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Hint */}
      {!error && hint && (
        <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
}
