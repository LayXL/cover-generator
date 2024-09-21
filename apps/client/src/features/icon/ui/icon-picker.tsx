import { useQuery } from "@tanstack/react-query"
import type { Emoji } from "shared/types"
import { IconCard } from "./icon-card"

type IconPickerProps = {
  name?: string
  onSelect: (name: string | null) => void
  category: "emojis" | "fill" | "outline"
}

export const IconPicker = (props: IconPickerProps) => {
  const icons = useQuery({
    queryKey: ["icons", props.category],
    queryFn: async () => {
      if (props.category === "emojis") {
        const emojis = (await fetch("/emojis").then((res) =>
          res.json()
        )) as Emoji[]

        emojis.sort((a, b) => a.sort_order - b.sort_order)

        return emojis.map((x) => x.image.replace(".png", ""))
      }
    },
  })

  return (
    <div className="px-3 overflow-scroll grid grid-rows-1 grid-flow-col gap-2 justify-start [@media(min-height:680px)]:grid-rows-2 [@media(min-height:720px)]:grid-rows-3 [@media(min-height:790px)]:grid-rows-4">
      <IconCard
        category={"icon"}
        name={"minus"}
        isSelected={!props.name}
        onClick={() => props.onSelect(null)}
      />

      {icons.data?.map((icon) => (
        <IconCard
          key={icon}
          name={icon}
          category={props.category === "emojis" ? "emoji" : "icon"}
          isSelected={icon === props.name}
          onClick={() => props.onSelect(icon)}
        />
      ))}
    </div>
  )
}
