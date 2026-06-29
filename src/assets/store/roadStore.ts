import { create } from "zustand";

export type RoadRecord = {
  id: string;
  district: string;
  taluka: string;
  village: string;
  roadType: string;
  roadUID: string;
  surveyNo: string;
  ghatNo: string;
  roadName: string;
  roadCategory: string;
  roadLength: string;
  breadth: string;
  encroachment: string;
  fileName: string;
  savedAt: string;
  status: "draft" | "submitted";
};

type RoadStore = {
  drafts: RoadRecord[];
  submitted: RoadRecord[];
  addDraft: (r: RoadRecord) => void;
  updateDraft: (id: string, r: Partial<RoadRecord>) => void;
  deleteDraft: (id: string) => void;
  submitRecord: (r: RoadRecord) => void;
};

export const useRoadStore = create<RoadStore>((set) => ({
  drafts: [],
  submitted: [],

  addDraft: (r) =>
    set((s) => ({ drafts: [r, ...s.drafts] })),

  updateDraft: (id, updated) =>
    set((s) => ({
      drafts: s.drafts.map((d) => (d.id === id ? { ...d, ...updated } : d)),
    })),

  deleteDraft: (id) =>
    set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),

  submitRecord: (r) =>
    set((s) => ({
      drafts: s.drafts.filter((d) => d.id !== r.id),
      submitted: [r, ...s.submitted],
    })),
}));
