import { useNavigate } from "react-router-dom";
import {
  FileCheck, Plus, ChevronRight, Search, Filter,
  MapPin, Clock, Eye, X, Hash, Ruler, AlertTriangle,
  FileText, Navigation,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import { useRoadStore } from "../store/roadStore";
import type { RoadRecord } from "../store/roadStore";
import { useState } from "react";

export default function SubmittedRecords() {
  const { submitted } = useRoadStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<RoadRecord | null>(null);

  const filtered = submitted.filter(
    (d) =>
      d.roadName.toLowerCase().includes(search.toLowerCase()) ||
      d.roadUID.toLowerCase().includes(search.toLowerCase()) ||
      d.village.toLowerCase().includes(search.toLowerCase())
  );

  const roadTypeBadge: Record<string, string> = {
    A: "bg-blue-100 text-blue-700 border-blue-200",
    B: "bg-teal-100 text-teal-700 border-teal-200",
    C: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <MainLayout>
      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewing(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[var(--border)] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-0.5">Submitted Record — View Only</p>
                <h2 className="text-[16px] font-bold text-[var(--text-primary)]">{viewing.roadName || "Untitled Road"}</h2>
              </div>
              <button onClick={() => setViewing(null)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[#f8fafc] transition-all">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status banner */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#ecfdf5] border border-[#bbf7d0] rounded-xl">
                <FileCheck size={16} className="text-[var(--success)]" />
                <div>
                  <p className="text-[12px] font-semibold text-[#166534]">Successfully Submitted</p>
                  <p className="text-[11px] text-[#166534] opacity-75">Submitted on {viewing.savedAt}</p>
                </div>
              </div>

              <ViewGroup label="Administrative Details" icon={<MapPin size={13} />}>
                <ViewGrid>
                  <ViewField label="District" value={viewing.district} />
                  <ViewField label="Taluka" value={viewing.taluka} />
                  <ViewField label="Village" value={viewing.village} />
                </ViewGrid>
              </ViewGroup>

              <ViewGroup label="Road Type" icon={<Navigation size={13} />}>
                <span className={"inline-flex items-center px-3 py-1.5 rounded-lg border text-[13px] font-bold " + (roadTypeBadge[viewing.roadType] ?? "bg-gray-100 text-gray-600 border-gray-200")}>
                  Type {viewing.roadType}
                </span>
              </ViewGroup>

              <ViewGroup label="Road Information" icon={<Hash size={13} />}>
                <ViewGrid>
                  <ViewField label="Road UID" value={viewing.roadUID} mono />
                  <ViewField label="Road Name" value={viewing.roadName} />
                  <ViewField label="Survey No." value={viewing.surveyNo} mono />
                  <ViewField label="Ghat / Sub No." value={viewing.ghatNo} />
                  <ViewField label="Road Category" value={viewing.roadCategory} />
                </ViewGrid>
              </ViewGroup>

              <ViewGroup label="Measurements" icon={<Ruler size={13} />}>
                <ViewGrid cols={2}>
                  <ViewField label="Road Length" value={viewing.roadLength ? viewing.roadLength + " m" : "—"} />
                  <ViewField label="Breadth / Width" value={viewing.breadth ? viewing.breadth + " m" : "—"} />
                </ViewGrid>
              </ViewGroup>

              <ViewGroup label="Encroachment" icon={<AlertTriangle size={13} />}>
                <span className={"inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[13px] font-semibold " + (viewing.encroachment === "yes" ? "bg-red-50 border-red-200 text-red-600" : "bg-[#ecfdf5] border-[#bbf7d0] text-[var(--success)]")}>
                  <div className={"w-2 h-2 rounded-full " + (viewing.encroachment === "yes" ? "bg-red-500" : "bg-[var(--success)]")} />
                  {viewing.encroachment === "yes" ? "Yes — Encroachment Present" : "No — Clear Road"}
                </span>
              </ViewGroup>

              {viewing.fileName && (
                <ViewGroup label="Uploaded Document" icon={<FileText size={13} />}>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#f8fafc] border border-[var(--border)] rounded-lg text-[12px] text-[var(--text-secondary)]">
                    <FileText size={13} className="text-[var(--primary)]" />
                    {viewing.fileName}
                  </div>
                </ViewGroup>
              )}
            </div>
          </div>
        </div>
      )}

      <Breadcrumb crumbs={[{ label: "Road Registration" }, { label: "Submitted" }]} />

      <div className="mt-3 mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-1 uppercase tracking-wider font-semibold">
            <span>Maharashtra Road Portal</span>
            <ChevronRight size={10} />
            <span>Submitted Records</span>
          </div>
          <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Submitted Records</h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
            Final submitted road entries — {submitted.length} record{submitted.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/praroop1")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[var(--primary)] text-white text-[13px] font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-sm flex-shrink-0"
        >
          <Plus size={15} />
          New Entry
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 max-w-xs h-[38px] px-3 bg-white border border-[var(--border)] rounded-[10px]">
          <Search size={14} className="text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by road name, UID, village…"
            className="flex-1 bg-transparent text-[13px] outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </div>
        <button className="flex items-center gap-2 h-[38px] px-3 border border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text-muted)] bg-white hover:bg-[#f8fafc] transition-all">
          <Filter size={13} />
          Filter
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState search={search} onNew={() => navigate("/praroop1")} />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((rec) => (
            <div
              key={rec.id}
              className="group bg-white border border-[var(--border)] rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all overflow-hidden"
            >
              <div className="h-[3px] bg-gradient-to-r from-[var(--primary)] to-teal-400" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] border border-[#bbf7d0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileCheck size={16} className="text-[var(--primary)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-bold text-[var(--text-primary)] leading-tight">
                          {rec.roadName || "Untitled Road"}
                        </p>
                        <span className={"inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-bold " + (roadTypeBadge[rec.roadType] ?? "bg-gray-100 text-gray-600 border-gray-200")}>
                          Type {rec.roadType}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#bbf7d0] text-[10px] font-semibold text-[var(--success)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                          Submitted
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">
                        {rec.roadUID || "No UID assigned"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewing(rec)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[var(--border)] text-[var(--text-secondary)] text-[12px] font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[#ecfdf5] transition-all flex-shrink-0"
                  >
                    <Eye size={13} />
                    View
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-4 gap-3">
                  <MetaCell icon={<MapPin size={11} />} label="Location">
                    {[rec.district, rec.taluka, rec.village].filter(Boolean).join(" › ")}
                  </MetaCell>
                  <MetaCell icon={null} label="Survey No.">
                    {rec.surveyNo || "—"}
                  </MetaCell>
                  <MetaCell icon={null} label="Length × Breadth">
                    {rec.roadLength && rec.breadth ? `${rec.roadLength}m × ${rec.breadth}m` : "—"}
                  </MetaCell>
                  <MetaCell icon={<Clock size={11} />} label="Submitted On">
                    {rec.savedAt}
                  </MetaCell>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

function ViewGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#fafbfc] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-white">
        <span className="text-[var(--text-muted)]">{icon}</span>
        <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">{label}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ViewGrid({ cols = 3, children }: { cols?: number; children: React.ReactNode }) {
  return <div className={`grid grid-cols-${cols} gap-4`}>{children}</div>;
}

function ViewField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
      <p className={"text-[13px] font-semibold text-[var(--text-primary)] " + (mono ? "font-mono" : "")}>
        {value || "—"}
      </p>
    </div>
  );
}

function MetaCell({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mb-0.5 font-semibold uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className="text-[12px] text-[var(--text-secondary)] font-medium truncate">{children}</p>
    </div>
  );
}

function EmptyState({ search, onNew }: { search: string; onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#ecfdf5] border border-[#bbf7d0] flex items-center justify-center mb-4">
        <FileCheck size={28} className="text-[var(--primary)]" />
      </div>
      <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-1">
        {search ? "No submitted records match" : "No submissions yet"}
      </h3>
      <p className="text-[12px] text-[var(--text-muted)] max-w-xs mb-5">
        {search ? "Try a different search term." : "Submit a Praroop-1 form to see it here."}
      </p>
      {!search && (
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[var(--primary)] text-white text-[13px] font-semibold hover:bg-[var(--primary-dark)] transition-all"
        >
          <Plus size={15} />
          New Entry
        </button>
      )}
    </div>
  );
}
