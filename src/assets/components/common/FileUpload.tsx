/**
 * FileUpload — file picker with a preview table showing uploaded files.
 * Each row has a mini-preview thumbnail (images) or doc icon (PDF),
 * filename, size, and View / Delete action buttons.
 *
 * Usage:
 *   <FileUpload
 *     files={uploadedFiles}
 *     onAdd={handleAdd}
 *     onRemove={removeFile}
 *     onView={setViewingFile}
 *     accept=".pdf,.jpg,.jpeg,.png"
 *   />
 */

import { useRef } from "react";
import { Upload, Eye, Trash2, FileText } from "lucide-react";

export interface UploadedFile {
  name: string;
  size: string;
  url: string;
  type: string;
}

export interface FileUploadProps {
  /** Current list of uploaded files */
  files: UploadedFile[];
  /** Called with new files selected */
  onAdd: (files: UploadedFile[]) => void;
  /** Called with index to remove */
  onRemove: (index: number) => void;
  /** Called when user clicks View on a file */
  onView: (file: UploadedFile) => void;
  /** accept attribute for file input */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Label for the upload section */
  label?: string;
  labelMarathi?: string;
  /** Hint text below button */
  hint?: string;
}

export default function FileUpload({
  files,
  onAdd,
  onRemove,
  onView,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = true,
  label = "Upload Documents",
  labelMarathi,
  hint = "PDF, JPG, PNG — max 10 MB per file",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const mapped: UploadedFile[] = selected.map((f) => ({
      name: f.name,
      size:
        f.size > 1024 * 1024
          ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
          : `${(f.size / 1024).toFixed(0)} KB`,
      url: URL.createObjectURL(f),
      type: f.type,
    }));
    onAdd(mapped);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Label */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
          {label}
        </span>
        {labelMarathi && (
          <span className="text-[11px] text-[var(--text-muted)]">({labelMarathi})</span>
        )}
      </div>

      {/* Trigger row */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="rr-file-upload"
          className="flex items-center gap-2 px-4 h-[42px] rounded-[10px] border border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] text-[13px] font-semibold cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-all"
        >
          <Upload size={14} />
          Choose File
        </label>
        <span className="text-[12px] text-[var(--text-muted)]">{hint}</span>
        <input
          ref={inputRef}
          id="rr-file-upload"
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* File list */}
      {files.length > 0 ? (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          {/* Table head */}
          <div className="grid grid-cols-[1fr_100px_130px] bg-[#f8fafc] border-b border-[var(--border)]">
            {["File Name", "Size", "Actions"].map((h) => (
              <div
                key={h}
                className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {files.map((file, idx) => (
            <div
              key={idx}
              className={
                "grid grid-cols-[1fr_100px_130px] items-center " +
                (idx < files.length - 1 ? "border-b border-[var(--border)]" : "")
              }
            >
              {/* Name + thumbnail */}
              <div className="px-4 py-3 flex items-center gap-2.5 min-w-0">
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-[var(--border)]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[rgba(11,122,117,0.08)] border border-[rgba(11,122,117,0.15)] flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-[var(--primary)]" />
                  </div>
                )}
                <span className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                  {file.name}
                </span>
              </div>

              {/* Size */}
              <div className="px-4 py-3 text-[11px] text-[var(--text-muted)]">{file.size}</div>

              {/* Actions */}
              <div className="px-4 py-3 flex items-center gap-2">
                <button
                  onClick={() => onView(file)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[11px] font-semibold text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all"
                >
                  <Eye size={12} />
                  View
                </button>
                <button
                  onClick={() => onRemove(idx)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[11px] font-semibold text-[var(--text-muted)] hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-2 h-[90px] border-2 border-dashed border-[var(--border)] rounded-xl bg-[#fafbfc]">
          <p className="text-[12px] text-[var(--text-muted)]">No files uploaded yet</p>
          <p className="text-[11px] text-[var(--text-muted)] opacity-60">
            Click "Choose File" above to add documents
          </p>
        </div>
      )}
    </div>
  );
}
