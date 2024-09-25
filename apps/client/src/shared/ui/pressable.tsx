import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useState,
} from "react"
import { useHaptic } from "../hooks/use-haptic"

type PressableProps = {
  onPress?: () => void
  onLongPress?: () => void
  children?: ReactNode
} & HTMLAttributes<HTMLButtonElement>

export const Pressable = (props: PressableProps) => {
  const [pressedAt, setPressedAt] = useState(0)
  const [timeoutId, setTimeoutId] = useState<Timer>()

  const haptic = useHaptic()

  const onLongPress = useCallback(() => {
    haptic("selection")
    props.onLongPress?.()
  }, [haptic, props.onLongPress])

  return (
    <button
      {...props}
      type="button"
      onContextMenu={(e) => {
        e.preventDefault()
        props.onLongPress?.()
      }}
      onPointerDown={() => {
        setPressedAt(Date.now())
        setTimeoutId(
          setTimeout(() => {
            onLongPress()
            setTimeoutId(undefined)
            setPressedAt(0)
          }, 500)
        )
      }}
      onPointerMove={(e) => {
        if (Math.max(e.movementX, e.movementY) > 2) {
          clearTimeout(timeoutId)
          setTimeoutId(undefined)
          setPressedAt(0)
        }
      }}
      onPointerUp={() => {
        clearTimeout(timeoutId)
        setTimeoutId(undefined)
        setPressedAt(0)

        if (Date.now() - pressedAt > 500) {
          if (timeoutId) onLongPress()
        } else props.onPress?.()
      }}
    >
      {props.children}
    </button>
  )
}
