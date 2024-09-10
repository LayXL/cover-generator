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
      <div className="p-1.5 flex flex-col gap-1.5 bg-inversed/5 rounded-xl">
        <Swatch
          color={{ h, s, l }}
          onUpdate={(s, l) => {
            setS(s)
            setL(l)

            console.log(l)

            props.onChange(hslToHex({ h, s, l }))
          }}
        />

        <div
          className="relative h-9 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, red, yellow, green, cyan, blue, purple, red)",
          }}
        >
          <div
            className="h-full aspect-square rounded-full border-2 border-surface -translate-x-1/2"
            style={{
              background: `hsl(${h}, 100%, 50%)`,
              marginLeft: `min(max(${(h / 360) * 100}%, 18px), calc(100% - 18px))`,
            }}
          />
          <input
            className="absolute inset-0 opacity-0"
            type="range"
            min={0}
            max={359}
            value={h}
            onChange={({ target: { value } }) => {
              setH(Number(value))
              props.onChange(hslToHex({ h: Number(value), s, l }))
            }}
          />
        </div>
      </div>

      <Separator />

      <Button size="l" children={t("pick-color-button")} />
    </div>
  )
}
