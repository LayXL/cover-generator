import { motion } from "framer-motion"
import { useState } from "react"
import { CoverRenderer } from "../entities/cover/ui/cover-renderer"

enum Trans {
  GRID,
  TO_GRID,
  EDITOR,
  TO_EDITOR,
}

const defaultColors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5"]

export const Editor = () => {
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0)

  const [trans, setTrans] = useState<Trans>(Trans.GRID)

  return (
    <div>
      <div className="h-screen overflow-scroll">
        <div className="p-4 grid gap-1 grid-cols-[repeat(auto-fit,_minmax(192px,_1fr))]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              id={`cover-${i}`}
              key={i}
              className="rounded-lg overflow-hidden"
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
              <CoverRenderer bg={defaultColors[i % 5]} />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="fixed inset-0 grid place-items-center bg-primary px-4"
        onClick={() => {
          setTrans(Trans.TO_GRID)
        }}
        animate={
          trans === Trans.TO_EDITOR || trans === Trans.EDITOR
            ? { pointerEvents: "auto", opacity: 1 }
            : { pointerEvents: "none", opacity: 0 }
        }
      >
        <div
          id="cover-preview"
          style={{
            visibility: trans === Trans.EDITOR ? "visible" : "hidden",
          }}
          className="overflow-hidden rounded-xl w-full"
        >
          <CoverRenderer bg={defaultColors[currentCoverIndex % 5]} />
        </div>
      </motion.div>

      {(trans === Trans.TO_EDITOR || trans === Trans.TO_GRID) && (
        <motion.div
          className="fixed overflow-hidden"
          initial={createAnimCanvas(
            trans === Trans.TO_EDITOR ? false : true,
            currentCoverIndex
          )}
          animate={createAnimCanvas(
            trans === Trans.TO_EDITOR ? true : false,
            currentCoverIndex
          )}
          onAnimationComplete={() =>
            setTrans((prev) =>
              prev === Trans.TO_EDITOR ? Trans.EDITOR : Trans.GRID
            )
          }
        >
          <CoverRenderer bg={defaultColors[currentCoverIndex % 5]} />
        </motion.div>
      )}
    </div>
  )
}

const createAnimCanvas = (inversed: boolean, index: number) => {
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
