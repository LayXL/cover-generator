import { useEffect, useState } from "react"
import { hexColor } from "../lib/checkIsValidHex"

type ColorInputProps = {
  value?: `#${string}`
  onChange?: (value: `#${string}`) => void
}

export const ColorInput = (props: ColorInputProps) => {
  const [value, setValue] = useState<string>(
    props.value?.replaceAll("#", "").toLocaleUpperCase() ?? ""
  )

  useEffect(() => {
    setValue(props.value?.replaceAll("#", "").toLocaleUpperCase() ?? "")
  }, [props.value])

  return (
    <input
      className="flex-1 h-9 px-3 rounded-[10px] border border-inversed/10 outline-none w-full"
      value={`#${value}`}
      onChange={({ target: { value } }) => {
        setValue(value.replaceAll("#", "").toLocaleUpperCase())
        props.onChange?.(hexColor.parse(value))
      }}
    />
  )
}
