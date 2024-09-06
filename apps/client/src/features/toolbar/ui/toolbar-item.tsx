import { Caption, Text } from "@/shared/ui/typography"
import { cn } from "@/shared/utils/cn"
import type { ReactNode } from "react"
import type { ToolbarContext } from "../lib/useToolBar"

export type ToolbarItemData = {
  name: string
  title: string
  icon?: ReactNode
  onSelect?: (toolbar: ToolbarContext) => void
  isSelected?: boolean
  mode?: "primary" | "secondary"
}

type ToolbarItemProps = {
  onClick: () => void
} & ToolbarItemData

export const ToolbarItem = (props: ToolbarItemProps) => {
  const mode = props.mode ?? "primary"

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        "w-full h-full flex flex-col gap-0.5 items-center justify-center",
        mode === "secondary" && "flex-row gap-1.5"
      )}
    >
      <div
        className={cn(
          "[&>svg]:!size-[var(--size)]",
          mode === "secondary" && "fill-inversed/50"
        )}
        style={{
          "--size": mode === "primary" ? "28px" : "20px",
        }}
      >
        {props.icon}
      </div>
      {mode === "primary" && (
        <Caption level={2} className="font-medium text-primary/50">
          {props.title}
        </Caption>
      )}
      {mode === "secondary" && (
        <Text className="font-semibold">{props.title}</Text>
      )}
    </button>
  )
}
