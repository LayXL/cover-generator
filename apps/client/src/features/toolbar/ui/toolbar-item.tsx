import { useHaptic } from "@/shared/hooks/use-haptic"
import { Caption, Text } from "@/shared/ui/typography"
import { cn } from "@/shared/utils/cn"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

export type ToolbarItemData = {
  name: string
  title: string
  icon?: ReactNode
  onSelect?: (toolbar: {
    push: (tabName: string) => void
    markAsSelected: () => void
    pushAndMark: (tabName: string) => void
  }) => void
  isSelected?: boolean
  mode?: "primary" | "secondary"
  canGoBack?: boolean
}

type ToolbarItemProps = {
  onClick: () => void
} & ToolbarItemData

export const ToolbarItem = (props: ToolbarItemProps) => {
  const mode = props.mode ?? "primary"
  const haptic = useHaptic()

  return (
    <button
      type="button"
      onClick={() => {
        haptic("selection")
        props.onClick()
      }}
      className="size-full flex-1"
    >
      <motion.div
        className={cn(
          "size-full flex flex-col gap-0.5 items-center justify-center rounded-[10px] border border-transparent transition-colors",
          !props.isSelected && "desktop:hover:bg-inversed/10",
          mode === "secondary" && "flex-row gap-1.5",
          mode === "secondary" &&
            props.isSelected &&
            "bg-primary border-inversed/10",
          mode === "primary" && props.isSelected && "bg-surface"
        )}
        whileTap={{ scale: 0.9 }}
      >
        <div
          className={cn(
            "[&>svg]:!size-[var(--size)] [&>svg]:text-inversed/50 [&>svg]:fill-current",
            (props.isSelected || !props.canGoBack) && "[&>svg]:text-accent"
          )}
          style={{
            "--size": mode === "primary" ? "28px" : "20px",
          }}
        >
          {props.icon}
        </div>
        {mode === "primary" && (
          <Caption
            level={2}
            className="font-medium text-primary/50 line-clamp-1"
          >
            {props.title}
          </Caption>
        )}
        {mode === "secondary" && (
          <Text className="font-semibold">{props.title}</Text>
        )}
      </motion.div>
    </button>
  )
}
