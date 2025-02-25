import { useHaptic } from "@/shared/hooks/use-haptic"
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
  const haptic = useHaptic()

  return (
    <div
      className={cn(
        "p-0.5 flex h-full rounded-xl",
        (props.canGoBack || props.mode === "secondary") && "bg-surface"
      )}
    >
      {props.canGoBack && (
        <div className="flex gap-2">
          <button
            type="button"
            className="grid place-items-center bg-primary rounded-[10px] border border-inversed/10 px-1.5"
            onClick={() => {
              haptic("selection")
              toolbar.back()
            }}
          >
            <Icon28ChevronLeftOutline className="fill-accent" />
          </button>
          <div className="bg-inversed/10 rounded-full my-2 w-px" />
        </div>
      )}
      {props.items.map((item) => (
        <ToolbarItem
          key={item.title}
          {...item}
          mode={props.mode}
          isSelected={toolbar.selectedItems[props.name] === item.name}
          canGoBack={props.canGoBack}
          onClick={() => {
            item.onSelect?.({
              push: toolbar.push(props.mode === "secondary"),
              markAsSelected: () =>
                toolbar.markAsSelected(props.name, item.name),
              pushAndMark: (tabName: string) => {
                toolbar.push(props.mode === "secondary")(tabName)
                toolbar.markAsSelected(props.name, item.name)
              },
              switch: () => {
                toolbar.switch(props.name, item.name)
              },
            })
          }}
        />
      ))}
    </div>
  )
}
