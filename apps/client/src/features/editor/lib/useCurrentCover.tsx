import { useCoverStore, useProjectStore } from "@/shared/store"
import { useCallback } from "react"
import type { Cover, DeepPartial } from "shared/types"

export const useCurrentCover = () => {
  const {
    updateCover,
    project: { covers },
  } = useProjectStore()

  const { currentCoverIndex } = useCoverStore()

  const updateCurrentCover = useCallback(
    (cover: DeepPartial<Cover>) => {
      updateCover(currentCoverIndex, cover)
    },
    [updateCover, currentCoverIndex]
  )

  const currentCover = covers[currentCoverIndex]

  return [
    currentCover as typeof currentCover | null,
    updateCurrentCover,
  ] as const
}
