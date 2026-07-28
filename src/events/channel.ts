import type { ClinicEvents, EventName } from './types';

type Listener<K extends EventName> = (payload: ClinicEvents[K]) => void;

class EventChannel {
  private listeners = new Map<EventName, Set<(payload: never) => void>>();

  on<K extends EventName>(name: K, listener: Listener<K>): () => void {
    const group = this.listeners.get(name) ?? new Set();
    group.add(listener as (payload: never) => void);
    this.listeners.set(name, group);
    return () => group.delete(listener as (payload: never) => void);
  }

  emit<K extends EventName>(name: K, payload: ClinicEvents[K]): void {
    this.listeners.get(name)?.forEach((listener) => listener(payload as never));
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const clinicEvents = new EventChannel();
