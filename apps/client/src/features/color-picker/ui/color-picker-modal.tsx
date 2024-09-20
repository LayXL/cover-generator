import { defaultColors } from "@/features/editor/lib/defaultColors"
import { useCloudStorage } from "@/shared/hooks/useCloudStorage"
import { useProjectStore } from "@/shared/store"
import { cn } from "@/shared/utils/cn"
import {
  Icon20ArchiveOutline,
  Icon20PalleteOutline,
  Icon20SlidersOutline,
} from "@vkontakte/icons"
import { Button, FormItem, SegmentedControl, Separator } from "@vkontakte/vkui"
import { useCallback, useEffect, useMemo, useState } from "react"
import { HexColorPicker } from "react-colorful"
import { useTranslation } from "react-i18next"
import type { hexColor } from "shared/types"
import type { z } from "zod"
import { ColorCard } from "./color-card"
import { ColorInput } from "./color-input"

type ColorPickerModalProps = {
  color?: z.infer<typeof hexColor>
  onChange: (color: z.infer<typeof hexColor>) => void
  withDefaults?: boolean
}

enum ColorPickerTab {
  Picker = "picker",
  History = "history",
  Defaults = "defaults",
}

export const ColorPickerModal = (props: ColorPickerModalProps) => {
  const [{ data: historyColors }, { mutate: mutateHistoryColors }] =
    useCloudStorage("colorHistory", [] as z.infer<typeof hexColor>[])

  const { t } = useTranslation()
  const [tab, setTab] = useState<ColorPickerTab>(ColorPickerTab.Picker)
  const [displayColor, setDisplayColor] = useState(props.color ?? "#000000")

  const addColorToHistory = useCallback(
    (color: z.infer<typeof hexColor>) => {
      mutateHistoryColors(
        historyColors
          ? [...historyColors.filter((c) => c !== color), color].slice(-50)
          : [color]
      )
    },
    [historyColors, mutateHistoryColors]
  )

  const reversedHistoryColors = useMemo(() => {
    if (!historyColors) return []
    return [...historyColors].reverse()
  }, [historyColors])

  const project = useProjectStore((state) => state.project)

  const colorsInTheProject = useMemo(() => {
    const colors: Set<z.infer<typeof hexColor>> = new Set()

    for (const cover of project.covers) {
      if (cover.background.type === "solid") colors.add(cover.background.color)
      if (cover.icon?.color) colors.add(cover.icon.color)
      if (cover.text?.color) colors.add(cover.text.color)
    }

    return new Array(...colors)
  }, [project.covers])

  useEffect(() => {
    setDisplayColor(props.color ?? "#000000")
  }, [props.color])

  return (
    <div className="p-3 flex flex-col gap-3 pt-0">
      <SegmentedControl
        value={tab}
        onChange={(value) => {
          if (value === ColorPickerTab.History && historyColors?.length === 0)
            return

          setTab(value as ColorPickerTab)
        }}
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
            className:
              historyColors?.length === 0
                ? "opacity-30 pointer-events-none"
                : undefined,
          },
          ...(props.withDefaults
            ? [
                {
                  label: t("color-defaults-tab-label"),
                  before: <Icon20ArchiveOutline />,
                  value: "defaults",
                },
              ]
            : []),
        ]}
      />

      <div className="relative">
        <div
          className={cn(
            "flex flex-col gap-3",
            tab !== ColorPickerTab.Picker && "invisible"
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

          {colorsInTheProject.length > 0 && (
            <div className="bg-inversed/5 rounded-xl overflow-scroll flex relative">
              <div className="p-1.5 pr-10 flex gap-1">
                {colorsInTheProject.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className="size-6 rounded-lg"
                    style={{
                      background: color,
                    }}
                    onClick={() => {
                      setDisplayColor(color)
                      props.onChange(color)
                      addColorToHistory(color)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

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

          <Separator className="[&>*]:!mx-0" />

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
          <div className="absolute overflow-scroll inset-0 grid gap-4 content-start grid-cols-[repeat(auto-fill,minmax(96px,1fr))]">
            {reversedHistoryColors.map((color) => (
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

        {tab === ColorPickerTab.Defaults && (
          <div className="absolute overflow-scroll inset-0 grid gap-4 content-start grid-cols-[repeat(auto-fill,minmax(96px,1fr))]">
            {defaultColors.map((color) => (
              <ColorCard
                key={color}
                color={color}
                onClick={() => {
                  setDisplayColor(color)
                  props.onChange(color)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
