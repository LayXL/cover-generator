import { createContext, useContext } from "react"

export type SelectedItems = Record<string, string | null>

export type ToolbarContext = {
  currentTab: string
  tabHistory: string[]
  selectedItems: SelectedItems
  push: (replace: boolean) => (tabName: string) => void
  back: () => void
  markAsSelected: (tabName: string, itemName: string) => void
}

const toolbarContext = createContext<ToolbarContext>({
  currentTab: "root",
  tabHistory: [],
  selectedItems: {},
  push: () => () => {},
  back: () => {},
  markAsSelected: () => {},
})

export const useToolbar = () => useContext(toolbarContext)

export const ToolbarProvider = toolbarContext.Provider
