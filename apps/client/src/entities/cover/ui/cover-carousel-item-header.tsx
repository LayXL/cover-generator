import { useModalState } from "@/shared/hooks/use-modal-state"
import {
  Icon28ArrowUturnLeftOutline,
  Icon28ArrowUturnRightOutline,
  Icon28DeleteOutline,
} from "@vkontakte/icons"
import { Alert, IconButton, Input } from "@vkontakte/vkui"
import { useTranslation } from "react-i18next"

const CAN_UNDO = false

type CoverCarouselItemHeaderProps = {
  title?: string
  onRemove?: () => void
  onChangeTitle?: (title: string) => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
}

export const CoverCarouselItemHeader = (
  props: CoverCarouselItemHeaderProps
) => {
  const { t } = useTranslation()

  const removeConfirmationModal = useModalState()

  return (
    <>
      <div className="flex gap-3 h-[44px] items-center">
        <IconButton
          className="[&>*]:!p-0"
          onClick={removeConfirmationModal.open}
        >
          <Icon28DeleteOutline
            color="currentColor"
            className="text-inversed/30"
          />
        </IconButton>
        <Input
          placeholder={t("untitled-cover-placeholder")}
          value={props.title}
          onChange={({ target: { value } }) =>
            props.onChangeTitle?.(value.slice(0, 32))
          }
        />
        {CAN_UNDO && (
          <div className="flex gap-1.5">
            <IconButton
              className="[&>*]:!p-0"
              onClick={props.onUndo}
              disabled={!props.canUndo}
            >
              <Icon28ArrowUturnLeftOutline
                color="currentColor"
                className="text-inversed/30"
              />
            </IconButton>
            <IconButton
              className="[&>*]:!p-0"
              onClick={props.onRedo}
              disabled={!props.canRedo}
            >
              <Icon28ArrowUturnRightOutline
                color="currentColor"
                className="text-inversed/30"
              />
            </IconButton>
          </div>
        )}
      </div>
      {removeConfirmationModal.isOpened && (
        <Alert
          header={t("confirm-delete-cover-title")}
          text={t("confirm-delete-cover-text")}
          onClose={removeConfirmationModal.close}
          actions={[
            {
              title: t("confirm-delete-cover-action"),
              mode: "destructive",
              action: props.onRemove,
            },
            {
              title: t("cancel-action"),
              mode: "cancel",
            },
          ]}
        />
      )}
    </>
  )
}
