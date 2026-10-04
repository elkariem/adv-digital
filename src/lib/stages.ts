import stagesJson from "@/data/manufacturing-stages.json";

/** Canonical stage ids, in the normal manufacturing order. */
export const STAGE_IDS = [
  "case-received",
  "digital-design",
  "manufacturing",
  "layering-coloring",
  "quality-check",
  "packaging-shipping",
  "delivered",
] as const;

export type StageId = (typeof STAGE_IDS)[number];

export const manufacturingStages = stagesJson.manufacturingStages;

/**
 * The order above is presentation order only. Nothing enforces it at runtime:
 * the owner may skip stages, repeat them, or move backwards for rework.
 */
if (manufacturingStages.map((s) => s.id).join(",") !== STAGE_IDS.join(",")) {
  throw new Error(
    "manufacturing-stages.json is out of sync with STAGE_IDS. Keep the seven canonical stages in order.",
  );
}

export function isStageId(value: unknown): value is StageId {
  return typeof value === "string" && (STAGE_IDS as readonly string[]).includes(value);
}

export function getStage(id: StageId) {
  const stage = manufacturingStages.find((s) => s.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return stage;
}
