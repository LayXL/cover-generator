import { cn } from "@/shared/utils/cn"
import type { ClassValue } from "clsx"
import { type CSSProperties, useMemo } from "react"

type IconProps = {
  name: string
  size?: number
  color?: string
  className?: ClassValue
}

export const Icon = (props: IconProps) => {
  const size = props.size ?? 24

  const styles = useMemo<CSSProperties>(
    () => ({
      "--size": `${size}px`,
      maskImage: `url(/icons/${props.name}.svg)`,
      maskPosition: "center center",
      color: props.color,
    }),
    [size, props.name, props.color]
  )

  return (
    <span
      className={cn(
        "block size-[var(--size)] bg-current text-primary",
        props.className
      )}
      style={styles}
    />
  )
}
