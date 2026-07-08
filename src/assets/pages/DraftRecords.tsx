import { useNavigate } from "react-router-dom";
import {
  FolderOpen, Edit2, Trash2, Plus, FileText,
  MapPin, Clock, ChevronRight, Search, Filter,
} from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import { useRoadStore } from "../store/roadStore";
import { getPraroopPath } from "../utils/draftHydration";
import { useState } from "react";

export default function DraftRecords() {
  const { drafts, deleteDraft } = useRoadStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = drafts.filter(
    (d) =>
      d.roadName.toLowerCase().includes(search.toLowerCase()) ||
      d.roadUID.toLowerCase().includes(search.toLowerCase()) ||
      d.village.toLowerCase().includes(search.toLowerCase())
  );

  const roadTypeBadge: Record<string, string> = {
    A: "bg-blue-100 text-blue-700 border-blue-200",
    B: "bg-teal-100 text-teal-700 border-teal-200",
    C: "bg-purple-100 text-purple-700 border-purple-200",
    D: "bg-orange-100 text-orange-700 border-orange-200",
    E: "bg-red-100 text-red-700 border-red-200",
  };

  const formTypeLabel: Record<string, string> = {
    praroop1: "Praroop-1",
    praroop2: "Praroop-2",
    praroop3: "Praroop-3",
  };

  return (
    <MainLayout>
      <Breadcrumb crumbs={[{ label: "Road Registration" }, { label: "Draft Records" }]} />

      <div className="mt-3 mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-1 uppercase tracking-wider font-semibold">
            <span>Maharashtra Road Portal</span>
            <ChevronRight size={10} />
            <span>Draft Records</span>
          </div>
          <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Draft Records</h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
            Saved drafts pending submission — {drafts.length} record{drafts.length !== 1 ? "s" : ""}
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

      {/* Search bar */}
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
              {/* Draft amber top strip */}
              <div className="h-[3px] bg-gradient-to-r from-amber-400 to-amber-300" />

              <div className="p-4">
                <div className="flex items-start justify-between gap-4">

                  {/* Left: Icon + Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FolderOpen size={16} className="text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-bold text-[var(--text-primary)] leading-tight">
                          {rec.roadName || "Untitled Road"}
                        </p>
                        <span
                          className={
                            "inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-bold " +
                            (roadTypeBadge[rec.roadType] ?? "bg-gray-100 text-gray-600 border-gray-200")
                          }
                        >
                          Type {rec.roadType}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-700">
                          Draft
                        </span>
                        {rec.formType && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-600">
                            {formTypeLabel[rec.formType] ?? rec.formType}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">
                        {rec.roadUID || "No UID assigned"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        navigate(getPraroopPath(rec), {
                          state: {
                            editId: rec.id,
                            district: rec.district,
                            taluka: rec.taluka,
                            village: rec.village,
                          },
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] border border-[var(--primary)] text-[var(--primary)] bg-[#ecfdf5] text-[12px] font-semibold hover:bg-[var(--primary)] hover:text-white transition-all"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    {deleteConfirm === rec.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { deleteDraft(rec.id); setDeleteConfirm(null); }}
                          className="px-3 py-2 rounded-[8px] bg-red-500 text-white text-[12px] font-semibold hover:bg-red-600 transition-all"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-2 rounded-[8px] border border-[var(--border)] text-[12px] text-[var(--text-muted)] hover:bg-[#f8fafc] transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(rec.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[var(--border)] text-[var(--text-muted)] hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-4 gap-3">
                  <MetaCell icon={<MapPin size={11} />} label="Location">
                    {[rec.district, rec.taluka, rec.village].filter(Boolean).join(" › ")}
                  </MetaCell>
                  <MetaCell icon={<FileText size={11} />} label="Survey No.">
                    {rec.surveyNo || "—"}
                  </MetaCell>
                  <MetaCell icon={null} label="Length × Breadth">
                    {rec.roadLength && rec.breadth ? `${rec.roadLength}m × ${rec.breadth}m` : "—"}
                  </MetaCell>
                  <MetaCell icon={<Clock size={11} />} label="Last Saved">
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
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
        <FolderOpen size={28} className="text-amber-500" />
      </div>
      <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-1">
        {search ? "No drafts match your search" : "No drafts yet"}
      </h3>
      <p className="text-[12px] text-[var(--text-muted)] max-w-xs mb-5">
        {search
          ? "Try a different search term or clear the filter."
          : "Start a new Praroop-1 entry and save it as a draft to see it here."}
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
