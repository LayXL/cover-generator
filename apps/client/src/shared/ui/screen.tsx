import type { ClassValue } from "clsx"
import type { ReactNode } from "react"
import { cn } from "../utils/cn"

type ScreenProps = {
  children: ReactNode
  className?: ClassValue
}

export const Screen = (props: ScreenProps) => {
  return (
    <div
      className={cn(
        "min-h-screen max-h-screen h-screen overflow-hidden flex flex-col",
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
