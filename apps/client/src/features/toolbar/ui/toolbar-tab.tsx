import { Icon28ChevronLeftOutline } from "@vkontakte/icons"
import { useToolbar } from "../lib/useToolBar"
import { ToolbarItem, type ToolbarItemData } from "./toolbar-item"

export type ToolbarTabData = {
  name: string
  items: ToolbarItemData[]
}

type ToolbarTabProps = ToolbarTabData & {
  mode: "primary" | "secondary"
  canGoBack?: boolean
}

export const ToolbarTab = (props: ToolbarTabProps) => {
  const toolbar = useToolbar()

  return (
    <div className="p-0.5 flex h-full bg-surface rounded-xl">
      {props.canGoBack && (
        <button
          type="button"
          className="grid place-items-center bg-primary rounded-[10px] border border-inversed/10"
          onClick={() => {
            toolbar.back()
          }}
        >
          <Icon28ChevronLeftOutline className="fill-accent" />
        </button>
      )}
      {props.items.map((item) => (
        <ToolbarItem
          key={item.title}
          {...item}
          mode={props.mode}
          onClick={() => {
            item.onSelect?.(toolbar)
          }}
        />
      ))}
    </div>
  )
}
