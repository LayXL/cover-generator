import { useFonts } from "../lib/useFonts"
import { FontCard } from "./font-card"

type FontPickerProps = {
  category: "serif" | "sans-serif" | (string & {})
  name?: string
  onSelect: (name: string) => void
}

export const FontPicker = (props: FontPickerProps) => {
  const fonts = useFonts()

  return (
    <div className="px-3 overflow-scroll grid grid-rows-3 grid-flow-col gap-2 justify-start">
      {fonts.data
        ?.filter((font) => font.type === props.category)
        .map((font) => (
          <FontCard
            key={font.font}
            font={font.font}
            title={font.name}
            onClick={() => props.onSelect(font.font)}
            isSelected={props.name === font.font}
          />
        ))}
    </div>
  )
}
