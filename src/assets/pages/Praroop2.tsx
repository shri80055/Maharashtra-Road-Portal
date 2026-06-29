import { useLocation, useNavigate } from "react-router-dom";
import {
  Save, Send, X, MapPin, CheckCircle2, ChevronRight,
  FileText, Users, Navigation, AlertTriangle, Ruler,
  Search, Plus, Trash2,
} from "lucide-react";
import { useState } from "react";

import MainLayout from "../layout/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import {
  InputBox,
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
import MultiSelectDropdown from "../components/common/Multiselectdropdown";

/* ─── Static mock data ────────────────────────────── */
/**
 * For each Road Type → list of UIDs.
 * For each UID → map of parent survey keys → sub-survey array.
 * When user types "1" and searches → returns sub-surveys like 1/1, 1/2, 1/2/3 …
 */
const SURVEY_SUB_DATA: Record<string, string[]> = {
  "1":   ["1/1", "1/2", "1/3", "1/2/1", "1/2/2", "1/3/1"],
  "45":  ["45/1A", "45/1B", "45/2", "45/2/1", "45/3"],
  "78":  ["78/1", "78/2", "78/3", "78/3/1"],
  "112": ["112/1", "112/2", "112/3"],
  "201": ["201/1", "201/2", "201/3", "201/3/1", "201/4"],
  "305": ["305/1", "305/2", "305/2/1", "305/3"],
};

const ROAD_TYPE_META: Record<
  string,
  { label: string; subtitle: string; color: string; bg: string; border: string }
> = {
  D: {
    label: "Road Type D",
    subtitle: "Non-mapped Village Roads (गाव नकाशावर नसलेले रस्ते)",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  E: {
    label: "Road Type E",
    subtitle: "Forest / Govt Land Roads (वन / शासकीय जमीन रस्ते)",
    color: "#0b7a75",
    bg: "#ecfdf5",
    border: "#6ee7b7",
  },
};

/* ─── Survey row type (added to table) ───────────── */
interface SurveyRow {
  id: string;
  surveyNo: string;
  roadType: string;
  roadID: string;
}

/* ─── Form state ──────────────────────────────────── */
const EMPTY_FORM = {
  roadType: "",
  roadID: "",
  surveyQuery: "",
  roadName: "",
  roadLength: "",
  lengthUnit: "m",
  beneficiaryCount: "",
  encroachment: "no",
  encroachmentDetails: "",
};

type Toast = { type: "success" | "draft"; msg: string } | null;
type CardColor = "teal" | "blue" | "purple" | "amber";

/* ─── Helpers ─────────────────────────────────────── */
function generateRoadID(roadType: string) {
  return `RD-${roadType}-${Date.now().toString().slice(-6)}`;
}

function getSubSurveys(query: string): string[] {
  const q = query.trim();
  if (!q) return [];
  // exact key match first
  if (SURVEY_SUB_DATA[q]) return SURVEY_SUB_DATA[q];
  // prefix match: any key that starts with the query
  const matches: string[] = [];
  for (const [key, subs] of Object.entries(SURVEY_SUB_DATA)) {
    if (key.startsWith(q)) matches.push(...subs);
  }
  return [...new Set(matches)];
}

/* ─── Page ────────────────────────────────────────── */
export default function Praroop2() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addDraft, updateDraft, submitRecord, drafts } = useRoadStore();

  const [toast, setToast] = useState<Toast>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [viewingFile, setViewingFile] = useState<UploadedFile | null>(null);

  /* Sub-survey workflow */
  const [subSurveyOptions, setSubSurveyOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedSubSurveys, setSelectedSubSurveys] = useState<string[]>([]);
  const [surveyTableRows, setSurveyTableRows] = useState<SurveyRow[]>([]);
  const [searchDone, setSearchDone] = useState(false);

  const editId: string | undefined = state?.editId;
  const editRecord = editId ? drafts.find((d) => d.id === editId) : undefined;

  const [form, setFormData] = useState({ ...EMPTY_FORM });

  const district = editRecord?.district ?? state?.district ?? "Pune";
  const taluka   = editRecord?.taluka   ?? state?.taluka   ?? "Haveli";
  const village  = editRecord?.village  ?? state?.village  ?? "Wagholi";

  const setField = <K extends keyof typeof EMPTY_FORM>(k: K, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  /* Road type change → auto-generate Road ID immediately, reset survey state */
  const handleRoadTypeChange = (type: string) => {
    const autoID = type ? generateRoadID(type) : "";
    setFormData((p) => ({ ...p, roadType: type, roadID: autoID, surveyQuery: "" }));
    setSubSurveyOptions([]);
    setSelectedSubSurveys([]);
    setSurveyTableRows([]);
    setSearchDone(false);
  };

  /* Survey number search → populate multi-select */
  const handleSurveySearch = () => {
    const subs = getSubSurveys(form.surveyQuery);
    setSubSurveyOptions(subs.map((s) => ({ label: s, value: s })));
    setSelectedSubSurveys([]);
    setSearchDone(true);
  };

  /* Add selected sub-surveys to the table */
  const handleAddToTable = () => {
    if (!selectedSubSurveys.length) return;
    const newRows: SurveyRow[] = selectedSubSurveys
      .filter((s) => !surveyTableRows.some((r) => r.surveyNo === s))
      .map((s) => ({
        id: `${s}-${Date.now()}`,
        surveyNo: s,
        roadType: form.roadType,
        roadID: form.roadID,
      }));
    setSurveyTableRows((p) => [...p, ...newRows]);
    setSelectedSubSurveys([]);
  };

  /* Delete row from table */
  const handleDeleteRow = (id: string) =>
    setSurveyTableRows((p) => p.filter((r) => r.id !== id));

  const showToast = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 3000); };

  const handleFilesAdd  = (files: UploadedFile[]) => setUploadedFiles((p) => [...p, ...files]);
  const handleFileRemove = (idx: number) => setUploadedFiles((p) => p.filter((_, i) => i !== idx));

  const buildRecord = (status: "draft" | "submitted"): RoadRecord => ({
    id: editId ?? "RD-" + Date.now(),
    district, taluka, village,
    roadType: form.roadType,
    roadUID: form.roadID,
    surveyNo: surveyTableRows.map((r) => r.surveyNo).join(", "),
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
    setSubSurveyOptions([]);
    setSelectedSubSurveys([]);
    setSurveyTableRows([]);
    setSearchDone(false);
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

  const canSearch = form.roadType !== "" && form.surveyQuery.trim().length > 0;
  const canAdd    = selectedSubSurveys.length > 0;

  return (
    <MainLayout>

      {/* ── Toast ── */}
      {toast && (
        <div className={"fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border text-[13px] font-semibold " + (toast.type === "success" ? "bg-[#ecfdf5] border-[#bbf7d0] text-[#166534]" : "bg-[#fffbeb] border-[#fde68a] text-[#92400e]")}>
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

      <Breadcrumb crumbs={[{ label: "Road Registration" }, { label: "Praroop-2" }]} />

      {/* ── Page Header ── */}
      <div className="mt-3 mb-5">
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-1 uppercase tracking-wider font-semibold">
          <span>Maharashtra Road Portal</span>
          <ChevronRight size={10} />
          <span>Survey & Mapping</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[var(--text-primary)] leading-tight">Praroop-2</h1>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              Non-Mapped Road Registration Form (गाव नकाशावर नसलेले रस्ते नोंदणी)
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-[11px] font-semibold text-[var(--text-muted)]">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {editId ? "Editing Draft" : "New Entry"}
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-28">

        {/* ── STEP 1: Administrative Details ── */}
        <SectionCard step={1} icon={<MapPin size={15} />} title="Administrative Details" subtitle="Pre-filled from your jurisdiction selection" color="teal">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "District", labelMarathi: "जिल्हा", value: district },
              { label: "Taluka",   labelMarathi: "तालुका", value: taluka },
              { label: "Village",  labelMarathi: "गाव",    value: village },
            ].map((f) => (
              <InputBox key={f.label} label={f.label} labelMarathi={f.labelMarathi} value={f.value} disabled readOnly />
            ))}
          </div>
        </SectionCard>

        {/* ── STEP 2: Road Type + Survey Import ── */}
        <SectionCard step={2} icon={<Navigation size={15} />} title="Road Type & Survey Import" subtitle="Select road type then search and add survey numbers" color="blue">

          {/* Row 1 — Road Type + Road ID side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5 pb-5 border-b border-[var(--border)]">
            <RadioCard
              label="Road Type"
              labelMarathi="रस्त्याचा प्रकार"
              required
              columns={2}
              options={Object.entries(ROAD_TYPE_META).map(([val, m]) => ({
                value: val, title: m.label, subtitle: m.subtitle,
                color: m.color, bg: m.bg, border: m.border,
              }))}
              value={form.roadType}
              onChange={handleRoadTypeChange}
            />

            {/* Road ID — auto-generated as soon as road type picked */}
            <div className="flex flex-col justify-end">
              <InputBox
                label="Road ID"
                labelMarathi="स्वयं-निर्मित क्रमांक"
                autoGenerated
                value={form.roadID}
                readOnly
                placeholder="Select Road Type to generate"
                hint="Auto-generated on Road Type selection"
              />
            </div>
          </div>

          {/* Row 2 — Survey Number Search */}
          <div className="mb-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex col-span-1 gap-1.5">
               {/* Survey no input */}
              <div className=" flex-shrink-0">
                <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] mb-1.5 block">
                  Survey No. <span className="text-[var(--text-muted)] normal-case font-normal tracking-normal">(सर्व्हे नं.)</span>
                </label>
                <input
                  type="text"
                  value={form.surveyQuery}
                  onChange={(e) => { setField("surveyQuery", e.target.value); setSearchDone(false); }}
                  onKeyDown={(e) => e.key === "Enter" && canSearch && handleSurveySearch()}
                  placeholder="e.g. 1 or 45"
                  disabled={!form.roadType}
                  className={[
                    "w-[300px] h-[42px] px-3 text-[13px] rounded-[10px] border outline-none transition-all",
                    !form.roadType
                      ? "bg-[#f1f5f9] border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
                      : "bg-[#f8fafc] border-[var(--border)] text-[var(--text-primary)] focus:border-[var(--primary)] focus:bg-white",
                  ].join(" ")}
                />
              </div>
            </div>
            <div className="flex col-span-1 gap-1.5">
              {/* Search btn */}
              <button
                onClick={handleSurveySearch}
                disabled={!canSearch}
                className="flex items-center gap-2 h-[42px] px-4 mt-6 rounded-[10px] bg-[var(--primary)] text-white text-[13px] font-semibold hover:bg-[var(--primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                <Search size={14} />
                Search
              </button>
            </div>
            <div className="flex col-span-1 gap-1.5">
              {/* Multi-select dropdown */}
              <div className="flex flex-col gap-1.5">
                <MultiSelectDropdown
                  label="Sub Survey Numbers"
                  labelMarathi="उप सर्व्हे क्रमांक"
                  required
                  options={subSurveyOptions}
                  selected={selectedSubSurveys}
                  onChange={setSelectedSubSurveys}
                  placeholder={
                    !searchDone
                      ? "Search a survey no. first"
                      : subSurveyOptions.length === 0
                      ? "No sub-surveys found"
                      : "Select sub-survey numbers…"
                  }
                  disabled={!searchDone || subSurveyOptions.length === 0}
                  hint={searchDone && subSurveyOptions.length > 0 ? `${subSurveyOptions.length} sub-survey numbers found` : undefined}
                />
              </div>
            </div>
            <div className="flex col-span-1 gap-1.5">
              {/* Add btn */}
              <button
                onClick={handleAddToTable}
                disabled={!canAdd}
                className="flex items-center gap-2 h-[42px] px-4 rounded-[10px] border-2 border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-light,#ecfdf5)] text-[13px] font-semibold hover:bg-[var(--primary)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 mt-[18px]"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            <div className="flex col-span-2 gap-1.5"></div> 
          </div>

           

            {/* Status hint below search row */}
            {!form.roadType && (
              <p className="mt-2 text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                Select Road Type above before searching survey numbers
              </p>
            )}
            {searchDone && subSurveyOptions.length === 0 && (
              <p className="mt-2 text-[11px] text-red-500 font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                No sub-survey numbers found for "{form.surveyQuery}" — try a different number
              </p>
            )}
            {searchDone && subSurveyOptions.length > 0 && (
              <p className="mt-2 text-[11px] text-[#166534] font-medium flex items-center gap-1.5">
                <CheckCircle2 size={11} />
                {subSurveyOptions.length} sub-survey numbers found — select and click Add
              </p>
            )}
          </div>

          {/* ── Survey Table ── */}
          {surveyTableRows.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">
                  Added Survey Numbers
                </p>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">
                  {surveyTableRows.length}
                </span>
              </div>
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                {/* Head */}
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_80px] bg-[#f8fafc] border-b border-[var(--border)]">
                  {["Sr.", "Survey / Sub No.", "Road Type", "Road ID", "Action"].map((h) => (
                    <div key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {surveyTableRows.map((row, i) => {
                  const meta = ROAD_TYPE_META[row.roadType];
                  return (
                    <div
                      key={row.id}
                      className={"grid grid-cols-[1fr_1fr_1fr_1fr_80px] items-center group " + (i < surveyTableRows.length - 1 ? "border-b border-[var(--border)]" : "")}
                    >
                      <div className="px-4 py-3 text-[12px] text-[var(--text-muted)] font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="px-4 py-3 text-[12px] font-semibold text-[var(--text-primary)] font-mono">
                        {row.surveyNo}
                      </div>
                      <div className="px-4 py-3">
                        {meta && (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border"
                            style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}
                          >
                            Type {row.roadType}
                          </span>
                        )}
                      </div>
                      <div className="px-4 py-3 text-[12px] font-semibold text-[var(--text-primary)] font-mono">
                        {row.roadID}
                      </div>
                      <div className="px-3 py-3">
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Remove this survey number"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty table hint */}
          {form.roadType && surveyTableRows.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 h-[80px] border-2 border-dashed border-[var(--border)] rounded-xl bg-[#fafbfc] mt-4">
              <p className="text-[12px] text-[var(--text-muted)]">No survey numbers added yet</p>
              <p className="text-[11px] text-[var(--text-muted)] opacity-60">Search → select sub-surveys → click Add</p>
            </div>
          )}
        </SectionCard>

        {/* ── STEP 3: Road Details ── */}
        {form.roadType && (
          <SectionCard step={3} icon={<Ruler size={15} />} title="Road Details" subtitle="रस्त्याची माहिती — name and measurements" color="teal">
            <div className="grid grid-cols-3 gap-4">
              <InputBox
                label="Road Name"
                labelMarathi="रस्त्याचे नाव"
                value={form.roadName}
                placeholder="Enter road name"
                onChange={(e) => setField("roadName", e.target.value)}
              />
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
              <NumberStepper
                label="Beneficiary Farmer Count"
                labelMarathi="लाभार्थी शेतकऱ्यांची संख्या"
                value={form.beneficiaryCount}
                onChange={(v) => setField("beneficiaryCount", v)}
                min={0}
                suffixIcon={<Users size={13} />}
                placeholder="0"
                hint="Total farmers who benefit from this road"
              />
            </div>
          </SectionCard>
        )}

        {/* ── STEP 4: Encroachment ── */}
        {form.roadType && (
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

        {/* ── STEP 5: Upload Documents ── */}
        {form.roadType && (
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

      {/* ── Sticky Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-6 py-3.5 bg-white border-t border-[var(--border)] shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
        <p className="flex-1 text-[11px] text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-secondary)]">Praroop-2</span>
          {" · "}{district} › {taluka} › {village}
          {form.roadType && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[10px] font-bold">
              Type {form.roadType}
            </span>
          )}
          {surveyTableRows.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-[rgba(11,122,117,0.1)] text-[var(--primary)] text-[10px] font-bold">
              {surveyTableRows.length} survey{surveyTableRows.length !== 1 ? "s" : ""} added
            </span>
          )}
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

/* ─── SectionCard ─────────────────────────────────── */
function SectionCard({ step, icon, title, subtitle, color, children }: {
  step: number; icon: React.ReactNode; title: string; subtitle?: string;
  color: CardColor; children: React.ReactNode;
}) {
  const map: Record<CardColor, { iconBg: string; accent: string; stepBg: string }> = {
    teal:   { iconBg: "rgba(11,122,117,0.12)", accent: "var(--primary)", stepBg: "rgba(11,122,117,0.08)" },
    blue:   { iconBg: "rgba(37,99,235,0.1)",   accent: "#2563eb",        stepBg: "rgba(37,99,235,0.08)" },
    purple: { iconBg: "rgba(124,58,237,0.1)",  accent: "#7c3aed",        stepBg: "rgba(124,58,237,0.08)" },
    amber:  { iconBg: "rgba(245,158,11,0.12)", accent: "#b45309",        stepBg: "rgba(245,158,11,0.1)" },
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