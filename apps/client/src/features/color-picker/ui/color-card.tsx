import { Subhead } from "@/shared/ui/typography"
import { Icon24ChevronCompactRight } from "@vkontakte/icons"
import type { hexColor } from "shared/types"
import type { z } from "zod"

type ColorCardProps = {
  color: z.infer<typeof hexColor>
  onClick?: () => void
}

export const ColorCard = (props: ColorCardProps) => {
  return (
    <button
      type="button"
      className="flex flex-col gap-0.5 text-left"
      onClick={props.onClick}
    >
      <div
        className="aspect-[7/5] rounded-xl w-full"
        style={{
          backgroundColor: props.color,
          boxShadow: "inset 0 0 0 1px rgba(var(--ma-theme-text-inversed), 0.1)",
        }}
      />
      <div className="flex w-full items-center">
        <Subhead className="uppercase flex-1" children={props.color} />
        <Icon24ChevronCompactRight className="text-inversed/50" />
      </div>
    </button>
  )
}
