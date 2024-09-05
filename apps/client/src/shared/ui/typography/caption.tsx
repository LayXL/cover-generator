import { cn } from "@/shared/utils/cn"
import { Typography, type TypographyProps } from "."

type CaptionProps = TypographyProps & {
  level?: 1 | 2 | 3 | 4
}

export const Caption = (props: CaptionProps) => {
  const level = props.level ?? 1
  return (
    <Typography
      {...props}
      className={cn(
        level === 1 && "text-[13px] leading-none",
        level === 2 && "text-xs leading-[14px]",
        level === 3 && "text-[11px] leading-[14px] tracking-tight",
        level === 4 && "text-[9px] leading-3 tracking-tight",
        props.className
      )}
    />
  )
}
