// Stale-while-revalidate cache for backend GET requests.
//
// Pattern: read whatever's in localStorage and return it INSTANTLY (so
// the UI renders with no spinner), then fire the real network request
// in the background. When that completes, write the fresh response to
// localStorage and call the supplied `onFresh` callback so the
// component can re-render with new data.
//
// Eliminates the user-visible cold-start: the second time the user
// opens the services list / their bookings, the data appears on screen
// before the network even thinks about waking Render's dyno.
//
// CACHE KEY POLICY: namespace by endpoint path so different pages don't
// stomp on each other. TTL of 24h — old data is still better than a
// blank screen during a cold-start. Caller can ignore stale data via
// the `maxAgeMs` option.

export interface SwrOptions<T> {
  // How long the cached value is considered fresh. Older than this and
  // we still return it (UI renders instantly) but the caller may want
  // to show a "refreshing…" indicator. Default 24h.
  maxAgeMs?: number
  // Called when fresh data arrives from the network. The component
  // typically setState(fresh) here so the UI updates with new content.
  onFresh: (data: T) => void
  // Called if the network request fails. Cached data is still returned
  // synchronously so the page doesn't break, but the caller can show
  // a small "couldn't refresh" toast if it wants.
  onError?: (error: unknown) => void
}

const CACHE_PREFIX = 'flipon_swr:'

interface CachedEntry<T> {
  v: T
  ts: number
}

const readCache = <T>(key: string): { value: T; ageMs: number } | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedEntry<T>
    if (!parsed || typeof parsed.ts !== 'number') return null
    return { value: parsed.v, ageMs: Date.now() - parsed.ts }
  } catch {
    return null
  }
}

const writeCache = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ v: value, ts: Date.now() } satisfies CachedEntry<T>),
    )
  } catch {
    /* quota exceeded — ignore, cache is best-effort */
  }
}

// Returns the cached value (if any) AND kicks off a background fetch
// that calls onFresh when it lands. The caller seeds React state with
// the cached value so render is instant.
export const swrFetch = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: SwrOptions<T>,
): { cached: T | null; ageMs: number } => {
  const hit = readCache<T>(key)

  // Fire the background refresh; we DON'T await it here — caller's
  // initial render uses the cached value, the network response triggers
  // a follow-up state update via onFresh.
  ;(async () => {
    try {
      const fresh = await fetcher()
      writeCache(key, fresh)
      options.onFresh(fresh)
    } catch (e) {
      if (options.onError) options.onError(e)
    }
  })()

  return hit ? { cached: hit.value, ageMs: hit.ageMs } : { cached: null, ageMs: -1 }
}

// Helper for the common React hook pattern — wires the swr response
// into a useState setter so the component just calls one function.
export const useSwrSeed = <T>(
  key: string,
  fetcher: () => Promise<T>,
  setter: (data: T) => void,
  setLoading?: (b: boolean) => void,
): T | null => {
  const result = swrFetch<T>(key, fetcher, {
    onFresh: (fresh) => {
      setter(fresh)
      if (setLoading) setLoading(false)
    },
    onError: () => {
      // Network failed — but if we had cached data, the UI already
      // rendered with it. Just stop the spinner.
      if (setLoading) setLoading(false)
    },
  })
  if (result.cached !== null && setLoading) setLoading(false)
  return result.cached
}
