import { deepMerge } from "@/shared/utils/deepMerge"
import type { Cover, DeepPartial, Project } from "shared/types"
import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"

type ProjectState = {
  project: DeepPartial<Project>
  updateProject: (project: DeepPartial<Project>) => void
  addCover: (cover?: Omit<Cover, "uuid">) => void
  updateCover: (index: number, cover: DeepPartial<Cover>) => void
  deleteCover: (index: number) => void
  projectId?: number
  setProjectId: (id: number) => void
}

export const useProjectStore = create<ProjectState>()((set) => ({
  project: {},
  updateProject: (project) =>
    set((state) => ({
      project: { ...state.project, ...project },
    })),
  addCover(cover) {
    set((state) => ({
      project: {
        ...state.project,
        covers: [
          ...(state.project.covers ?? []),
          {
            bg: {
              type: "solid",
              color: "#fff",
            },
            ...cover,
            uuid: uuidv4(),
          },
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
            i === index && c ? deepMerge(c, newCover) : c
          ) ?? [],
      },
    }))
  },
  setProjectId(id) {
    set(() => ({
      projectId: id,
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
