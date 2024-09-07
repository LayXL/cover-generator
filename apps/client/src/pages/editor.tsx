import { downloadCovers } from "@/entities/cover/lib/downloadCovers"
import { CoverCarousel } from "@/entities/cover/ui/cover-carousel"
import { CoverRenderer } from "@/entities/cover/ui/cover-renderer"
import { useCurrentCover } from "@/features/editor/lib/useCurrentCover.tsx"
import { EditorToolBar } from "@/features/editor/ui/editor-tool-bar"
import { useCoverStore, useProjectStore } from "@/shared/store"
import { trpc } from "@/shared/utils/trpc"
import { skipToken } from "@tanstack/react-query"
import { Icon24FullscreenExit } from "@vkontakte/icons"
import { IconButton } from "@vkontakte/vkui"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDebounceValue } from "usehooks-ts"

enum Trans {
  GRID = 0,
  TO_EDITOR = 1,
  EDITOR = 2,
  TO_GRID = 3,
}

export const Editor = () => {
  const utils = trpc.useUtils()

  const { id: projectId } = useParams()
  const cloudProject = trpc.project.getOne.useQuery(
    !projectId ? skipToken : { id: Number.parseInt(projectId) }
  )

  const {
    project: currentProject,
    addCover,
    deleteCover,
    updateProject,
  } = useProjectStore()
  const [debouncedCurrentProject] = useDebounceValue(currentProject, 500)

  const updateCloudProject = trpc.project.update.useMutation()

  const covers = currentProject.covers?.filter((c) => c !== undefined) ?? []
  const { currentCoverIndex, setCurrentCoverIndex } = useCoverStore()
  const [currentCover, updateCurrentCover] = useCurrentCover()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!projectId) return

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

  return (
    <>
      <div className="h-screen overflow-scroll">
        <div className="p-4 flex gap-4">
          <button
            type="button"
            onClick={() => addCover()}
            children={"Add cover"}
          />
          <button
            type="button"
            onClick={() => deleteCover(currentCoverIndex)}
            children={"Delete current"}
          />
          <button
            type="button"
            onClick={() => downloadCovers(covers)}
            children={"Download all"}
          />
        </div>

        <div className="p-4 grid gap-1 grid-cols-2 container mx-auto sm:grid-cols-3 lg:grid-cols-4">
          {currentProject.covers?.map((cover, i) => (
            <motion.button
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              id={`cover-${i}`}
              className="rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                setCurrentCoverIndex(i)
                setTrans(Trans.TO_EDITOR)
              }}
              style={{
                visibility:
                  i === currentCoverIndex && trans !== Trans.GRID
                    ? "hidden"
                    : undefined,
              }}
            >
              <CoverRenderer {...cover} />
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        className="fixed inset-0 grid pt-20 bg-primary"
        animate={{
          pointerEvents: trans !== Trans.GRID ? "auto" : "none",
          opacity: trans === Trans.TO_EDITOR || trans === Trans.EDITOR ? 1 : 0,
        }}
      >
        <div
          style={{
            visibility: trans === Trans.EDITOR ? "visible" : "hidden",
          }}
        >
          <CoverCarousel
            covers={covers}
            currentCoverIndex={currentCoverIndex}
            setCurrentCoverIndex={setCurrentCoverIndex}
            onChangeTitle={(title) => {
              updateCurrentCover({ title })
            }}
            onRemove={() => {
              console.log(true)
            }}
          />
        </div>
      </motion.div>

      {(trans === Trans.TO_EDITOR || trans === Trans.TO_GRID) && (
        <motion.div
          className="fixed overflow-hidden"
          initial={createAnimCoverRenderer(
            trans !== Trans.TO_EDITOR,
            currentCoverIndex
          )}
          animate={createAnimCoverRenderer(
            trans === Trans.TO_EDITOR,
            currentCoverIndex
          )}
          onAnimationComplete={() =>
            setTrans((prev) =>
              prev === Trans.TO_EDITOR ? Trans.EDITOR : Trans.GRID
            )
          }
        >
          <CoverRenderer {...currentCover} />
        </motion.div>
      )}

      <AnimatePresence>
        {(trans === Trans.EDITOR || trans === Trans.TO_EDITOR) && (
          <>
            <motion.div
              className="fixed top-0 w-full"
              initial={{ translateY: "-100%" }}
              animate={{ translateY: 0 }}
              exit={{ translateY: "-100%" }}
            >
              <div className="p-4 flex justify-end">
                <IconButton
                  onClick={() => {
                    setTrans(Trans.TO_GRID)
                  }}
                >
                  <Icon24FullscreenExit />
                </IconButton>
              </div>
            </motion.div>
            <motion.div
              className="fixed bottom-0 w-full"
              initial={{ translateY: "100%" }}
              animate={{ translateY: 0 }}
              exit={{ translateY: "100%" }}
            >
              <EditorToolBar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
