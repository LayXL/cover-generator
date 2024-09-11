import type { hexColor } from "shared/types"
import type { z } from "zod"

type DefaultColorItemProps = {
  onClick?: () => void
  color: z.infer<typeof hexColor>
}

export const DefaultColorItem = (props: DefaultColorItemProps) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="w-12 h-16 rounded-md border border-inversed/10 overflow-hidden"
    >
      <div
        className="size-full"
        style={{
          background: props.color,
        }}
      />
    </button>
  )
}
