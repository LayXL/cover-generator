import { cn } from "@/shared/utils/cn"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

export type TypographyProps = {
  className?: string
} & (
  | {
      i18nKey: string
      i18nOptions: Parameters<ReturnType<typeof useTranslation>["t"]>[2]
    }
  | {
      children: ReactNode
    }
)
export const Typography = (props: TypographyProps) => {
  const { t } = useTranslation()

  const children =
    "children" in props ? props.children : t(props.i18nKey, props.i18nOptions)

  return <p className={cn(props.className)}>{children}</p>
}

export { Caption } from "./caption"
export { Headline } from "./headline"
export { Subhead } from "./subhead"
export { Text } from "./text"
export { Title } from "./title"
