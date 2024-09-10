import { hexToHsl, hslToHex } from "@/shared/utils/rgbToHsl"
import { Button, Separator } from "@vkontakte/vkui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { hexColor } from "shared/types"
import type { z } from "zod"
import { Swatch } from "./swatch"

type ColorPickerModalProps = {
  color?: z.infer<typeof hexColor>
  onChange: (color: z.infer<typeof hexColor>) => void
}

export const ColorPickerModal = (props: ColorPickerModalProps) => {
  const { t } = useTranslation()

  const color = hexToHsl(props.color ?? "#FFFFFF")

  const [h, setH] = useState(color.h)
  const [s, setS] = useState(color.s)
  const [l, setL] = useState(color.l)

  return (
    <div className="p-3 flex flex-col gap-3">
      <input
        type="range"
        min="0"
        max="360"
        value={h}
        onChange={({ target: { value } }) => {
          setH(Number(value))
          props.onChange(hslToHex({ h: Number(value), s, l }))
        }}
        style={{ width: "100%" }}
      />

      <Swatch
        color={{ h, s, l }}
        onUpdate={(s, l) => {
          setS(s)
          setL(l)

          props.onChange(hslToHex({ h, s, l }))
        }}
      />

      <div
        className="size-12"
        style={{
          backgroundColor: props.color,
        }}
      />

      <Separator />

      <Button children={t("pick-color-button")} />
    </div>
  )
}
