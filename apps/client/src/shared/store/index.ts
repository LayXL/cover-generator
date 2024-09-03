import { create } from "zustand"
import { Cover, Project } from "../types"

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

type ProjectState = {
  project: Partial<Project>
  updateProject: (project: Partial<Project>) => void
  addCover: (cover?: Cover) => void
  updateCover: (index: number, cover: DeepPartial<Cover>) => void
  deleteCover: (index: number) => void
}

export const useProjectStore = create<ProjectState>()((set) => {
  return {
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
            cover ?? { bg: { type: "solid", color: "#fff" } },
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
  }
})

function deepMerge<
  T extends Record<string, any>,
  U extends Record<string, any>,
>(obj1: T, obj2: U): T & U {
  const result: Record<string, any> = { ...obj1 }

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (isObject(obj2[key]) && isObject(result[key])) {
        // Recursively merge nested objects
        result[key] = deepMerge(result[key], obj2[key])
      } else {
        // Copy or overwrite the property
        result[key] = obj2[key]
      }
    }
  }

  return result as T & U
}

function isObject(obj: any): obj is Record<string, any> {
  return obj && typeof obj === "object" && !Array.isArray(obj)
}
