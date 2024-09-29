import { deepMerge } from "@/shared/utils/deepMerge"
import {
  type Cover,
  type DeepPartial,
  type Project,
  coverSchema,
  projectSchema,
} from "shared/types"
import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"

export type Style = "background" | "icon" | "text"

type Snapshot =
  | {
      type: "projectUpdate"
      data: Project
    }
  | {
      type: "viewChange"
      view: "editor" | "grid"
    }
  | {
      type: "selectionChange"
      coverUuid: string
    }

type ProjectState = {
  backwardHistory: Snapshot[]
  forwardHistory: Snapshot[]
  copiedStyles: Style[]
  copiedCover?: Partial<Cover> | null
  copy: (cover: Partial<Cover>, styles: Style[]) => void
  paste: (coverIndex: number) => void
  undo: () => Snapshot
  redo: () => Snapshot
  project: Project
  updateProject: (project: Project) => void
  addCover: (cover?: Omit<Cover, "uuid">, index?: number) => void
  updateCover: (index: number, cover: DeepPartial<Cover>) => void
  deleteCover: (index: number) => void
  clearProject: () => void
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  backwardHistory: [],
  forwardHistory: [],
  undo: () => {
    set((state) => {
      const backwardHistory = [...state.backwardHistory]

      if (state.forwardHistory.length === 0) backwardHistory.pop()
      const entry = backwardHistory.pop()

      if (!entry) return {}

      if (entry?.type === "projectUpdate") {
        return {
          project: entry.data,
          backwardHistory,
          forwardHistory: [...state.forwardHistory, entry],
        }
      }

      return {
        backwardHistory,
        forwardHistory: [...state.forwardHistory, entry],
      }
    })

    return get().forwardHistory.reverse()?.[0]
  },
  redo: () => {
    set((state) => {
      const forwardHistory = [...state.forwardHistory]

      if (state.backwardHistory.length === 0) forwardHistory.pop()
      const entry = forwardHistory.pop()

      if (!entry) return {}

      if (entry?.type === "projectUpdate") {
        return {
          project: entry.data,
          backwardHistory: [...state.backwardHistory, entry],
          forwardHistory,
        }
      }

      return {
        backwardHistory: [...state.backwardHistory, entry],
        forwardHistory,
      }
    })

    return get().backwardHistory.reverse()?.[0]
  },
  copiedStyles: [],
  copiedCover: null,
  copy: (cover, styles) => {
    set(() => ({
      copiedStyles: styles,
      copiedCover: cover,
    }))
  },
  paste: (coverIndex) => {
    set((state) => {
      if (!state.copiedCover) return {}

      const cover = state.project.covers[coverIndex]

      if (!cover) return {}

      if (state.copiedStyles.includes("background")) {
        cover.background = state.copiedCover.background ?? {
          type: "solid",
          color: "#000000",
        }
      }
      if (state.copiedStyles.includes("icon")) {
        if (!cover.icon) cover.icon = { size: 32 }

        cover.icon.color = state.copiedCover.icon?.color
        cover.icon.size = state.copiedCover.icon?.size ?? 32
      }

      if (state.copiedStyles.includes("text")) {
        if (!cover.text)
          cover.text = { color: "#000000", fontSize: 32, fontWeight: 400 }

        cover.text.color = state.copiedCover.text?.color ?? "#000000"
        cover.text.fontFamily = state.copiedCover.text?.fontFamily
        cover.text.fontSize = state.copiedCover.text?.fontSize ?? 32
        cover.text.fontWeight = state.copiedCover.text?.fontWeight ?? 400
      }

      return {
        project: projectSchema.parse(
          deepMerge(state.project, {
            covers: state.project.covers.map((c, i) =>
              i === coverIndex ? cover : c
            ),
          })
        ),
      }
    })
  },
  project: { covers: [] },
  updateProject: (project) =>
    set((state) => {
      return {
        backwardHistory: [
          ...state.backwardHistory,
          {
            type: "projectUpdate",
            data: projectSchema.parse(deepMerge(state.project, project)),
          },
        ],
        forwardHistory: [],
        project: projectSchema.parse(deepMerge(state.project, project)),
      }
    }),
  addCover(cover, index) {
    set((state) => ({
      project: {
        ...state.project,
        covers:
          typeof index === "number"
            ? [
                ...state.project.covers.slice(
                  0,
                  index ?? state.project.covers.length
                ),
                coverSchema.parse({
                  ...cover,
                  uuid: uuidv4(),
                }),
                ...state.project.covers.slice(
                  index ?? state.project.covers.length
                ),
              ]
            : [
                ...state.project.covers,
                coverSchema.parse({
                  ...cover,
                  uuid: uuidv4(),
                }),
              ],
      },
    }))
  },
  deleteCover(index) {
    set((state) => ({
      project: {
        ...state.project,
        covers: state.project.covers?.filter((_, i) => i !== index) ?? [],
      },
    }))
  },
  updateCover(index, newCover) {
    set((state) => {
      const project = {
        ...state.project,
        covers:
          state.project.covers?.map((c, i) =>
            i === index && c ? coverSchema.parse(deepMerge(c, newCover)) : c
          ) ?? [],
      }

      if (JSON.stringify(project) === JSON.stringify(state.project))
        return { state }

      return {
        project,
        backwardHistory: [
          ...state.backwardHistory,
          { type: "projectUpdate", data: project },
        ],
        forwardHistory: [],
      }
    })
  },
  clearProject: () => set({ project: { covers: [] } }),
}))

type CoverState = {
  currentCoverIndex: number
  setCurrentCoverIndex: (index: number) => void
}

export const useCoverStore = create<CoverState>()((set) => ({
  currentCoverIndex: 0,
  setCurrentCoverIndex: (index) => set({ currentCoverIndex: index }),
}))
