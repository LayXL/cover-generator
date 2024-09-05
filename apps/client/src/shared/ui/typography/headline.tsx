import { cn } from "@/shared/utils/cn"
import { Typography, type TypographyProps } from "."

type HeadlineProps = TypographyProps

export const Headline = (props: HeadlineProps) => {
  return (
    <Typography
      {...props}
      className={cn("text-base font-normal leading-tight", props.className)}
    />
  )
}
