/**
 * Public case payload returned by POST /api/track.
 *
 * Deliberately narrow: no patient data and no owner-only metadata. Lives in its
 * own module (rather than in the route handler) so the client component can
 * import the type without pulling in any server-side code.
 */
export type PublicCase = {
  code: string;
  doctorName: string;
  expectedDelivery: string;
  currentStage: string;
  history: { stage: string; changedAt: string }[];
};