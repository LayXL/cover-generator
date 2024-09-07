import { cn } from "@/shared/utils/cn"
import { Icon28ChevronLeftOutline } from "@vkontakte/icons"
import { useToolbar } from "../lib/useToolbar"
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
    <div
      className={cn(
        "p-0.5 flex h-full rounded-xl",
        (props.canGoBack || props.mode === "secondary") && "bg-surface"
      )}
    >
      {props.canGoBack && (
        <button
          type="button"
          className="grid place-items-center bg-primary rounded-[10px] border border-inversed/10 px-1.5"
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
          isSelected={toolbar.selectedItems[props.name] === item.name}
          onClick={() => {
            item.onSelect?.({
              push: toolbar.push(props.mode === "secondary"),
              markAsSelected: () =>
                toolbar.markAsSelected(props.name, item.name),
              pushAndMark: (tabName: string) => {
                toolbar.push(props.mode === "secondary")(tabName)
                toolbar.markAsSelected(props.name, item.name)
              },
            })
          }}
        />
      ))}
    </div>
  )
}
