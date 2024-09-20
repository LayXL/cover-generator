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

type ProjectState = {
  projectSnapshotsBackward: Project[]
  projectSnapshotsForward: Project[]
  undo: () => void
  redo: () => void
  project: Project
  updateProject: (project: Project) => void
  addCover: (cover?: Omit<Cover, "uuid">, index?: number) => void
  updateCover: (index: number, cover: DeepPartial<Cover>) => void
  deleteCover: (index: number) => void
  clearProject: () => void
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projectSnapshotsBackward: [],
  projectSnapshotsForward: [],
  undo: () => {
    if (!get().projectSnapshotsBackward.length) return

    set((state) => ({
      project:
        state.projectSnapshotsBackward[
          state.projectSnapshotsBackward.length - 1
        ] ?? state.project,
      projectSnapshotsForward: [
        ...state.projectSnapshotsForward,
        state.project,
      ],
      projectSnapshotsBackward: state.projectSnapshotsBackward.slice(0, -1),
    }))
  },
  redo: () => {
    if (!get().projectSnapshotsForward.length) return

    set((state) => ({
      project:
        state.projectSnapshotsForward[
          state.projectSnapshotsForward.length - 1
        ] ?? state.project,
      projectSnapshotsForward: state.projectSnapshotsForward.slice(0, -1),
      projectSnapshotsBackward: [
        ...state.projectSnapshotsBackward,
        state.project,
      ],
    }))
  },
  project: { covers: [] },
  updateProject: (project) =>
    set((state) => {
      return {
        project: projectSchema.parse(deepMerge(state.project, project)),
        // projectSnapshotsBackward: [
        //   ...state.projectSnapshotsForward,
        //   state.project,
        // ],
        // projectSnapshotsForward: [],
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
        projectSnapshotsBackward: [
          ...state.projectSnapshotsForward,
          state.project,
        ],
        projectSnapshotsForward: [],
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
