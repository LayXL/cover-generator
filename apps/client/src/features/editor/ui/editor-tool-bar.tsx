import { ColorPickerModal } from "@/features/color-picker/ui/color-picker-modal"
import type { SelectedItems } from "@/features/toolbar/lib/useToolbar"
import { ToolbarRoot } from "@/features/toolbar/ui/toolbar-root"
import type { ToolbarTabData } from "@/features/toolbar/ui/toolbar-tab"
import { useModalState } from "@/shared/hooks/useModalState"
import { Modal } from "@/shared/ui/modal"
import { CUBIC_BEZIER } from "@/shared/utils/animations"
import {
  Icon16Clear,
  Icon24GradientOutline,
  Icon24TextTtOutline,
  Icon28ArchiveCheckOutline,
  Icon28ArrowRightSquareOutline,
  Icon28CheckCircleOff,
  Icon28FullscreenOutline,
  Icon28LogoVkOutline,
  Icon28PaintRollerOutline,
  Icon28PaletteOutline,
  Icon28PictureOutline,
  Icon28TextOutline,
} from "@vkontakte/icons"
import { IconButton, Input } from "@vkontakte/vkui"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useCurrentCover } from "../lib/useCurrentCover"
import { DefaultGradientsPicker } from "./default-gradients-picker"
import { LinearGradientAdjuster } from "./linear-gradient-adjuster"
import { RadialGradientAdjuster } from "./radial-gradient-adjuster"

export const EditorToolBar = () => {
  const { t } = useTranslation()

  const [currentCover, updateCurrentCover] = useCurrentCover()
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    root: "background",
  })

  const fillSolidColorModal = useModalState()

  const tabs = useMemo(
    () =>
      [
        {
          name: "root",
          items: [
            {
              name: "background",
              title: t("background-tab-title"),
              icon: <Icon28PictureOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("background"),
            },
            {
              name: "text",
              title: t("text-tab-title"),
              icon: <Icon24TextTtOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("text"),
            },
            {
              name: "icon",
              title: t("icon-tab-title"),
              icon: <Icon28LogoVkOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("icon"),
            },
          ],
        },
        {
          name: "background",
          items: [
            {
              name: "fill",
              title: t("fill-tab-title"),
              icon: <Icon28PaintRollerOutline />,
              onSelect: () => {
                fillSolidColorModal.open()
              },
            },
            {
              name: "gradient",
              title: t("gradient-tab-title"),
              icon: <Icon24GradientOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("gradient"),
            },
            {
              name: "image",
              title: t("image-tab-title"),
              icon: <Icon28PictureOutline />,
            },
          ],
        },
        {
          name: "gradient",
          items: [
            {
              name: "defaultGradients",
              icon: <Icon28ArchiveCheckOutline />,
              title: t("default-gradients-tab-title"),
              onSelect: () => {
                setSelectedItems((prev) => ({
                  ...prev,
                  gradient:
                    prev.gradient === "defaultGradients"
                      ? null
                      : "defaultGradients",
                }))
              },
            },
            {
              name: "linear",
              icon: <Icon28ArrowRightSquareOutline />,
              title: t("linear-gradient-tab-title"),
              onSelect: () => {
                setSelectedItems((prev) => ({
                  ...prev,
                  gradient: prev.gradient === "linear" ? null : "linear",
                }))

                updateCurrentCover({
                  background: {
                    type: "gradient",
                    style: "linear",
                    colors:
                      currentCover?.background.type === "gradient" &&
                      currentCover?.background?.colors?.length > 0
                        ? currentCover?.background.colors
                        : // TODO: make default gradient
                          ["#000000", "#ffffff"],
                  },
                })
              },
            },
            {
              name: "radial",
              icon: <Icon28CheckCircleOff />,
              title: t("radial-gradient-tab-title"),
              onSelect: () => {
                setSelectedItems((prev) => ({
                  ...prev,
                  gradient: prev.gradient === "radial" ? null : "radial",
                }))

                updateCurrentCover({
                  background: {
                    type: "gradient",
                    style: "radial",
                    colors:
                      currentCover?.background.type === "gradient" &&
                      currentCover?.background?.colors?.length > 0
                        ? currentCover?.background.colors
                        : // TODO: make default gradient
                          ["#000000", "#ffffff"],
                  },
                })
              },
            },
          ],
        },
        {
          name: "text",
          items: [
            {
              name: "font",
              title: "Font",
              icon: <Icon28TextOutline />,
            },
            {
              name: "size",
              title: "Size",
              icon: <Icon28FullscreenOutline />,
            },
            {
              name: "color",
              title: "Color",
              icon: <Icon28PaletteOutline />,
            },
          ],
        },
        {
          name: "icon",
          items: [
            {
              name: "size",
              title: "Size",
              icon: <Icon28FullscreenOutline />,
            },
            {
              name: "color",
              title: "Color",
              icon: <Icon28PaletteOutline />,
            },
          ],
        },
      ] as ToolbarTabData[],
    [t, fillSolidColorModal, updateCurrentCover, currentCover]
  )

  const isGradientTabOpened =
    selectedItems.root === "background" &&
    selectedItems.background === "gradient"

  return (
    <>
      <ToolbarRoot
        tabs={tabs}
        overrideCurrentTab="background"
        overrideTabHistory={["root"]}
        overrideSelectedItems={{ root: "background" }}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        before={
          <AnimatePresence>
            {selectedItems.root === "text" && (
              <motion.div
                className="px-3"
                initial={{ scale: 0, opacity: 50 }}
                animate={{ scale: 1, opacity: 100 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ ease: CUBIC_BEZIER }}
              >
                <Input
                  placeholder={t("cover-text-input-placeholder")}
                  value={currentCover?.text?.value ?? ""}
                  onChange={({ target: { value } }) => {
                    updateCurrentCover({ text: { value } })
                  }}
                  after={
                    currentCover?.text?.value?.length !== 0 && (
                      <IconButton
                        hoverMode="opacity"
                        label={t("clear-text-button")}
                        onClick={() =>
                          updateCurrentCover({
                            text: { value: "" },
                          })
                        }
                      >
                        <Icon16Clear />
                      </IconButton>
                    )
                  }
                />
              </motion.div>
            )}

            {isGradientTabOpened &&
              selectedItems.gradient === "defaultGradients" && (
                <DefaultGradientsPicker
                  onRemove={() => {
                    updateCurrentCover({
                      background: {
                        type: "solid",
                        color: "#fff",
                      },
                    })
                  }}
                  onChoose={(gradient) => {
                    updateCurrentCover({
                      background: {
                        type: "gradient",
                        colors: gradient,
                      },
                    })
                  }}
                />
              )}

            {isGradientTabOpened && selectedItems.gradient === "linear" && (
              <LinearGradientAdjuster
                angle={
                  currentCover && "angle" in currentCover.background
                    ? currentCover?.background.angle
                    : undefined
                }
                colors={
                  currentCover && "colors" in currentCover.background
                    ? currentCover?.background.colors
                    : undefined
                }
                onChange={({ angle, colors }) => {
                  updateCurrentCover({
                    background: {
                      type: "gradient",
                      style: "linear",
                      angle,
                      colors,
                    },
                  })
                }}
              />
            )}

            {isGradientTabOpened && selectedItems.gradient === "radial" && (
              <RadialGradientAdjuster
                radius={
                  currentCover && "radius" in currentCover.background
                    ? currentCover?.background.radius
                    : undefined
                }
                colors={
                  currentCover && "colors" in currentCover.background
                    ? currentCover?.background.colors
                    : undefined
                }
                onChange={({ radius, colors }) => {
                  updateCurrentCover({
                    background: {
                      type: "gradient",
                      style: "radial",
                      radius,
                      colors,
                    },
                  })
                }}
              />
            )}
          </AnimatePresence>
        }
      />

      <Modal withoutTint {...fillSolidColorModal}>
        <ColorPickerModal
          color={
            currentCover && "color" in currentCover.background
              ? currentCover.background.color
              : undefined
          }
          onChange={(color) => {
            updateCurrentCover({
              ...currentCover,
              background: {
                type: "solid",
                color,
              },
            })
          }}
        />
      </Modal>
    </>
  )
}
