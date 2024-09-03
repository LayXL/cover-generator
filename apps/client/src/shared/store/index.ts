import { deepMerge } from "@/shared/utils/deepMerge"
import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import type { Cover, DeepPartial, Project } from "../types"

type ProjectState = {
  project: Partial<Project>
  updateProject: (project: Partial<Project>) => void
  addCover: (cover?: Omit<Cover, "uuid">) => void
  updateCover: (index: number, cover: DeepPartial<Cover>) => void
  deleteCover: (index: number) => void
}

export const useProjectStore = create<ProjectState>()((set) => ({
  project: {},
  updateProject: (project: Partial<Project>) =>
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
            i === index ? deepMerge(c, newCover) : c
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
