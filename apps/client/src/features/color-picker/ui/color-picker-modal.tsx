import { Input } from "@vkontakte/vkui"
import { hexColor } from "../lib/checkIsValidHex"

type ColorPickerModalProps = {
  color?: string
  onChange: (color: string) => void
}

export const ColorPickerModal = (props: ColorPickerModalProps) => {
  return (
    <div className="p-4 flex flex-col gap-3">
      <input
        type="color"
        value={props.color ?? "#000"}
        onChange={(e) => props.onChange(e.target.value)}
      />

      <Input
        value={props.color}
        onChange={({ target: { value } }) => {
          if (hexColor.safeParse(value).error) return
          props.onChange(value)
        }}
      />
    </div>
  )
}
