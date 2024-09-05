import { cn } from "@/shared/utils/cn"
import { Typography, type TypographyProps } from "."

type TitleProps = TypographyProps & {
  level?: 1 | 2 | 3
}

export const Title = (props: TitleProps) => {
  const level = props.level ?? 1

  return (
    <Typography
      {...props}
      className={cn(
        "font-semibold",
        level === 1 && "text-2xl leading-7 tracking-tight",
        level === 2 && "text-xl leading-normal tracking-tight",
        level === 3 && "text-[17px] leading-snug",
        props.className
      )}
    />
  )
}
