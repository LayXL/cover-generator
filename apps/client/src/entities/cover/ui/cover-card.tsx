import { CoverRenderer } from "@/entities/cover/ui/cover-renderer.tsx"
import { useModalState } from "@/shared/hooks/use-modal-state"
import type { Style } from "@/shared/store"
import { Header } from "@/shared/ui/header"
import { Modal } from "@/shared/ui/modal"
import { Pressable } from "@/shared/ui/pressable"
import { Subhead } from "@/shared/ui/typography"
import { FloatingPortal } from "@floating-ui/react"
import {
  Icon20More,
  Icon28AddSquareOutline,
  Icon28ArrowDownToSquareOutline,
  Icon28ArrowPopDownOutline,
  Icon28ArrowPopUpOutline,
  Icon28DeleteOutline,
} from "@vkontakte/icons"
import {
  ActionSheet,
  ActionSheetItem,
  Button,
  Checkbox,
  Div,
} from "@vkontakte/vkui"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { Cover, DeepPartial } from "shared/types"

type CoverCardProps = {
  index: number
  onClick?: () => void
  isHidden?: boolean
  onDownload?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onCopyStyles?: (styles: Style[]) => void
  onPasteStyles?: () => void
} & DeepPartial<Cover>

export const CoverCard = (props: CoverCardProps) => {
  const { t } = useTranslation()

  const toggleRef = useRef<HTMLDivElement>(null)
  const moreModal = useModalState()

  const copyStylesModal = useModalState()
  const [copiedStyles, setCopiedStyles] = useState<(Style | (string & {}))[]>([
    "background",
    "icon",
    "text",
  ])

  return (
    <>
      <Pressable
        onPress={props.onClick}
        onLongPress={moreModal.open}
        className="flex flex-col gap-1"
      >
        <div
          id={`cover-${props.index}`}
          className="rounded-lg overflow-hidden cursor-pointer"
          style={{ visibility: props.isHidden ? "hidden" : undefined }}
        >
          <CoverRenderer {...props} />
        </div>
        <div className="flex items-center w-full">
          <Subhead
            className={"text-primary/30 flex-1 line-clamp-1"}
            children={props.title ?? t("untitled-cover-placeholder")}
          />
          <div ref={toggleRef}>
            <Icon20More
              className="cursor-pointer text-primary/30"
              onMouseDown={(e) => {
                e.stopPropagation()
                moreModal.open()
              }}
            />
          </div>
        </div>
      </Pressable>
      <Modal {...copyStylesModal}>
        <Header title={t("copy-cover-styles-title")} />
        {["text", "background", "icon"].map((style) => (
          <Checkbox
            key={style}
            children={t(`copy-cover-styles-${style}-label`)}
            checked={copiedStyles.includes(style)}
            onChange={() => {
              setCopiedStyles(
                copiedStyles.includes(style)
                  ? copiedStyles.filter((s) => s !== style)
                  : [...copiedStyles, style]
              )
            }}
          />
        ))}
        <Div>
          <Button
            stretched
            size="l"
            children={t("copy-cover-styles-button")}
            onClick={() => {
              copyStylesModal.close()
              props.onCopyStyles?.(copiedStyles as Style[])
            }}
          />
        </Div>
      </Modal>
      {moreModal.isOpened && (
        <FloatingPortal id={"editor"}>
          <ActionSheet
            className="z-50"
            onClose={() => moreModal.close()}
            toggleRef={toggleRef}
          >
            {props.onDownload && (
              <ActionSheetItem
                before={<Icon28ArrowDownToSquareOutline />}
                children={t("download-cover-button")}
                onClick={props.onDownload}
              />
            )}
            {props.onCopyStyles && (
              <ActionSheetItem
                before={<Icon28ArrowPopUpOutline />}
                children={t("copy-cover-styles-button")}
                onClick={copyStylesModal.open}
              />
            )}
            {props.onPasteStyles && (
              <ActionSheetItem
                before={<Icon28ArrowPopDownOutline />}
                children={t("paste-cover-styles-button")}
                onClick={props.onPasteStyles}
              />
            )}
            {props.onDuplicate && (
              <ActionSheetItem
                before={<Icon28AddSquareOutline />}
                children={t("duplicate-cover-button")}
                onClick={props.onDuplicate}
              />
            )}
            {props.onDelete && (
              <ActionSheetItem
                mode="destructive"
                before={<Icon28DeleteOutline />}
                children={t("remove-cover-button")}
                onClick={props.onDelete}
              />
            )}
          </ActionSheet>
        </FloatingPortal>
      )}
    </>
  )
}
