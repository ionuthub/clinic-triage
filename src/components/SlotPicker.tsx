import { useMemo, useState } from "react";
import clsx from "clsx";
import { formatDateTime } from "../utils/format";
import { availableSlots } from "../scheduling/service";
import type { Clinician, Referral } from "../types/domain";
interface Props {
  referral: Referral;
  clinicians: Clinician[];
  onBook: (clinicianId: string, slotId: string) => void;
}
export function SlotPicker({ referral, clinicians, onBook }: Props) {
  const slots = useMemo(
    () => availableSlots(referral, clinicians).slice(0, 12),
    [referral, clinicians],
  );
  const [selected, setSelected] = useState(slots[0]?.id ?? "");
  const [error, setError] = useState("");
  const submit = () => {
    const slot = slots.find((item) => item.id === selected);
    if (!slot) {
      setError("Choose an available appointment time");
      return;
    }
    try {
      onBook(slot.clinicianId, slot.id);
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Booking could not be completed",
      );
    }
  };
  if (!slots.length)
    return (
      <section className="card">
        <div className="card-heading">
          <h2>Book appointment</h2>
        </div>
        <div className="notice warning">
          No suitable slots are currently available. Contact the service
          coordinator.
        </div>
      </section>
    );
  return (
    <section className="card slot-picker">
      <div className="card-heading">
        <div>
          <span className="eyebrow">Next available</span>
          <h2>Book appointment</h2>
        </div>
        <span className="slot-count">{slots.length} options</span>
      </div>
      <div className="slot-list">
        {slots.map((slot) => {
          const clinician = clinicians.find(
            (item) => item.id === slot.clinicianId,
          );
          return (
            <button
              type="button"
              key={slot.id}
              className={clsx(
                "slot-option",
                selected === slot.id && "selected",
              )}
              onClick={() => setSelected(slot.id)}
            >
              <span className="slot-radio" />
              <span>
                <strong>{formatDateTime(slot.startsAt)}</strong>
                <small>
                  {clinician?.name} · {clinician?.location}
                </small>
              </span>
              <em>{slot.remote ? "Remote" : "Clinic"}</em>
            </button>
          );
        })}
      </div>
      {error && (
        <div role="alert" className="notice error">
          {error}
        </div>
      )}
      <button className="button primary full" type="button" onClick={submit}>
        Confirm appointment
      </button>
    </section>
  );
}
