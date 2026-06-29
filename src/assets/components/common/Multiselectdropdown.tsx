import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectDropdownProps {
  label?: string;
  labelMarathi?: string;
  required?: boolean;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

export default function MultiSelectDropdown({
  label,
  labelMarathi,
  required = false,
  options,
  selected,
  onChange,
  placeholder = "— Select options —",
  disabled = false,
  error,
  hint,
  className = "",
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val: string) => {
    onChange(
      selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    );
  };

  const remove = (val: string) => onChange(selected.filter((v) => v !== val));

  const triggerCls = [
    "w-[300px] min-h-[42px] px-3 py-1.5 text-[13px] rounded-[10px] border text-left flex items-center justify-between gap-2 transition-all outline-none",
    disabled
      ? "bg-[#f1f5f9] border-[var(--border)] cursor-not-allowed"
      : error
      ? "bg-[#fff5f5] border-red-300 focus:border-red-400"
      : open
      ? "bg-white border-[var(--primary)] shadow-[0_0_0_3px_rgba(11,122,117,0.08)]"
      : "bg-[#f8fafc] border-[var(--border)] hover:border-[var(--primary)]",
  ].join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={ref}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
            {label}
          </span>
          {labelMarathi && (
            <span className="text-[11px] text-[var(--text-muted)]">({labelMarathi})</span>
          )}
          {required && <span className="text-red-500 text-[13px] leading-none">*</span>}
          {selected.length > 0 && (
            <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">
              {selected.length}
            </span>
          )}
        </div>
      )}

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={triggerCls}
      >
        <span className="flex flex-wrap gap-1 flex-1">
          {selected.length === 0 ? (
            <span className="text-[var(--text-muted)]">{placeholder}</span>
          ) : (
            selected.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(11,122,117,0.1)] border border-[rgba(11,122,117,0.2)] text-[var(--primary)] text-[11px] font-semibold"
                >
                  {opt?.label ?? val}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); remove(val); }}
                    className="text-[var(--primary)] hover:text-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              );
            })
          )}
        </span>
        <ChevronDown
          size={14}
          className={"text-[var(--text-muted)] flex-shrink-0 transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>

      {/* Dropdown panel */}
      {open && !disabled && (
        <div className="relative z-30">
          <div className="absolute top-1 left-0 right-0 bg-white border border-[var(--border)] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Select-all row */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[#fafbfc]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {options.length} option{options.length !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    selected.length === options.length ? [] : options.map((o) => o.value)
                  )
                }
                className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
              >
                {selected.length === options.length ? "Clear all" : "Select all"}
              </button>
            </div>

            {/* Options list */}
            <div className="max-h-[200px] overflow-y-auto">
              {options.map((opt) => {
                const checked = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors " +
                      (checked
                        ? "bg-[rgba(11,122,117,0.06)] text-[var(--text-primary)]"
                        : "hover:bg-[#f8fafc] text-[var(--text-secondary)]")
                    }
                  >
                    {/* Checkbox */}
                    <span
                      className={
                        "w-4 h-4 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-all " +
                        (checked
                          ? "bg-[var(--primary)] border-[var(--primary)]"
                          : "border-[#cbd5e1] bg-white")
                      }
                    >
                      {checked && <Check size={10} strokeWidth={3} className="text-white" />}
                    </span>
                    <span className="text-[13px] font-mono">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Error / hint */}
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