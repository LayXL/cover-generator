import { ColorPickerModal } from "@/features/color-picker/ui/color-picker-modal"
import type { SelectedItems } from "@/features/toolbar/lib/useToolbar"
import { ToolbarRoot } from "@/features/toolbar/ui/toolbar-root"
import type { ToolbarTabData } from "@/features/toolbar/ui/toolbar-tab"
import { useModalState } from "@/shared/hooks/useModalState"
import { Modal } from "@/shared/ui/modal"
import { CUBIC_BEZIER } from "@/shared/utils/animations"
import {
  Icon28LogoVkOutline,
  Icon28PaintRollerOutline,
  Icon28PictureOutline,
  Icon28TextOutline,
} from "@vkontakte/icons"
import { Input } from "@vkontakte/vkui"
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
              icon: <Icon28PaintRollerOutline />,
              onSelect: (toolbar) => toolbar.pushAndMark("gradient"),
            },
            {
              name: "fill",
              title: t("fill-tab-title"),
              icon: <Icon28PaintRollerOutline />,
              onSelect: () => {
                fillSolidColorModal.open()
              },
            },
            {
              name: "image",
              title: t("image-tab-title"),
              icon: <Icon28PaintRollerOutline />,
            },
          ],
        },
        {
          name: "gradient",
          items: [
            {
              name: "template",
              title: "Template",
            },
            {
              name: "linear",
              title: "Linear",
            },
            {
              name: "radial",
              title: "Radial",
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
                  transition={{
                    ease: CUBIC_BEZIER,
                  }}
                >
                  <Input
                    placeholder="Text"
                    value={currentCover?.text?.value ?? ""}
                    onChange={({ target: { value } }) => {
                      updateCurrentCover({
                        text: {
                          value,
                        },
                      })
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
      />

      <Modal {...fillSolidColorModal}>
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
