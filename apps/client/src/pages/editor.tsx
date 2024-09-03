import { Icon24FullscreenExit } from "@vkontakte/icons"
import { IconButton } from "@vkontakte/vkui"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { CoverCarousel } from "../entities/cover/ui/cover-carousel"
import { CoverRenderer } from "../entities/cover/ui/cover-renderer"
import { ToolBar } from "../features/editor/ui/tool-bar"
import { useCoverStore, useProjectStore } from "../shared/store"

enum Trans {
  GRID,
  TO_EDITOR,
  EDITOR,
  TO_GRID,
}

export const Editor = () => {
  const {
    project: currentProject,
    updateProject,
    addCover,
    deleteCover,
  } = useProjectStore()

  const covers = currentProject.covers ?? []

  const { currentCoverIndex, setCurrentCoverIndex } = useCoverStore()
  const currentCover = useMemo(
    () => currentProject.covers?.[currentCoverIndex],
    [currentCoverIndex, currentProject.covers]
  )

  useEffect(() => {
    updateProject({ title: "Untitled" })
  }, [])

  const [trans, setTrans] = useState<Trans>(Trans.GRID)

  return (
    <>
      <div className="h-screen overflow-scroll">
        <div className="p-4 flex gap-4">
          <button onClick={() => addCover()} children={"Add cover"} />
          <button
            onClick={() => deleteCover(currentCoverIndex)}
            children={"Delete current"}
          />
        </div>

        <div className="p-4 grid gap-1 grid-cols-2 container mx-auto sm:grid-cols-3 lg:grid-cols-4">
          {currentProject.covers?.map((cover, i) => (
            <div
              id={`cover-${i}`}
              key={i}
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
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="fixed inset-0 grid place-items-center bg-primary"
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
          />
        </div>
      </motion.div>

      <motion.div
        className="fixed top-0 w-full"
        animate={
          trans === Trans.EDITOR ? { translateY: 0 } : { translateY: "-100%" }
        }
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
        animate={
          trans === Trans.EDITOR ? { translateY: 0 } : { translateY: "100%" }
        }
      >
        <ToolBar />
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
