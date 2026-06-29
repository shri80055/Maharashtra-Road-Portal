import { useLocation, useNavigate } from "react-router-dom";
import {
  Upload, Save, Send, X, MapPin, CheckCircle2,
  ChevronRight, Eye, Trash2, FileText, Users,
  Ruler, AlertTriangle, ChevronDown, Navigation,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import { useState, useRef } from "react";
import { useRoadStore } from "../store/roadStore";
import type { RoadRecord } from "../store/roadStore";

/* ─── Static API-mock data ────────────────────────── */
const ROAD_UID_DATA: Record<string, { uid: string; surveys: string[] }[]> = {
  A: [
    { uid: "MH-PUN-A-001", surveys: ["123/1", "123/2", "124/1"] },
    { uid: "MH-PUN-A-002", surveys: ["201/3", "201/4"] },
    { uid: "MH-PUN-A-003", surveys: ["305/1", "305/2", "305/3"] },
  ],
  B: [
    { uid: "MH-PUN-B-001", surveys: ["45/1A", "45/1B", "46/2"] },
    { uid: "MH-PUN-B-002", surveys: ["78/3", "78/4", "79/1"] },
    { uid: "MH-PUN-B-003", surveys: ["112/2", "112/3"] },
  ],
  C: [
    { uid: "MH-PUN-C-001", surveys: ["12/1", "13/1"] },
    { uid: "MH-PUN-C-002", surveys: ["34/2", "35/1", "35/2", "36/1"] },
    { uid: "MH-PUN-C-003", surveys: ["67/1", "68/1"] },
  ],
};

const ROAD_TYPE_META: Record<string, { label: string; marathi: string; color: string; bg: string; border: string }> = {
  A: { label: "Road Type A", marathi: "Village Map Roads (गाव नकाशा रस्ते)", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  B: { label: "Road Type B", marathi: "Village Connectors (गावांना जोडणारे रस्ते)", color: "#0b7a75", bg: "#ecfdf5", border: "#6ee7b7" },
  C: { label: "Road Type C", marathi: "Inter-village Paths (अंतर-ग्राम मार्ग)", color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
};

type UploadedFile = { name: string; size: string; url: string; type: string };
type Toast = { type: "success" | "draft"; msg: string } | null;
type CardColor = "teal" | "blue" | "purple" | "amber";

const EMPTY_FORM = {
  roadType: "",
  roadUID: "",
  roadID: "",
  roadName: "",
  roadLength: "",
  lengthUnit: "m",
  beneficiaryCount: "",
  encroachment: "no",
  encroachmentDetails: "",
};

export default function Praroop1() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addDraft, updateDraft, submitRecord, drafts } = useRoadStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null);

  const editId: string | undefined = state?.editId;
  const editRecord = editId ? drafts.find((d) => d.id === editId) : undefined;

  const [form, setFormData] = useState({ ...EMPTY_FORM });
  const district = editRecord?.district ?? state?.district ?? "Pune";
  const taluka = editRecord?.taluka ?? state?.taluka ?? "Haveli";
  const village = editRecord?.village ?? state?.village ?? "Wagholi";

  /* Derived state */
  const availableUIDs = form.roadType ? ROAD_UID_DATA[form.roadType] ?? [] : [];
  const selectedUIDData = availableUIDs.find((r) => r.uid === form.roadUID);
  const surveyRows = selectedUIDData
    ? selectedUIDData.surveys.map((s, i) => ({
        srNo: i + 1,
        surveyNo: s,
        roadUID: form.roadUID,
        roadType: form.roadType,
      }))
    : [];

  const setField = <K extends keyof typeof EMPTY_FORM>(k: K, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  const handleRoadTypeChange = (type: string) => {
    setFormData((p) => ({ ...p, roadType: type, roadUID: "", roadID: "" }));
  };

  const handleUIDChange = (uid: string) => {
    const autoID = uid
      ? `RD-${form.roadType}-${uid.split("-").pop()}-${Date.now().toString().slice(-4)}`
      : "";
    setFormData((p) => ({ ...p, roadUID: uid, roadID: autoID }));
  };

  const showToast = (t: Toast) => {
    setToast(t);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newFiles: UploadedFile[] = files.map((f) => ({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      url: URL.createObjectURL(f),
      type: f.type,
    }));
    setUploadedFiles((p) => [...p, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) =>
    setUploadedFiles((p) => p.filter((_, i) => i !== idx));

  const buildRecord = (status: "draft" | "submitted"): RoadRecord => ({
    id: editId ?? ("RD-" + Date.now()),
    district, taluka, village,
    roadType: form.roadType,
    roadUID: form.roadUID,
    surveyNo: surveyRows.map((r) => r.surveyNo).join(", "),
    ghatNo: "",
    roadName: form.roadName,
    roadCategory: "",
    roadLength: form.roadLength + " " + form.lengthUnit,
    breadth: "",
    encroachment: form.encroachment,
    fileName: uploadedFiles.map((f) => f.name).join(", "),
    savedAt: new Date().toLocaleString("en-IN"),
    status,
  });

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setUploadedFiles([]);
  };

  const handleDraft = () => {
    const rec = buildRecord("draft");
    if (editId) updateDraft(editId, rec); else addDraft(rec);
    showToast({ type: "draft", msg: "Saved to Drafts successfully!" });
    setTimeout(() => navigate("/drafts"), 1200);
  };

  const handleSubmit = () => {
    const rec = buildRecord("submitted");
    submitRecord(rec);
    showToast({ type: "success", msg: "Form submitted successfully!" });
    setTimeout(() => navigate("/submitted"), 1200);
  };

  const fieldCls =
    "w-full h-[42px] px-3 bg-[#f8fafc] border border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all";

  return (
    <MainLayout>
      {/* Toast */}
      {toast && (
        <div className={"fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border text-[13px] font-semibold " + (toast.type === "success" ? "bg-[#ecfdf5] border-[#bbf7d0] text-[#166534]" : "bg-[#fffbeb] border-[#fde68a] text-[#92400e]")}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {toast.msg}
        </div>
      )}

      {/* File Preview Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingFile(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full max-h-[80vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(11,122,117,0.1)] flex items-center justify-center">
                  <FileText size={15} className="text-[var(--primary)]" />
                </div>
                <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate max-w-xs">{viewingFile.name}</p>
              </div>
              <button onClick={() => setViewingFile(null)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[#f8fafc]">
                <X size={14} />
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-[#f8fafc] min-h-[300px]">
              {viewingFile.type.startsWith("image/") ? (
                <img src={viewingFile.url} alt={viewingFile.name} className="max-w-full max-h-[400px] rounded-lg object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center">
                    <FileText size={28} className="text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">{viewingFile.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{viewingFile.size}</p>
                  <a href={viewingFile.url} download={viewingFile.name} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-[12px] font-semibold">
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Breadcrumb crumbs={[{ label: "Road Registration" }, { label: "Praroop-1" }]} />

      {/* Page Header */}
      <div className="mt-3 mb-5">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[var(--text-primary)] leading-tight">Praroop-1</h1>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">Village Mapped Road Registration Form (ग्रामसभा नकाशा मार्ग नोंदणी)</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-[11px] font-semibold text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {editId ? "Editing Draft" : "New Entry"}
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-28">

        {/* ── STEP 1: Admin Details ── */}
        <SectionCard step={1} icon={<MapPin size={15} />} title="Administrative Details" subtitle="Pre-filled from your jurisdiction selection" color="teal">
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "District (जिल्हा)", value: district }, { label: "Taluka (तालुका)", value: taluka }, { label: "Village (गाव)", value: village }].map((f) => (
              <div key={f.label}>
                <label className="rr-label mb-1.5 block">{f.label}</label>
                <div className="h-[42px] flex items-center px-3 bg-[rgba(11,122,117,0.06)] border border-[rgba(11,122,117,0.18)] rounded-[10px] text-[13px] font-semibold text-[var(--primary)]">{f.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── STEP 2: Road Type + UID ── */}
        <SectionCard step={2} icon={<Navigation size={15} />} title="Designated Road Type / रस्त्याचा प्रकार" subtitle="Select road classification and then choose Road UID" color="blue">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
 {/* Road Type Radio Cards */}
          <div className="flex flex-col gap-1.5">
            <label className="rr-label mb-3 block">Road Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-3">
              {(["A", "B", "C"] as const).map((type) => {
                const meta = ROAD_TYPE_META[type];
                const active = form.roadType === type;
                return (
                  <button
                    key={type}
                    onClick={() => handleRoadTypeChange(type)}
                    className={"relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all " + (active ? "border-[color:var(--active-border)] bg-[color:var(--active-bg)] shadow-sm" : "border-[var(--border)] bg-white hover:border-[var(--border)] hover:shadow-sm")}
                    style={active ? { "--active-border": meta.border, "--active-bg": meta.bg } as React.CSSProperties : {}}
                  >
                    {/* Radio dot */}
                    <div className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ borderColor: active ? meta.color : "#cbd5e1" }}>
                      {active && <div className="w-2 h-2 rounded-full" style={{ background: meta.color }} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[var(--text-primary)]" style={active ? { color: meta.color } : {}}>{meta.label}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-tight">{meta.marathi}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            
          </div>
<div className="flex flex-col gap-1.5">

                {/* Road UID Dropdown — shows only after road type selected */}
          {form.roadType && (
            <div>
              <label className="rr-label mb-5 block">
                Road UID (रस्त्याचा सांकेतांक क्रमांक) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.roadUID}
                  onChange={(e) => handleUIDChange(e.target.value)}
                  className={fieldCls + " appearance-none pr-10 cursor-pointer"}
                >
                  <option value="">— Select Road UID —</option>
                  {availableUIDs.map((r) => (
                    <option key={r.uid} value={r.uid}>{r.uid}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              </div>
            </div>
          )}
            </div>

            </div>
         

          

          {/* Survey Grid — shows after UID selected */}
          {surveyRows.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">Associated Survey / Gat Numbers</p>
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[rgba(11,122,117,0.1)] text-[var(--primary)] text-[10px] font-bold">
                  {surveyRows.length}
                </span>
              </div>
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                {/* Table head */}
                <div className="grid grid-cols-4 bg-[#f8fafc] border-b border-[var(--border)]">
                  {["Sr. No.", "Survey / Gat No.", "Road UID", "Road Type"].map((h) => (
                    <div key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {surveyRows.map((row, i) => {
                  const meta = ROAD_TYPE_META[row.roadType];
                  return (
                    <div key={i} className={"grid grid-cols-4 " + (i < surveyRows.length - 1 ? "border-b border-[var(--border)]" : "")}>
                      <div className="px-4 py-3 text-[12px] text-[var(--text-muted)] font-mono">{String(row.srNo).padStart(2, "0")}</div>
                      <div className="px-4 py-3 text-[12px] font-semibold text-[var(--text-primary)] font-mono">{row.surveyNo}</div>
                      <div className="px-4 py-3 text-[12px] font-mono text-[var(--text-secondary)]">{row.roadUID}</div>
                      <div className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border" style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}>
                          Type {row.roadType}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── STEP 3: Road Details ── */}
        {form.roadUID && (
          <SectionCard step={3} icon={<Ruler size={15} />} title="Road Details (रस्त्याची माहिती)" subtitle="Enter road identification, name, and measurements" color="teal">
            <div className="grid grid-cols-2 gap-4">

              {/* Road ID — auto-generated, disabled */}
              <div>
                <label className="rr-label mb-1.5 block">Road ID (स्वयं-निर्मित क्रमांक)</label>
                <div className="relative">
                  <input
                    value={form.roadID}
                    disabled
                    className="w-full h-[42px] px-3 pr-10 bg-[#f1f5f9] border border-[var(--border)] rounded-[10px] text-[13px] font-mono text-[var(--text-muted)] cursor-not-allowed select-none"
                    placeholder="Auto-generated after UID selection"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] bg-[#e2e8f0] px-1.5 py-0.5 rounded">
                    AUTO
                  </div>
                </div>
              </div>

              {/* Road Name */}
              <div>
                <label className="rr-label mb-1.5 block">Road Name (रस्त्याचे नाव)</label>
                <input
                  value={form.roadName}
                  onChange={(e) => setField("roadName", e.target.value)}
                  placeholder="Enter road name"
                  className={fieldCls}
                />
              </div>

              {/* Road Length + Unit */}
              <div>
                <label className="rr-label mb-1.5 block">Estimated Road Length (रस्त्याची अंदाजित लांबी)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.roadLength}
                    onChange={(e) => setField("roadLength", e.target.value)}
                    placeholder="0.00"
                    className={fieldCls + " flex-1"}
                  />
                  <div className="relative">
                    <select
                      value={form.lengthUnit}
                      onChange={(e) => setField("lengthUnit", e.target.value)}
                      className="h-[42px] pl-3 pr-8 bg-[#f8fafc] border border-[var(--border)] rounded-[10px] text-[13px] font-semibold text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] appearance-none cursor-pointer min-w-[72px]"
                    >
                      <option value="m">m</option>
                      <option value="km">km</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Beneficiary Farmer Count */}
              <div>
                <label className="rr-label mb-1.5 block">Beneficiary Farmer Count (लाभार्थी शेतकऱ्यांची संख्या)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setField("beneficiaryCount", String(Math.max(0, (parseInt(form.beneficiaryCount) || 0) - 1)))}
                    className="w-[42px] h-[42px] rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-secondary)] text-lg font-bold flex items-center justify-center hover:bg-[#f8fafc] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex-shrink-0"
                  >−</button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      value={form.beneficiaryCount}
                      onChange={(e) => setField("beneficiaryCount", e.target.value)}
                      placeholder="0"
                      className={fieldCls + " text-center pr-8"}
                    />
                    <Users size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  </div>
                  <button
                    onClick={() => setField("beneficiaryCount", String((parseInt(form.beneficiaryCount) || 0) + 1))}
                    className="w-[42px] h-[42px] rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-secondary)] text-lg font-bold flex items-center justify-center hover:bg-[#f8fafc] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex-shrink-0"
                  >+</button>
                </div>
              </div>

            </div>
          </SectionCard>
        )}

        {/* ── STEP 4: Encroachment ── */}
        {form.roadUID && (
          <SectionCard step={4} icon={<AlertTriangle size={15} />} title="Encroachment Details (अतिक्रमण तपशील)" subtitle="Report any encroachment on this road segment" color="amber">
            <div>
              <label className="rr-label mb-3 block">अतिक्रमण असल्यास आहे का? (Is there encroachment?)</label>
              <div className="flex gap-4 mb-4">
                {[{ label: "होय (Yes)", val: "yes" }, { label: "नाही (No)", val: "no" }].map(({ label, val }) => {
                  const active = form.encroachment === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setField("encroachment", val)}
                      className={"flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 text-[13px] font-semibold transition-all " + (active ? (val === "yes" ? "bg-red-50 border-red-400 text-red-600" : "bg-[#ecfdf5] border-[var(--primary)] text-[var(--primary)]") : "border-[var(--border)] bg-[#f8fafc] text-[var(--text-muted)]")}
                    >
                      <div className={"w-4 h-4 rounded-full border-2 flex items-center justify-center " + (active ? (val === "yes" ? "border-red-500" : "border-[var(--primary)]") : "border-[var(--border)]")}>
                        {active && <div className={"w-2 h-2 rounded-full " + (val === "yes" ? "bg-red-500" : "bg-[var(--primary)]")} />}
                      </div>
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Encroachment details textarea — conditional */}
              {form.encroachment === "yes" && (
                <div className="animate-[fadeIn_0.2s_ease]">
                  <label className="rr-label mb-1.5 block">
                    अतिक्रमण नसल्यास थोडक्यात / संक्षिप्त तपशील
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.encroachmentDetails}
                    onChange={(e) => setField("encroachmentDetails", e.target.value)}
                    placeholder="Describe the nature and extent of encroachment…"
                    className="w-full px-3 py-2.5 bg-[#f8fafc] border border-red-200 rounded-[10px] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-red-400 focus:bg-white transition-all resize-none"
                  />
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {/* ── STEP 5: Upload Documents ── */}
        {form.roadUID && (
          <SectionCard step={5} icon={<Upload size={15} />} title="Upload Documents (आवश्यक कागदपत्रे अपलोड करा)" subtitle="Upload road photo, survey map, or supporting documents" color="teal">

            {/* Upload trigger */}
            <div className="flex items-center gap-3 mb-4">
              <label
                htmlFor="road-file"
                className="flex items-center gap-2 px-4 h-[42px] rounded-[10px] border border-[var(--primary)] bg-[#ecfdf5] text-[var(--primary)] text-[13px] font-semibold cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-all"
              >
                <Upload size={14} />
                Choose File
              </label>
              <span className="text-[12px] text-[var(--text-muted)]">PDF, JPG, PNG — max 10 MB per file</span>
              <input
                ref={fileInputRef}
                id="road-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Uploaded files table */}
            {uploadedFiles.length > 0 ? (
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                {/* Head */}
                <div className="grid grid-cols-[1fr_100px_120px] bg-[#f8fafc] border-b border-[var(--border)]">
                  {["File Name", "Size", "Actions"].map((h) => (
                    <div key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className={"grid grid-cols-[1fr_100px_120px] items-center " + (idx < uploadedFiles.length - 1 ? "border-b border-[var(--border)]" : "")}>
                    <div className="px-4 py-3 flex items-center gap-2.5 min-w-0">
                      {/* Mini preview */}
                      {file.type.startsWith("image/") ? (
                        <img src={file.url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-[var(--border)]" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[rgba(11,122,117,0.08)] border border-[rgba(11,122,117,0.15)] flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-[var(--primary)]" />
                        </div>
                      )}
                      <span className="text-[12px] font-medium text-[var(--text-primary)] truncate">{file.name}</span>
                    </div>
                    <div className="px-4 py-3 text-[11px] text-[var(--text-muted)]">{file.size}</div>
                    <div className="px-4 py-3 flex items-center gap-2">
                      <button
                        onClick={() => setViewingFile(file)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[11px] font-semibold text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[#ecfdf5] transition-all"
                      >
                        <Eye size={12} />
                        View
                      </button>
                      <button
                        onClick={() => removeFile(idx)}
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
              <div className="flex flex-col items-center justify-center gap-2 h-[90px] border-2 border-dashed border-[var(--border)] rounded-xl bg-[#fafbfc] text-center">
                <p className="text-[12px] text-[var(--text-muted)]">No files uploaded yet</p>
                <p className="text-[11px] text-[var(--text-muted)] opacity-60">Click "Choose File" above to add documents</p>
              </div>
            )}
          </SectionCard>
        )}

      </div>

      {/* ── Sticky Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-6 py-3.5 bg-white border-t border-[var(--border)] shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
        <p className="flex-1 text-[11px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-secondary)]">Praroop-1</span>
          {" · "}{district} › {taluka} › {village}
          {form.roadType && <span className="ml-2 px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[10px] font-bold">Type {form.roadType}</span>}
        </p>
        <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[var(--border)] bg-white text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[#f8fafc] hover:text-red-600 hover:border-red-200 transition-all">
          <X size={15} />
          Cancel
        </button>
        <button onClick={handleDraft} className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-amber-300 bg-amber-50 text-[13px] font-semibold text-amber-700 hover:bg-amber-100 transition-all">
          <Save size={15} />
          Save as Draft
        </button>
        <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[var(--primary)] text-white text-[13px] font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-sm">
          <Send size={15} />
          Submit
        </button>
      </div>
    </MainLayout>
  );
}

/* ─── Section Card ────────────────────────────────── */
function SectionCard({ step, icon, title, subtitle, color, children }: {
  step: number; icon: React.ReactNode; title: string; subtitle?: string; color: CardColor; children: React.ReactNode;
}) {
  const colorMap: Record<CardColor, { iconBg: string; accent: string; stepBg: string }> = {
    teal:   { iconBg: "rgba(11,122,117,0.12)",  accent: "var(--primary)", stepBg: "rgba(11,122,117,0.08)" },
    blue:   { iconBg: "rgba(37,99,235,0.1)",    accent: "#2563eb",        stepBg: "rgba(37,99,235,0.08)" },
    purple: { iconBg: "rgba(124,58,237,0.1)",   accent: "#7c3aed",        stepBg: "rgba(124,58,237,0.08)" },
    amber:  { iconBg: "rgba(245,158,11,0.12)",  accent: "#b45309",        stepBg: "rgba(245,158,11,0.1)" },
  };
  const c = colorMap[color];
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border)] bg-[#fafbfc]">
        <div className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black flex-shrink-0" style={{ background: c.stepBg, color: c.accent }}>
          {step}
        </div>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.iconBg, color: c.accent }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-[var(--text-primary)]">{title}</p>
          {subtitle && <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}