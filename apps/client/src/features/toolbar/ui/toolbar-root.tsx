import { useCallback, useState } from "react"
import { ToolbarProvider } from "../lib/useToolBar"
import { ToolbarTab, type ToolbarTabData } from "./toolbar-tab"

type ToolbarRootProps = {
  tabs: ToolbarTabData[]
}

export const ToolbarRoot = (props: ToolbarRootProps) => {
  const [currentTab, setCurrentTab] = useState("root")
  const [tabHistory, setTabHistory] = useState<string[]>([])

  const push = useCallback(
    (tabName: string) => {
      setCurrentTab(tabName)
      setTabHistory([...tabHistory, currentTab])
    },
    [tabHistory, currentTab]
  )

  const back = useCallback(() => {
    if (tabHistory.length > 0) {
      setTabHistory(tabHistory.slice(0, -1))
      setCurrentTab(tabHistory[tabHistory.length - 1])
    }
  }, [tabHistory])

  const currentTabData = props.tabs.find((tab) => tab.name === currentTab)
  const latestInHistoryTabData = props.tabs.find(
    (tab) => tab.name === tabHistory[tabHistory.length - 1]
  )

  return (
    <ToolbarProvider
      value={{
        currentTab,
        tabHistory,
        push,
        back,
      }}
    >
      <div className="flex flex-col gap-3 p-3">
        <div className="h-[79px]">
          {currentTabData && (
            <ToolbarTab
              canGoBack={tabHistory.length >= 1}
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
