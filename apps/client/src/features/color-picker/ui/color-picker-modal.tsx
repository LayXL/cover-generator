import { useCloudStorage } from "@/shared/hooks/useCloudStorage"
import { cn } from "@/shared/utils/cn"
import { Icon20PalleteOutline, Icon20SlidersOutline } from "@vkontakte/icons"
import { Button, FormItem, SegmentedControl, Separator } from "@vkontakte/vkui"
import { useCallback, useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"
import { useTranslation } from "react-i18next"
import type { hexColor } from "shared/types"
import type { z } from "zod"
import { ColorCard } from "./color-card"
import { ColorInput } from "./color-input"

type ColorPickerModalProps = {
  color?: z.infer<typeof hexColor>
  onChange: (color: z.infer<typeof hexColor>) => void
}

enum ColorPickerTab {
  Picker = "picker",
  History = "history",
}

export const ColorPickerModal = (props: ColorPickerModalProps) => {
  const [{ data: historyColors }, { mutate: mutateHistoryColors }] =
    useCloudStorage("colorHistory", [] as z.infer<typeof hexColor>[])

  const { t } = useTranslation()
  const [tab, setTab] = useState<ColorPickerTab>(ColorPickerTab.Picker)
  const [displayColor, setDisplayColor] = useState(props.color)

  const addColorToHistory = useCallback(
    (color: z.infer<typeof hexColor>) => {
      mutateHistoryColors(historyColors ? [...historyColors, color] : [color])
    },
    [historyColors, mutateHistoryColors]
  )

  useEffect(() => {
    setDisplayColor(props.color)
  }, [props.color])

  return (
    <div className="p-3 flex flex-col gap-3">
      <SegmentedControl
        value={tab}
        onChange={(value) => setTab(value as ColorPickerTab)}
        options={[
          {
            label: t("color-picker-tab-label"),
            before: <Icon20SlidersOutline />,
            value: "picker",
          },
          {
            label: t("color-history-tab-label"),
            before: <Icon20PalleteOutline />,
            value: "history",
          },
        ]}
      />

      <div className="relative">
        <div
          className={cn(
            "flex flex-col gap-3",
            tab === ColorPickerTab.History && "invisible"
          )}
        >
          <div className="p-1.5 bg-inversed/5 rounded-xl">
            <HexColorPicker
              color={displayColor}
              onChange={(color) =>
                setDisplayColor(color as z.infer<typeof hexColor>)
              }
              className={cn(
                "!w-full !h-auto",
                "[&>div:first-child]:aspect-square [&>div:first-child]:rounded-md",
                "[&>div:last-child]:rounded-md [&>div:last-child]:mt-1.5"
              )}
            />
          </div>

          <div className="flex w-full gap-3 items-center">
            <div
              className="aspect-square h-full w-[72px] rounded-xl"
              style={{
                background: displayColor,
              }}
            />
            <div className="flex-1">
              <FormItem top={t("color-input-label")} className="!p-0">
                <ColorInput
                  value={displayColor}
                  onChange={(color) => setDisplayColor(color)}
                />
              </FormItem>
            </div>
          </div>

          <Separator />

          <Button
            size="l"
            children={t("pick-color-button")}
            onClick={() => {
              if (!displayColor) return
              props.onChange(displayColor)
              addColorToHistory(displayColor)
            }}
          />
        </div>

        {tab === ColorPickerTab.History && (
          <div className="absolute inset-0 grid gap-4 grid-cols-[repeat(auto-fill,minmax(96px,1fr))]">
            {historyColors?.map((color) => (
              <ColorCard
                key={color}
                color={color}
                onClick={() => {
                  setTab(ColorPickerTab.Picker)
                  setDisplayColor(color)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
