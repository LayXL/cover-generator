import { downloadCover } from "@/entities/cover/lib/downloadCover"
import { downloadCovers } from "@/entities/cover/lib/downloadCovers"
import { CoverCard } from "@/entities/cover/ui/cover-card.tsx"
import { CoverCarousel } from "@/entities/cover/ui/cover-carousel"
import { CoverRenderer } from "@/entities/cover/ui/cover-renderer"
import { useCurrentCover } from "@/features/editor/lib/useCurrentCover"
import { EditorToolBar } from "@/features/editor/ui/editor-tool-bar"
import { useCoverStore, useProjectStore } from "@/shared/store"
import { BackButton } from "@/shared/ui/back-button"
import { Header } from "@/shared/ui/header"
import { Title } from "@/shared/ui/typography"
import { cn } from "@/shared/utils/cn"
import { trpc } from "@/shared/utils/trpc"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { skipToken } from "@tanstack/react-query"
import {
  Icon20FollowersOutline,
  Icon20GlobeOutline,
  Icon20HelpOutline,
  Icon20Info,
  Icon24Add,
  Icon24AddOutline,
  Icon24DownloadOutline,
  Icon24HideOutline,
  Icon24LinkCircle,
  Icon24MessageOutline,
  Icon24ViewOutline,
  Icon56FragmentsOutline,
} from "@vkontakte/icons"
import {
  Button,
  ButtonGroup,
  IconButton,
  Link,
  MiniInfoCell,
  Placeholder,
  UsersStack,
} from "@vkontakte/vkui"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useDebounceValue } from "usehooks-ts"

enum Trans {
  GRID = 0,
  TO_EDITOR = 1,
  EDITOR = 2,
  TO_GRID = 3,
}

export default function Editor() {
  const { t } = useTranslation()
  const utils = trpc.useUtils()

  const { id: projectId } = useParams()
  const cloudProject = trpc.project.getOne.useQuery(
    !projectId ? skipToken : { id: Number.parseInt(projectId) }
  )

  const {
    currentProject,
    addCover,
    deleteCover,
    updateProject,
    copy,
    paste,
    undo,
    redo,
    canUndo,
    canRedo,
    canPaste,
  } = useProjectStore((state) => ({
    currentProject: state.project,
    addCover: state.addCover,
    deleteCover: state.deleteCover,
    updateProject: state.updateProject,
    copy: state.copy,
    paste: state.paste,
    undo: state.undo,
    redo: state.redo,
    canUndo: state.backwardHistory.length > 1,
    canRedo: state.forwardHistory.length > 0,
    canPaste: state.copiedStyles.length > 0,
  }))
  const [debouncedCurrentProject] = useDebounceValue(currentProject, 500)

  const updateCloudProject = trpc.project.update.useMutation()

  const covers = currentProject.covers?.filter((c) => c !== undefined) ?? []
  const { currentCoverIndex, setCurrentCoverIndex } = useCoverStore()
  const [currentCover, updateCurrentCover] = useCurrentCover()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!projectId || !cloudProject.isSuccess) return

    updateCloudProject.mutate({
      id: Number.parseInt(projectId),
      title: debouncedCurrentProject.title,
      data: {
        community: debouncedCurrentProject.community,
        covers: debouncedCurrentProject.covers,
      },
    })

    utils.project.getOne.setData({ id: Number.parseInt(projectId) }, (data) => {
      if (!data) return

      return {
        ...data,
        title: debouncedCurrentProject.title
          ? debouncedCurrentProject.title
          : data.title,
        data: {
          ...data.data,
          community: debouncedCurrentProject.community,
          covers: debouncedCurrentProject.covers,
        },
      }
    })
  }, [debouncedCurrentProject, projectId])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (cloudProject.isSuccess) {
      updateProject({
        title: cloudProject.data.title ?? undefined,
        community: cloudProject.data.data.community,
        covers: cloudProject.data.data.covers,
      })
    }
  }, [cloudProject.isSuccess])

  const [trans, setTrans] = useState<Trans>(Trans.GRID)
  const [isPreview, setIsPreview] = useState(false)

  const [parent] = useAutoAnimate()

  return (
    <>
      <div className="h-screen flex flex-col pb-safe-area-bottom" id="editor">
        <Header
          before={<BackButton />}
          title={t(isPreview ? "preview-screen-title" : "editor-screen-title")}
          after={
            <div className={"flex"}>
              <IconButton onClick={() => setIsPreview(!isPreview)}>
                {isPreview ? <Icon24HideOutline /> : <Icon24ViewOutline />}
              </IconButton>
              <IconButton onClick={() => addCover()}>
                <Icon24Add />
              </IconButton>
            </div>
          }
        />

        <div className="overflow-scroll overscroll-contain flex-1">
          {!isPreview &&
            (cloudProject.isSuccess && currentProject.covers.length === 0 ? (
              <Placeholder
                stretched
                icon={<Icon56FragmentsOutline />}
                header={t("no-covers-placeholder")}
                children={t("no-covers-placeholder.caption")}
                action={
                  <Button
                    size="m"
                    onClick={() => addCover()}
                    before={<Icon24AddOutline />}
                  >
                    {t("add-cover-button")}
                  </Button>
                }
              />
            ) : (
              <div
                className={
                  "px-4 grid gap-2 grid-cols-2 container mx-auto sm:grid-cols-3 lg:grid-cols-4 pb-[var(--safe-area-bottom)+calc(132px)]"
                }
                ref={parent}
              >
                {currentProject.covers?.map((cover, i) => (
                  <CoverCard
                    {...cover}
                    index={i}
                    key={cover.uuid}
                    isHidden={i === currentCoverIndex && trans !== Trans.GRID}
                    onClick={() => {
                      setCurrentCoverIndex(i)
                      setTrans(Trans.TO_EDITOR)
                    }}
                    onDownload={() => downloadCover(cover)}
                    onDuplicate={() =>
                      addCover(
                        {
                          ...cover,
                          title: `${cover.title ?? t("untitled-cover-placeholder")} (${t("duplicate-suffix")})`,
                        },
                        i + 1
                      )
                    }
                    onDelete={() => deleteCover(i)}
                    onCopyStyles={(styles) => copy(cover, styles)}
                    onPasteStyles={canPaste ? () => paste(i) : undefined}
                  />
                ))}
              </div>
            ))}

          {isPreview && (
            <>
              <div className="bg-[#2688EB] h-32 rounded-t-xl" />
              <div className="px-3 flex flex-col gap-2 pb-2">
                <div className="size-20 rounded-full bg-[#2688EB] -mt-5 border-4 border-primary -mx-1" />
                <Title
                  level={2}
                  className="font-semibold"
                  i18nKey="preview-screen-community-title"
                />
              </div>
              <MiniInfoCell
                before={<Icon20FollowersOutline />}
                after={<UsersStack photos={["", "", ""]} />}
                children={"514,7K подписчиков · 77 друзей"}
              />
              <MiniInfoCell
                before={<Icon20GlobeOutline />}
                children={<Link children="ducks.layxl.dev" />}
              />
              <MiniInfoCell
                mode="add"
                before={<Icon20HelpOutline />}
                children={"Оплата, доставка, возврат"}
              />
              <MiniInfoCell
                mode="more"
                before={<Icon20Info />}
                children={"Подробная информация"}
              />
              <div className="px-3">
                <ButtonGroup stretched>
                  <Button
                    stretched
                    size="m"
                    mode="primary"
                    before={<Icon24MessageOutline />}
                    children={"Сообщение"}
                  />
                  <Button
                    stretched
                    size="m"
                    mode="secondary"
                    before={<Icon24LinkCircle />}
                    children={"Подробнее"}
                  />
                </ButtonGroup>
              </div>
              <div ref={parent} className="flex overflow-scroll p-3 gap-2">
                {currentProject.covers?.map((cover, i) => (
                  <CoverCard
                    {...cover}
                    mode="preview"
                    index={i}
                    key={cover.uuid}
                    isHidden={i === currentCoverIndex && trans !== Trans.GRID}
                    onClick={() => {
                      setCurrentCoverIndex(i)
                      setTrans(Trans.TO_EDITOR)
                    }}
                    onDownload={() => downloadCover(cover)}
                    onDuplicate={() =>
                      addCover(
                        {
                          ...cover,
                          title: `${cover.title ?? t("untitled-cover-placeholder")} (${t("duplicate-suffix")})`,
                        },
                        i + 1
                      )
                    }
                    onDelete={() => deleteCover(i)}
                    onCopyStyles={(styles) => copy(cover, styles)}
                    onPasteStyles={canPaste ? () => paste(i) : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "fixed bottom-0 w-full p-4 bg-primary flex-col gap-3 hidden pb-[calc(var(--safe-area-bottom)+16px)]",
            cloudProject.isSuccess && currentProject.covers.length > 0 && "flex"
          )}
        >
          <Button
            stretched
            size={"l"}
            before={<Icon24DownloadOutline />}
            onClick={() => downloadCovers(covers)}
          >
            {t("download-all-button")}
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="fixed inset-0 bg-primary flex flex-col overflow-hidden pb-[var(--safe-area-bottom)]"
        animate={{
          pointerEvents: trans !== Trans.GRID ? "auto" : "none",
          opacity: trans === Trans.TO_EDITOR || trans === Trans.EDITOR ? 1 : 0,
        }}
      >
        <Header
          before={<BackButton onClick={() => setTrans(Trans.TO_GRID)} />}
          title={t("editor-screen-title")}
        />

        <div
          className="flex-1"
          style={{ visibility: trans === Trans.EDITOR ? "visible" : "hidden" }}
        >
          <CoverCarousel
            isInvisible={trans !== Trans.EDITOR}
            covers={covers}
            currentCoverIndex={currentCoverIndex}
            setCurrentCoverIndex={setCurrentCoverIndex}
            onChangeTitle={(title) => {
              updateCurrentCover({ title })
            }}
            onRemove={() => {
              deleteCover(currentCoverIndex)
              setCurrentCoverIndex(
                currentCoverIndex > 0 ? currentCoverIndex - 1 : 0
              )

              if (covers.length === 1) setTrans(Trans.TO_GRID)
            }}
            onUndo={() => {
              undo()
            }}
            onRedo={() => {
              redo()
            }}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        <AnimatePresence>
          {(trans === Trans.EDITOR || trans === Trans.TO_EDITOR) && (
            <motion.div
              className="bottom-safe-area-bottom w-full"
              initial={{ translateY: "100%" }}
              animate={{ translateY: 0 }}
              exit={{ translateY: "100%" }}
            >
              <EditorToolBar />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {(trans === Trans.TO_EDITOR || trans === Trans.TO_GRID) && (
        <motion.div
          className="fixed overflow-hidden"
          initial={createAnimCoverRenderer(
            trans !== Trans.TO_EDITOR,
            currentCoverIndex
          )}
          animate={{
            ...createAnimCoverRenderer(
              trans === Trans.TO_EDITOR,
              currentCoverIndex
            ),
            ...(trans === Trans.TO_EDITOR
              ? {
                  top: 108,
                }
              : {}),
          }}
          onAnimationComplete={() =>
            setTrans((prev) =>
              prev === Trans.TO_EDITOR ? Trans.EDITOR : Trans.GRID
            )
          }
        >
          <CoverRenderer {...currentCover} />
        </motion.div>
      )}
    </>
  )
}

const createAnimCoverRenderer = (inversed: boolean, index: number) => {
  const elem = document
    .getElementById(`cover-${inversed ? "preview" : index}`)
    ?.getBoundingClientRect()

  return {
    borderRadius: inversed ? 12 : 8,
    left: elem?.left,
    top: elem?.top,
    width: elem?.width,
  }
}
