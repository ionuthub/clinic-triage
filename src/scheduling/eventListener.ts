import { clinicEvents } from "../events/channel";
const recentlyBooked = new Set<string>();
clinicEvents.on("appointment:booked", ({ appointment }) => {
  recentlyBooked.add(appointment.slotId);
});
export function wasRecentlyBooked(slotId: string): boolean {
  return recentlyBooked.has(slotId);
}
