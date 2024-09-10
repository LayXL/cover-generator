import { Button, FormItem, Separator } from "@vkontakte/vkui"
import { HexColorPicker } from "react-colorful"
import { useTranslation } from "react-i18next"
import type { hexColor } from "shared/types"
import type { z } from "zod"
import { ColorInput } from "./color-input"

type ColorPickerModalProps = {
  color?: z.infer<typeof hexColor>
  onChange: (color: z.infer<typeof hexColor>) => void
}

export const ColorPickerModal = (props: ColorPickerModalProps) => {
  const { t } = useTranslation()

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="p-1.5 bg-inversed/5 rounded-xl">
        <HexColorPicker
          color={props.color}
          onChange={(color) =>
            props.onChange(color as z.infer<typeof hexColor>)
          }
          className="!w-full !h-auto [&>div:first-child]:aspect-square"
        />
      </div>

      <div className="flex w-full gap-3 items-center">
        <div
          className="aspect-square h-full w-[72px] rounded-xl"
          style={{
            background: props.color,
          }}
        />
        <div className="flex-1">
          <FormItem top={t("color-input-label")} className="!p-0">
            <ColorInput
              value={props.color}
              onChange={(color) => props.onChange(color)}
            />
          </FormItem>
        </div>
      </div>

      <Separator />

      <Button size="l" children={t("pick-color-button")} />
    </div>
  )
}
