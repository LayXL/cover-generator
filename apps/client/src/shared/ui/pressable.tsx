import { type HTMLAttributes, type ReactNode, useRef } from "react"
import { useHaptic } from "../hooks/use-haptic"

type PressableProps = {
  onPress?: () => void
  onLongPress?: () => void
  children?: ReactNode
} & HTMLAttributes<HTMLButtonElement>

export const Pressable = (props: PressableProps) => {
  const haptic = useHaptic()
  const ref = useRef<HTMLButtonElement>(null)

  // useLongPress(
  //   () => {
  //     haptic("selection")
  //     props.onLongPress?.()
  //   },
  //   ref,
  //   {
  //     moveThreshold: { x: 10, y: 10 },
  //     onClick: props.onPress,
  //   }
  // )

  return (
    <button
      ref={ref}
      type="button"
      onClick={props.onPress}
      onContextMenu={(e) => {
        e.preventDefault()
        props.onLongPress?.()
      }}
    >
      {props.children}
    </button>
  )
}
