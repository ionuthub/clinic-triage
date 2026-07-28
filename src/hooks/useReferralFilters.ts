import { useMemo, useState } from "react";
import type {
  PriorityBand,
  Referral,
  ReferralStatus,
  ReferralType,
} from "../types/domain";
export type StatusFilter = ReferralStatus | "all";
export type TypeFilter = ReferralType | "all";
export type BandFilter = PriorityBand | "all" | "unbanded";
export function useReferralFilters(referrals: Referral[]) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [band, setBand] = useState<BandFilter>("all");
  const filtered = useMemo(
    () =>
      referrals.filter((referral) => {
        const needle = query.trim().toLowerCase();
        const matchesText =
          !needle ||
          [
            referral.id,
            referral.patient.name,
            referral.patient.nhsNumber,
            referral.service,
            referral.reason,
          ].some((value) => value.toLowerCase().includes(needle));
        const matchesStatus = status === "all" || referral.status === status;
        const matchesType = type === "all" || referral.type === type;
        const matchesBand =
          band === "all" ||
          (band === "unbanded"
            ? !referral.priority
            : referral.priority === band);
        return matchesText && matchesStatus && matchesType && matchesBand;
      }),
    [referrals, query, status, type, band],
  );
  const reset = () => {
    setQuery("");
    setStatus("all");
    setType("all");
    setBand("all");
  };
  return {
    query,
    setQuery,
    status,
    setStatus,
    type,
    setType,
    band,
    setBand,
    filtered,
    reset,
    activeCount: [
      query,
      status !== "all",
      type !== "all",
      band !== "all",
    ].filter(Boolean).length,
  };
}
