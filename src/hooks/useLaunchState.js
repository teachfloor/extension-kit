import { useExtensionContext } from '../context/ExtensionContext'

/**
 * Convenience hook returning the app-passed launch state for the
 * current iframe — set by whoever opened this view (e.g. a parent
 * widget calling `openModal({ state: … })`).
 *
 * Read-once at mount, does not update. Returns whatever was passed
 * (any JSON-serializable value) or `null` if no state was passed.
 *
 * Same value as `useExtensionContext().state` — the hook exists so the
 * variable name at the call site doesn't collide visually with React's
 * `useState` locals:
 *
 *   const params = useLaunchState()             // clearly kit state
 *   const [count, setCount] = useState(0)       // clearly local state
 *
 * vs. the destructuring alternative:
 *
 *   const { state } = useExtensionContext()     // 'wait, which state?'
 *   const [count, setCount] = useState(0)
 */
export const useLaunchState = () => (
  useExtensionContext().state
)
