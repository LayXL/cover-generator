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
  Icon28ArchiveCheckOutline,
  Icon28ArrowRightSquareOutline,
  Icon28CheckCircleOff,
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

export const EditorToolBar = () => {
  const { t } = useTranslation()

  const [currentCover, updateCurrentCover] = useCurrentCover()
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({})

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
              icon: <Icon28TextOutline />,
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
              name: "gradient",
              title: t("gradient-tab-title"),
              icon: <Icon24GradientOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("gradient"),
            },
            {
              name: "fill",
              title: t("fill-tab-title"),
              icon: <Icon28PaletteOutline />,
              onSelect: () => {
                fillSolidColorModal.open()
              },
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
            },
            {
              name: "linear",
              icon: <Icon28ArrowRightSquareOutline />,
              title: t("linear-gradient-tab-title"),
            },
            {
              name: "radial",
              icon: <Icon28CheckCircleOff />,
              title: t("radial-gradient-tab-title"),
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
              icon: <Icon28PaintRollerOutline />,
            },
            {
              name: "color",
              title: "Color",
              icon: <Icon28PaintRollerOutline />,
            },
          ],
        },
        {
          name: "icon",
          items: [
            {
              name: "size",
              title: "Size",
              icon: <Icon28PaintRollerOutline />,
            },
            {
              name: "color",
              title: "Color",
              icon: <Icon28PaintRollerOutline />,
            },
          ],
        },
      ] as ToolbarTabData[],
    [t, fillSolidColorModal]
  )

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
          <div className="px-3">
            <AnimatePresence>
              {selectedItems.root === "text" && (
                <motion.div
                  initial={{ scale: 0, opacity: 50 }}
                  animate={{ scale: 1, opacity: 100 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ ease: CUBIC_BEZIER }}
                >
                  <Input
                    placeholder="Text"
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
            </AnimatePresence>
          </div>
        }
      />

      <Modal
        withoutTint
        {...fillSolidColorModal}
        // className="h-40 box-content"
      >
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
