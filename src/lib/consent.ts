/**
 * Cookie consent store. Analytics never loads until the visitor accepts.
 * The choice lives in localStorage on this device only; every access is
 * wrapped so private windows and blocked storage simply mean "not decided".
 */
export type Consent = "granted" | "denied" | "unset";

const KEY = "rl-consent-v1";
const EVENT = "rl-consent-change";
const OPEN_EVENT = "rl-consent-open";

export function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

export function writeConsent(value: Exclude<Consent, "unset">) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the choice holds for this page view only.
    memory = value;
  }
  window.dispatchEvent(new Event(EVENT));
}

let memory: Consent = "unset";

export function getConsentSnapshot(): Consent {
  const stored = readConsent();
  return stored === "unset" ? memory : stored;
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Ask the banner to reopen (used by the "Cookie settings" link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function subscribeOpenSettings(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
