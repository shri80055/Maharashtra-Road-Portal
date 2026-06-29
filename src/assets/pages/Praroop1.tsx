import { useLocation, useNavigate } from "react-router-dom";
import {
  Save, Send, X, MapPin, CheckCircle2,
  ChevronRight, FileText, Users, Navigation,
  AlertTriangle, Ruler,
} from "lucide-react";
import { useState } from "react";

import MainLayout from "../layout/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import {
  InputBox,
  SelectInput,
  RadioCard,
  RadioGroup,
  TextArea,
  NumberStepper,
  InputWithUnit,
  FileUpload,
} from "../components/common";
import type { UploadedFile } from "../components/common";

import { useRoadStore } from "../store/roadStore";
import type { RoadRecord } from "../store/roadStore";

/* ─── Static mock API data ────────────────────────── */
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

const ROAD_TYPE_META: Record<string, { label: string; subtitle: string; color: string; bg: string; border: string }> = {
  A: { label: "Road Type A", subtitle: "Village Map Roads (गाव नकाशा रस्ते)",      color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  B: { label: "Road Type B", subtitle: "Village Connectors (गावांना जोडणारे रस्ते)", color: "#0b7a75", bg: "#ecfdf5", border: "#6ee7b7" },
  C: { label: "Road Type C", subtitle: "Inter-village Paths (अंतर-ग्राम मार्ग)",    color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
};

/* ─── Form state ──────────────────────────────────── */
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

type Toast = { type: "success" | "draft"; msg: string } | null;
type CardColor = "teal" | "blue" | "purple" | "amber";

/* ─── Page ────────────────────────────────────────── */
export default function Praroop1() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addDraft, updateDraft, submitRecord, drafts } = useRoadStore();

  const [toast, setToast] = useState<Toast>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null);

  const editId: string | undefined = state?.editId;
  const editRecord = editId ? drafts.find((d) => d.id === editId) : undefined;

  const [form, setFormData] = useState({ ...EMPTY_FORM });

  const district = editRecord?.district ?? state?.district ?? "Pune";
  const taluka   = editRecord?.taluka   ?? state?.taluka   ?? "Haveli";
  const village  = editRecord?.village  ?? state?.village  ?? "Wagholi";

  /* Derived */
  const availableUIDs = form.roadType ? ROAD_UID_DATA[form.roadType] ?? [] : [];
  const selectedUIDData = availableUIDs.find((r) => r.uid === form.roadUID);
  const surveyRows = selectedUIDData
    ? selectedUIDData.surveys.map((s, i) => ({ srNo: i + 1, surveyNo: s, roadUID: form.roadUID, roadType: form.roadType }))
    : [];

  /* Field setter */
  const setField = <K extends keyof typeof EMPTY_FORM>(k: K, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  /* Road type change resets UID / roadID */
  const handleRoadTypeChange = (type: string) =>
    setFormData((p) => ({ ...p, roadType: type, roadUID: "", roadID: "" }));

  /* UID change auto-generates Road ID */
  const handleUIDChange = (uid: string) => {
    const autoID = uid
      ? `RD-${form.roadType}-${uid.split("-").pop()}-${Date.now().toString().slice(-4)}`
      : "";
    setFormData((p) => ({ ...p, roadUID: uid, roadID: autoID }));
  };

  const showToast = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 3000); };

  const handleFilesAdd = (files: UploadedFile[]) =>
    setUploadedFiles((p) => [...p, ...files]);

  const handleFileRemove = (idx: number) =>
    setUploadedFiles((p) => p.filter((_, i) => i !== idx));

  /* Build store record */
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

  const handleCancel = () => { setFormData(EMPTY_FORM); setUploadedFiles([]); };

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

  /* SelectInput option arrays */
  const uidOptions = availableUIDs.map((r) => ({ label: r.uid, value: r.uid }));

  return (
    <MainLayout>

      {/* ── Toast ── */}
      {toast && (
        <div className={"fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border text-[13px] font-semibold transition-all " + (toast.type === "success" ? "bg-[#ecfdf5] border-[#bbf7d0] text-[#166534]" : "bg-[#fffbeb] border-[#fde68a] text-[#92400e]")}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── File Preview Modal ── */}
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

      {/* ── Page Header ── */}
      <div className="mt-3 mb-5">
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-1 uppercase tracking-wider font-semibold">
          <span>Maharashtra Road Portal</span>
          <ChevronRight size={10} />
          <span>Survey & Mapping</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[var(--text-primary)] leading-tight">Praroop-1</h1>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              Village Mapped Road Registration Form (ग्रामसभा नकाशा मार्ग नोंदणी)
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-[11px] font-semibold text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {editId ? "Editing Draft" : "New Entry"}
          </div>
        </div>
      </div>

      {/* ── Form sections ── */}
      <div className="space-y-4 pb-28">

        {/* STEP 1 — Administrative Details */}
        <SectionCard step={1} icon={<MapPin size={15} />} title="Administrative Details" subtitle="Pre-filled from your jurisdiction selection" color="teal">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "District", labelMarathi: "जिल्हा", value: district },
              { label: "Taluka",   labelMarathi: "तालुका",  value: taluka },
              { label: "Village",  labelMarathi: "गाव",     value: village },
            ].map((f) => (
              <InputBox
                key={f.label}
                label={f.label}
                labelMarathi={f.labelMarathi}
                value={f.value}
                disabled
                readOnly
              />
            ))}
          </div>
        </SectionCard>

        {/* STEP 2 — Road Type + UID */}
        <SectionCard step={2} icon={<Navigation size={15} />} title="Designated Road Type / रस्त्याचा प्रकार" subtitle="Select road classification then choose Road UID" color="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div className="flex flex-col gap-1.5">
          {/* Radio cards */}
          <RadioCard
            label="Road Type"
            labelMarathi="रस्त्याचा प्रकार"
            required
            columns={3}
            options={Object.entries(ROAD_TYPE_META).map(([val, m]) => ({
              value: val,
              title: m.label,
              subtitle: m.subtitle,
              color: m.color,
              bg: m.bg,
              border: m.border,
            }))}
            value={form.roadType}
            onChange={handleRoadTypeChange}
            className="mb-5"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          {/* Road UID dropdown — appears after road type selected */}
          {form.roadType && (
            <SelectInput
              label="Road UID"
              labelMarathi="रस्त्याचा सांकेतांक क्रमांक"
              required
              placeholder="— Select Road UID —"
              options={uidOptions}
              value={form.roadUID}
              onChange={(e) => handleUIDChange(e.target.value)}
            />
          )}
        </div>
        </div>
          

          

          {/* Survey grid — appears after UID selected */}
          {surveyRows.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">
                  Associated Survey / Gat Numbers
                </p>
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[rgba(11,122,117,0.1)] text-[var(--primary)] text-[10px] font-bold">
                  {surveyRows.length}
                </span>
              </div>
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 bg-[#f8fafc] border-b border-[var(--border)]">
                  {["Sr. No.", "Survey / Gat No.", "Road UID", "Road Type"].map((h) => (
                    <div key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">{h}</div>
                  ))}
                </div>
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

        {/* STEP 3 — Road Details */}
        {form.roadUID && (
          <SectionCard step={3} icon={<Ruler size={15} />} title="Road Details" subtitle="रस्त्याची माहिती — identification, name, and measurements" color="teal">
            <div className="grid grid-cols-2 gap-4">

              {/* Road ID — auto-generated */}
              <InputBox
                label="Road ID"
                labelMarathi="स्वयं-निर्मित क्रमांक"
                autoGenerated
                value={form.roadID}
                readOnly
                placeholder="Auto-generated after UID selection"
                hint="System generated — not editable"
              />

              {/* Road Name */}
              <InputBox
                label="Road Name"
                labelMarathi="रस्त्याचे नाव"
                value={form.roadName}
                placeholder="Enter road name"
                onChange={(e) => setField("roadName", e.target.value)}
              />

              {/* Road Length + Unit */}
              <InputWithUnit
                label="Estimated Road Length"
                labelMarathi="रस्त्याची अंदाजित लांबी"
                value={form.roadLength}
                onValueChange={(v) => setField("roadLength", v)}
                unit={form.lengthUnit}
                onUnitChange={(u) => setField("lengthUnit", u)}
                units={[{ label: "m", value: "m" }, { label: "km", value: "km" }]}
                placeholder="0.00"
                min={0}
                step={0.01}
              />

              {/* Beneficiary Count */}
              <NumberStepper
                label="Beneficiary Farmer Count"
                labelMarathi="लाभार्थी शेतकऱ्यांची संख्या"
                value={form.beneficiaryCount}
                onChange={(v) => setField("beneficiaryCount", v)}
                min={0}
                placeholder="0"
                hint="Total farmers who benefit from this road"
               
              />

            </div>
          </SectionCard>
        )}

        {/* STEP 4 — Encroachment */}
        {form.roadUID && (
          <SectionCard step={4} icon={<AlertTriangle size={15} />} title="Encroachment Details" subtitle="अतिक्रमण तपशील — report any encroachment on this road segment" color="amber">

            <RadioGroup
              label="Is there encroachment?"
              labelMarathi="अतिक्रमण असल्यास आहे का"
              options={[
                { value: "yes", label: "होय (Yes)", danger: true },
                { value: "no",  label: "नाही (No)" },
              ]}
              value={form.encroachment}
              onChange={(v) => setField("encroachment", v)}
            />

            {/* Conditional textarea */}
            {form.encroachment === "yes" && (
              <TextArea
                label="Encroachment Description"
                labelMarathi="अतिक्रमणाचा थोडक्यात तपशील"
                required
                rows={4}
                value={form.encroachmentDetails}
                onChange={(e) => setField("encroachmentDetails", e.target.value)}
                placeholder="Describe the nature and extent of encroachment…"
                error={form.encroachmentDetails.trim() === "" ? "Please describe the encroachment details" : undefined}
                wrapperClassName="mt-4"
              />
            )}
          </SectionCard>
        )}

        {/* STEP 5 — Upload Documents */}
        {form.roadUID && (
          <SectionCard step={5} icon={<FileText size={15} />} title="Upload Documents" subtitle="आवश्यक कागदपत्रे अपलोड करा — road photo, survey map, or supporting docs" color="teal">
            <FileUpload
              files={uploadedFiles}
              onAdd={handleFilesAdd}
              onRemove={handleFileRemove}
              onView={setViewingFile}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              label="Documents / Maps"
              labelMarathi="कागदपत्रे"
              hint="PDF, JPG, PNG — max 10 MB per file"
            />
          </SectionCard>
        )}

      </div>

      {/* ── Sticky Footer Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-6 py-3.5 bg-white border-t border-[var(--border)] shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
        <p className="flex-1 text-[11px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-secondary)]">Praroop-1</span>
          {" · "}{district} › {taluka} › {village}
          {form.roadType && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[10px] font-bold">
              Type {form.roadType}
            </span>
          )}
        </p>

        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[var(--border)] bg-white text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[#f8fafc] hover:text-red-600 hover:border-red-200 transition-all"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          onClick={handleDraft}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-amber-300 bg-amber-50 text-[13px] font-semibold text-amber-700 hover:bg-amber-100 transition-all"
        >
          <Save size={15} />
          Save as Draft
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[var(--primary)] text-white text-[13px] font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-sm"
        >
          <Send size={15} />
          Submit
        </button>
      </div>

    </MainLayout>
  );
}

/* ─── SectionCard helper ──────────────────────────── */
function SectionCard({
  step, icon, title, subtitle, color, children,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color: CardColor;
  children: React.ReactNode;
}) {
  const map: Record<CardColor, { iconBg: string; accent: string; stepBg: string }> = {
    teal:   { iconBg: "rgba(11,122,117,0.12)",  accent: "var(--primary)", stepBg: "rgba(11,122,117,0.08)" },
    blue:   { iconBg: "rgba(37,99,235,0.1)",    accent: "#2563eb",        stepBg: "rgba(37,99,235,0.08)" },
    purple: { iconBg: "rgba(124,58,237,0.1)",   accent: "#7c3aed",        stepBg: "rgba(124,58,237,0.08)" },
    amber:  { iconBg: "rgba(245,158,11,0.12)",  accent: "#b45309",        stepBg: "rgba(245,158,11,0.1)" },
  };
  const c = map[color];

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