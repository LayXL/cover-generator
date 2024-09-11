import type { hexColor } from "shared/types"
import type { z } from "zod"
import { defaultColors } from "../lib/defaultColors"
import { DefaultColorItem } from "./default-color-item"

type DefaultColorsPickerProps = {
  onChoose?: (gradient: z.infer<typeof hexColor>) => void
}

export const DefaultColorsPicker = (props: DefaultColorsPickerProps) => {
  return (
    <div className="py-3 border-b border-b-inversed/15">
      <div className={"overflow-scroll overscroll-contain"}>
        <div className="flex w-fit gap-2 px-3">
          {defaultColors.map((color) => (
            <DefaultColorItem
              key={color}
              color={color}
              onClick={() => props.onChoose?.(color)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
