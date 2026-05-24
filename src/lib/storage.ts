/** Fog-of-war discovery ids persisted in localStorage. */
const STORAGE_KEY = 'lineaireb-discovered'

export function loadDiscovered(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(JSON.parse(raw ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

export function saveDiscovered(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

export function clearDiscovered(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
