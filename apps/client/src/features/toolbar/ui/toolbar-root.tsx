import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useState,
} from "react"
import { type SelectedItems, ToolbarProvider } from "../lib/useToolbar"
import { ToolbarTab, type ToolbarTabData } from "./toolbar-tab"

type ToolbarRootProps = {
  tabs: ToolbarTabData[]
  overrideCurrentTab?: string
  overrideTabHistory?: string[]
  overrideSelectedItems?: SelectedItems
  selectedItems: SelectedItems
  setSelectedItems: Dispatch<SetStateAction<SelectedItems>>
  before?: ReactNode
}

export const ToolbarRoot = (props: ToolbarRootProps) => {
  const [currentTab, setCurrentTab] = useState(
    props.overrideCurrentTab ?? "root"
  )
  const [tabHistory, setTabHistory] = useState<string[]>(
    props.overrideTabHistory ?? []
  )

  const markAsSelected = useCallback(
    (tabName: string, itemName: string) => {
      props.setSelectedItems((prev) => ({
        ...prev,
        [tabName]: itemName,
      }))
    },
    [props.setSelectedItems]
  )

  const push = useCallback(
    (replace: boolean) => (tabName: string) => {
      setCurrentTab(tabName)
      if (!replace) setTabHistory([...tabHistory, currentTab])
    },
    [tabHistory, currentTab]
  )

  const back = useCallback(() => {
    if (tabHistory.length > 1) {
      setTabHistory(tabHistory.slice(0, -1))
      setCurrentTab(tabHistory[tabHistory.length - 1])
      props.setSelectedItems((prev) => ({
        ...prev,
        [tabHistory[tabHistory.length - 1]]: null,
      }))
    }
  }, [tabHistory, props.setSelectedItems])

  const currentTabData = props.tabs.find((tab) => tab.name === currentTab)
  const latestInHistoryTabData = props.tabs.find(
    (tab) => tab.name === tabHistory[tabHistory.length - 1]
  )

  return (
    <ToolbarProvider
      value={{
        currentTab,
        tabHistory,
        selectedItems: props.selectedItems,
        push,
        back,
        markAsSelected,
      }}
    >
      {props.before}
      <div className="flex flex-col gap-3 p-3">
        <div className="h-[79px]">
          {currentTabData && (
            <ToolbarTab
              canGoBack={tabHistory.length > 1}
              mode="primary"
              {...currentTabData}
            />
          )}
        </div>
        <div className="h-11">
          {latestInHistoryTabData && (
            <ToolbarTab mode="secondary" {...latestInHistoryTabData} />
          )}
        </div>
      </div>
    </ToolbarProvider>
  )
}
