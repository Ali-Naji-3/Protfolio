/**
 * Tiny typed event bus — lets motion modules signal each other (e.g. the
 * hero's fault beat asks the audio kit for its strike) without imports
 * crossing in both directions.
 */
export type BusEvent =
  | 'hero:fault'
  | 'demo:fault'
  | 'demo:safe'
  | 'audio:enabled'
  | 'cinema:bars-in'
  | 'cinema:bars-out';

type Handler = () => void;

const handlers = new Map<BusEvent, Set<Handler>>();

export function on(event: BusEvent, fn: Handler): void {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event)!.add(fn);
}

export function emit(event: BusEvent): void {
  handlers.get(event)?.forEach((fn) => fn());
}
