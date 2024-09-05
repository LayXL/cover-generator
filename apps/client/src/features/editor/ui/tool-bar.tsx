import { downloadCover } from "@/entities/cover/lib/downloadCover"
import { useCoverStore, useProjectStore } from "@/shared/store"
import { useCallback } from "react"
import type { Cover, DeepPartial } from "shared/types"

export const ToolBar = () => {
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

  return (
    <div className="p-4 flex gap-4 overflow-scroll">
      <button
        type="button"
        onClick={() => {
          updateCover(currentCoverIndex, {
            text: {
              value: "Sample Text",
              fontSize: 32,
              color: "#000",
            },
          })
        }}
        children={"Add text"}
      />
      <button
        type="button"
        onClick={() => {
          updateCurrentCover({
            icon: {
              name: "home",
              size: 32,
              color: "#000",
            },
          })
        }}
        children={"Add icon"}
      />
      <input
        className="bg-primary text-primary border border-inversed rounded-xl px-3"
        onChange={(e) => {
          updateCurrentCover({
            text: {
              value: e.target.value,
            },
          })
        }}
        placeholder="Text"
      />
      <button
        type="button"
        onClick={() => {
          updateCurrentCover({
            bg: {
              type: "gradient",
              colors: ["#000", "#fff"],
            },
          })
        }}
        children={"Set gradient"}
      />
      <input
        type="range"
        min={0}
        max={360}
        onChange={(e) => {
          updateCurrentCover({
            bg: {
              angle: Number(e.target.value),
            },
          })
        }}
      />
      <button
        type="button"
        onClick={() => {
          if (!covers?.[currentCoverIndex]) return

          downloadCover(covers[currentCoverIndex])
        }}
        children={"Download"}
      />
    </div>
  )
}
