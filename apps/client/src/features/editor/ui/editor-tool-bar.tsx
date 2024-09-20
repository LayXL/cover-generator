import { ColorPickerModal } from "@/features/color-picker/ui/color-picker-modal"
import { IconPicker } from "@/features/icon/ui/icon-picker"
import type { SelectedItems } from "@/features/toolbar/lib/useToolbar"
import { ToolbarRoot } from "@/features/toolbar/ui/toolbar-root"
import type { ToolbarTabData } from "@/features/toolbar/ui/toolbar-tab"
import { useImageUpload } from "@/shared/hooks/useImageUpload"
import { useModalState } from "@/shared/hooks/useModalState"
import { Header } from "@/shared/ui/header"
import { Modal } from "@/shared/ui/modal"
import { CUBIC_BEZIER } from "@/shared/utils/animations"
import {
  Icon16Clear,
  Icon24Dismiss,
  Icon24GradientOutline,
  Icon24TextTtOutline,
  Icon28ArchiveCheckOutline,
  Icon28ArrowRightSquareOutline,
  Icon28BracketsSquareOutline,
  Icon28CheckCircleOff,
  Icon28FavoriteOutline,
  Icon28FullscreenOutline,
  Icon28LogoVkOutline,
  Icon28PaintRollerOutline,
  Icon28PaletteOutline,
  Icon28PictureOutline,
  Icon28SmileOutline,
  Icon28TextOutline,
  Icon28UploadOutline,
  Icon28VideoFillOutline,
  Icon28WaterDropOutline,
} from "@vkontakte/icons"
import {
  File,
  FormItem,
  IconButton,
  Input,
  Placeholder,
  Slider,
} from "@vkontakte/vkui"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useCurrentCover } from "../lib/useCurrentCover"
import { DefaultColorsPicker } from "./default-colors-picker"
import { DefaultGradientsPicker } from "./default-gradients-picker"
import { LinearGradientAdjuster } from "./linear-gradient-adjuster"
import { RadialGradientAdjuster } from "./radial-gradient-adjuster"

export const EditorToolBar = () => {
  const { t } = useTranslation()

  const [currentCover, updateCurrentCover] = useCurrentCover()
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    root: "background",
    icon: "emoji",
  })

  const imageUpload = useImageUpload({
    onSuccess: ({ data }) => {
      updateCurrentCover({
        background: {
          type: "image",
          uuid: data?.uuid,
        },
      })
    },
  })

  const fillSolidColorModal = useModalState()
  const iconColorModal = useModalState()

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
              icon: <Icon28WaterDropOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("backgroundFill"),
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
              onSelect: (toolbar) => toolbar.pushAndMark("backgroundImage"),
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
          name: "backgroundFill",
          items: [
            {
              name: "defaultBackgroundFills",
              title: t("default-backgrounds-fills-tab-title"),
              icon: <Icon28ArchiveCheckOutline />,
              onSelect: () => {
                setSelectedItems((prev) => ({
                  ...prev,
                  backgroundFill:
                    prev.backgroundFill === "defaultBackgroundFills"
                      ? null
                      : "defaultBackgroundFills",
                }))
              },
            },
            {
              name: "colorPicker",
              title: t("color-picker-tab-title"),
              icon: <Icon28PaletteOutline />,
              onSelect: () => fillSolidColorModal.open(),
            },
          ],
        },
        {
          name: "backgroundImage",
          items: [
            {
              name: "backgroundImageStretch",
              title: t("background-image-stretch-title"),
              icon: <Icon28BracketsSquareOutline />,
              onSelect: () => {
                updateCurrentCover({
                  background: { type: "image", style: "stretch" },
                })
              },
            },
            {
              name: "backgroundImageCover",
              title: t("background-image-cover-title"),
              icon: <Icon28VideoFillOutline />,
              onSelect: () => {
                updateCurrentCover({
                  background: { type: "image", style: "cover" },
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
              title: t("font-family-tab-title"),
              icon: <Icon28TextOutline />,
            },
            {
              name: "size",
              title: t("font-size-tab-title"),
              icon: <Icon28FullscreenOutline />,
            },
            {
              name: "color",
              title: t("color-tab-title"),
              icon: <Icon28PaletteOutline />,
            },
          ],
        },
        {
          name: "icon",
          items: [
            {
              name: "icons",
              title: t("icons-tab-title"),
              icon: <Icon28FavoriteOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("icons"),
            },
            {
              name: "color",
              title: t("color-tab-title"),
              icon: <Icon28PaletteOutline />,
              onSelect: () => iconColorModal.open(),
            },
          ],
        },
        {
          name: "icons",
          items: [
            {
              name: "emoji",
              title: t("emoji-icons-tab-title"),
              icon: <Icon28SmileOutline />,
            },
            {
              name: "fill",
              title: t("fill-icons-tab-title"),
              icon: <Icon28PaintRollerOutline />,
            },
            {
              name: "stroke",
              title: t("stroke-icons-tab-title"),
              icon: <Icon28CheckCircleOff />,
            },
          ],
        },
      ] as ToolbarTabData[],
    [t, fillSolidColorModal, updateCurrentCover, currentCover, iconColorModal]
  )

  const isGradientTabOpened =
    selectedItems.root === "background" &&
    selectedItems.background === "gradient"

  const isBackgroundFillTabOpened =
    selectedItems.root === "background" && selectedItems.background === "fill"

  const isBackgroundImageTabOpened =
    selectedItems.root === "background" && selectedItems.background === "image"

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
          <>
            {selectedItems.root === "text" && (
              <motion.div
                className="px-3"
                initial={{ scale: 0, opacity: 50 }}
                animate={{ scale: 1, opacity: 100 }}
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

            {isBackgroundFillTabOpened &&
              selectedItems.backgroundFill === "defaultBackgroundFills" && (
                <DefaultColorsPicker
                  onChoose={(color) => {
                    updateCurrentCover({
                      background: {
                        type: "solid",
                        color,
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

            {isBackgroundImageTabOpened && (
              <Placeholder
                className="!py-0 !pb-4"
                header={t("background-image-placeholder")}
                children={t("background-image-placeholder.caption")}
                action={
                  <File
                    accept="image/jpeg,image/png,image/webp"
                    before={<Icon28UploadOutline />}
                    children={t("choose-image-button")}
                    size="m"
                    onChange={({ target: { files } }) => {
                      imageUpload.mutate({ file: files?.[0] })
                    }}
                  />
                }
              />
            )}

            {selectedItems.root === "icon" &&
              selectedItems.icon === "icons" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <FormItem top={t("icon-size-slider-caption")}>
                    <Slider
                      min={16}
                      max={128}
                      step={1}
                      value={currentCover?.icon?.size}
                      onChange={(size) => {
                        updateCurrentCover({ icon: { size } })
                      }}
                    />
                  </FormItem>
                  <IconPicker
                    name={currentCover?.icon?.name}
                    onSelect={(icon) => {
                      updateCurrentCover({
                        icon: {
                          category: "fill",
                          name: icon ?? undefined,
                        },
                      })
                    }}
                  />
                </motion.div>
              )}
          </>
        }
      />

      <Modal {...fillSolidColorModal}>
        <Header
          title={t("fill-solid-color-modal-title")}
          after={
            <div className="pr-4">
              <Icon24Dismiss
                className="cursor-pointer"
                onClick={fillSolidColorModal.close}
              />
            </div>
          }
        />
        <ColorPickerModal
          color={
            currentCover && "color" in currentCover.background
              ? currentCover.background.color
              : undefined
          }
          onChange={(color) => {
            fillSolidColorModal.close()
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

      <Modal {...iconColorModal}>
        <Header
          title={t("icon-color-modal-title")}
          after={
            <div className="pr-4">
              <Icon24Dismiss
                className="cursor-pointer"
                onClick={iconColorModal.close}
              />
            </div>
          }
        />
        <ColorPickerModal
          withDefaults
          color={
            currentCover?.icon &&
            "color" in currentCover.icon &&
            currentCover.icon.color
              ? currentCover.icon.color
              : undefined
          }
          onChange={(color) => {
            iconColorModal.close()
            updateCurrentCover({ ...currentCover, icon: { color } })
          }}
        />
      </Modal>
    </>
  )
}
