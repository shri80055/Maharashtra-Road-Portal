import type { RoadRecord } from "../store/roadStore";
import type { UploadedFile } from "../components/common";

export type FormType = "praroop1" | "praroop2" | "praroop3";

export function parseMeasurement(value: string): { amount: string; unit: string } {
  const trimmed = value.trim();
  if (!trimmed) return { amount: "", unit: "m" };

  const match = trimmed.match(/^([\d.]+)\s*(\w+)?$/);
  if (!match) return { amount: trimmed, unit: "m" };

  return {
    amount: match[1],
    unit: match[2] || "m",
  };
}

export function inferFormType(record: RoadRecord): FormType {
  if (record.formType) return record.formType;
  if (record.ghatNo?.startsWith("part")) return "praroop3";
  if (record.roadType === "D" || record.roadType === "E") return "praroop2";
  return "praroop1";
}

export function getPraroopPath(record: RoadRecord): string {
  const formType = inferFormType(record);
  if (formType === "praroop2") return "/praroop2";
  if (formType === "praroop3") return "/praroop3";
  return "/praroop1";
}

export function fileNamesToUploadedFiles(fileName: string): UploadedFile[] {
  if (!fileName.trim()) return [];

  return fileName
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      size: "—",
      url: "",
      type: name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg",
    }));
}

export function surveyNosToRows(
  surveyNo: string,
  roadType: string,
  roadID: string,
): { id: string; surveyNo: string; roadType: string; roadID: string }[] {
  if (!surveyNo.trim()) return [];

  return surveyNo
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((survey, index) => ({
      id: `restored-${index}-${survey}`,
      surveyNo: survey,
      roadType,
      roadID,
    }));
}
