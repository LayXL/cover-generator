import { create } from "zustand"
import { Cover, Project } from "../types"

type ProjectState = {
  project: Partial<Project>
  updateProject: (project: Project) => void
  addCover: (cover?: Cover) => void
  updateCover: (index: number, cover: Cover) => void
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
    updateCover(index, cover) {
      set((state) => ({
        project: {
          ...state.project,
          covers:
            state.project.covers?.map((c, i) => (i === index ? cover : c)) ??
            [],
        },
      }))
    },
  }
})
