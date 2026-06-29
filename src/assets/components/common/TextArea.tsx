import type { TextareaHTMLAttributes } from "react";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelMarathi?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export default function TextArea({
  label,
  labelMarathi,
  required = false,
  error,
  hint,
  wrapperClassName = "",
  className = "",
  rows = 4,
  ...rest
}: TextAreaProps) {
  const textareaCls = [
    "w-full px-3 py-2.5 text-[13px] transition-all outline-none rounded-[10px] border resize-none",
    error
      ? "bg-[#fff5f5] border-red-300 text-[var(--text-primary)] focus:border-red-400"
      : "bg-[#f8fafc] border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:bg-white",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
            {label}
          </label>
          {labelMarathi && (
            <span className="text-[11px] text-[var(--text-muted)]">({labelMarathi})</span>
          )}
          {required && <span className="text-red-500 text-[13px] leading-none">*</span>}
        </div>
      )}

      <textarea rows={rows} className={textareaCls} {...rest} />

      {error && (
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
}
