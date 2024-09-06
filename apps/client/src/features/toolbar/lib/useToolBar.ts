import { createContext, useContext } from "react"

export type ToolbarContext = {
  currentTab: string
  tabHistory: string[]
  push: (tabName: string) => void
  back: () => void
}

const toolbarContext = createContext<ToolbarContext>({
  currentTab: "root",
  tabHistory: [],
  push: () => {},
  back: () => {},
})

export const useToolbar = () => useContext(toolbarContext)

export const ToolbarProvider = toolbarContext.Provider
