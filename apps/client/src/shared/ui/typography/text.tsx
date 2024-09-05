import { cn } from "@/shared/utils/cn"
import { Typography, type TypographyProps } from "."

type TextProps = TypographyProps

export const Text = (props: TextProps) => {
  return (
    <Typography
      {...props}
      className={cn("text-[15px] leading-tight", props.className)}
    />
  )
}
