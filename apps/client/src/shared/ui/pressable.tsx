import { type HTMLAttributes, type ReactNode, useState } from "react"

type PressableProps = {
  onPress?: () => void
  onLongPress?: () => void
  children?: ReactNode
} & HTMLAttributes<HTMLButtonElement>

export const Pressable = (props: PressableProps) => {
  const [pressedAt, setPressedAt] = useState(0)
  const [timeoutId, setTimeoutId] = useState<Timer>()

  return (
    <button
      {...props}
      type="button"
      onContextMenu={(e) => {
        e.preventDefault()
        props.onLongPress?.()
      }}
      onMouseDown={() => {
        setPressedAt(Date.now())
        setTimeoutId(
          setTimeout(() => {
            props.onLongPress?.()
            setTimeoutId(undefined)
          }, 500)
        )
      }}
      onMouseUp={() => {
        clearTimeout(timeoutId)
        setTimeoutId(undefined)
        setPressedAt(0)

        if (Date.now() - pressedAt > 500) {
          if (timeoutId) props.onLongPress?.()
        } else props.onPress?.()
      }}
    >
      {props.children}
    </button>
  )
}
