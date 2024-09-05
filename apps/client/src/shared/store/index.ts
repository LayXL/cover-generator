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
  project: Project
  updateProject: (project: Project) => void
  addCover: (cover?: Omit<Cover, "uuid">) => void
  updateCover: (index: number, cover: DeepPartial<Cover>) => void
  deleteCover: (index: number) => void
}

export const useProjectStore = create<ProjectState>()((set) => ({
  project: {
    covers: [],
  },
  updateProject: (project) =>
    set((state) => {
      return {
        project: projectSchema.parse(deepMerge(state.project, project)),
      }
    }),
  addCover(cover) {
    set((state) => ({
      project: {
        ...state.project,
        covers: [
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
    set((state) => ({
      project: {
        ...state.project,
        covers:
          state.project.covers?.map((c, i) =>
            i === index && c ? coverSchema.parse(deepMerge(c, newCover)) : c
          ) ?? [],
      },
    }))
  },
}))

type CoverState = {
  currentCoverIndex: number
  setCurrentCoverIndex: (index: number) => void
}

export const useCoverStore = create<CoverState>()((set) => ({
  currentCoverIndex: 0,
  setCurrentCoverIndex: (index) => set({ currentCoverIndex: index }),
}))
