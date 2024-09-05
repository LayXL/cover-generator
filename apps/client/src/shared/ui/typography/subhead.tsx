import { cn } from "@/shared/utils/cn"
import { Typography, type TypographyProps } from "."

type SubheadProps = TypographyProps

export const Subhead = (props: SubheadProps) => {
  return (
    <Typography
      {...props}
      className={cn("text-sm font-normal leading-[18px]", props.className)}
    />
  )
}
