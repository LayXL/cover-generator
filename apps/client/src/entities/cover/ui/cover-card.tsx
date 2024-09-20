import { CoverRenderer } from "@/entities/cover/ui/cover-renderer.tsx"
import { useModalState } from "@/shared/hooks/useModalState"
import { Subhead } from "@/shared/ui/typography"
import {
  Icon20More,
  Icon28AddSquareOutline,
  Icon28ArrowDownToSquareOutline,
  Icon28DeleteOutline,
} from "@vkontakte/icons"
import { ActionSheet, ActionSheetItem } from "@vkontakte/vkui"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import type { Cover, DeepPartial } from "shared/types"

type CoverCardProps = {
  index: number
  onClick?: () => void
  isHidden?: boolean
  onDownload?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
} & DeepPartial<Cover>

export const CoverCard = (props: CoverCardProps) => {
  const { t } = useTranslation()

  const toggleRef = useRef<SVGSVGElement>(null)
  const moreModal = useModalState()

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        type="button"
        onClick={props.onClick}
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
          <Icon20More
            ref={toggleRef}
            className="cursor-pointer text-primary/30"
            onClick={(e) => {
              e.stopPropagation()
              moreModal.open()
            }}
          />
        </div>
      </motion.button>
      {moreModal.isOpened && (
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
      )}
    </>
  )
}
