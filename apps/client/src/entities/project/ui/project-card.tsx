import { useModalState } from "@/shared/hooks/useModalState"
import { Header } from "@/shared/ui/header"
import { Modal } from "@/shared/ui/modal"
import { Pressable } from "@/shared/ui/pressable"
import { Headline } from "@/shared/ui/typography"
import {
  Icon20More,
  Icon28DeleteOutline,
  Icon28EditOutline,
} from "@vkontakte/icons"
import {
  ActionSheet,
  ActionSheetItem,
  Alert,
  Button,
  Div,
  FormItem,
  Input,
  Subhead,
} from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

type ProjectCardProps = {
  title?: string | null
  updatedAt: Date
  onClick?: () => void
  onDelete?: () => void
  onDeleteWithConfirm?: () => void
  onRename?: (name: string | null) => void
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { t } = useTranslation()

  const moreButtonRef = useRef<HTMLDivElement>(null)
  const moreModal = useModalState()

  const renameProjectModal = useModalState()
  const deleteConfirmModal = useModalState()

  const [title, setTitle] = useState(props.title)

  useEffect(() => {
    setTitle(props.title)
  }, [props.title])

  return (
    <>
      <Pressable onPress={props.onClick} onLongPress={moreModal.open}>
        <div className="flex flex-col gap-1">
          <div className="bg-surface rounded-lg aspect-[4/3]" />
          <div className="flex">
            <div className="flex-1 flex flex-col">
              <Headline
                className="line-clamp-1"
                children={props.title ?? t("untitled-project-placeholder")}
              />
              <Subhead
                className="text-primary/30"
                children={DateTime.fromJSDate(props.updatedAt).toRelative()}
              />
            </div>
            <span className="relative">
              <Icon20More className="text-inversed/30" />
              <div
                ref={moreButtonRef}
                className="absolute right-0 -inset-2"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  moreModal.open()
                }}
              />
            </span>
          </div>
        </div>
      </Pressable>

      {moreModal.isOpened && (
        <ActionSheet
          toggleRef={moreButtonRef}
          onClose={moreModal.close}
          className="z-10"
        >
          {props.onRename && (
            <ActionSheetItem
              before={<Icon28EditOutline />}
              children={t("edit-project-name-button")}
              onClick={renameProjectModal.open}
            />
          )}
          {props.onDeleteWithConfirm && (
            <ActionSheetItem
              mode="destructive"
              before={<Icon28DeleteOutline />}
              children={t("delete-project-button")}
              onClick={deleteConfirmModal.open}
            />
          )}
          {props.onDelete && (
            <ActionSheetItem
              mode="destructive"
              before={<Icon28DeleteOutline />}
              children={t("delete-project-button")}
              onClick={props.onDelete}
            />
          )}
        </ActionSheet>
      )}

      {deleteConfirmModal.isOpened && (
        <Alert
          header={t("confirm-delete-project-title")}
          text={t("confirm-delete-project-text")}
          onClose={deleteConfirmModal.close}
          actions={[
            {
              title: t("confirm-delete-project-action"),
              mode: "destructive",
              action: props.onDeleteWithConfirm,
            },
            {
              title: t("cancel-action"),
              mode: "cancel",
            },
          ]}
        />
      )}

      <Modal {...renameProjectModal}>
        <Header title={t("rename-project-title")} />

        <FormItem top={t("new-project-name-label")}>
          <Input
            placeholder={t("untitled-project-placeholder")}
            value={title ?? ""}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormItem>

        <Div>
          <Button
            size="l"
            stretched
            onClick={() => {
              props.onRename?.(title && title?.length > 0 ? title : null)
              renameProjectModal.close()
            }}
            children={t("save-action")}
          />
        </Div>
      </Modal>
    </>
  )
}
