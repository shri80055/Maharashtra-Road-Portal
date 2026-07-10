import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FormType = "praroop1" | "praroop2" | "praroop3";

export type RoadRecord = {
  id: string;
  formType?: FormType;
  district: string;
  taluka: string;
  village: string;
  roadType: string;
  roadUID: string;
  roadID?: string;
  surveyNo: string;
  ghatNo: string;
  roadName: string;
  roadCategory: string;
  roadLength: string;
  breadth: string;
  order: string;
  termsandconditions: string;
  tenure: string;
  remarks: string;
  beneficiaryCount?: string;
  encroachment: string;
  encroachmentDetails?: string;
  fileName: string;
  savedAt: string;
  status: "draft" | "submitted";
  pin: string;

};

type RoadStore = {
  drafts: RoadRecord[];
  submitted: RoadRecord[];
  addDraft: (r: RoadRecord) => void;
  updateDraft: (id: string, r: Partial<RoadRecord>) => void;
  deleteDraft: (id: string) => void;
  submitRecord: (r: RoadRecord) => void;
};

export const useRoadStore = create<RoadStore>()(
  persist(
    (set) => ({
      drafts: [],
      submitted: [],

      addDraft: (r) =>
        set((s) => ({ drafts: [r, ...s.drafts] })),

      updateDraft: (id, updated) =>
        set((s) => ({
          drafts: s.drafts.map((d) => (d.id === id ? { ...d, ...updated, id } : d)),
        })),

      deleteDraft: (id) =>
        set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),

      submitRecord: (r) =>
        set((s) => ({
          drafts: s.drafts.filter((d) => d.id !== r.id),
          submitted: [r, ...s.submitted.filter((item) => item.id !== r.id)],
        })),
    }),
    {
      name: "maharashtra-road-store",
      partialize: (state) => ({
        drafts: state.drafts,
        submitted: state.submitted,
      }),
    },
  ),
);
