import { IconCard } from "./icon-card"

type IconPickerProps = {
  name?: string
  onSelect: (name: string) => void
}

export const IconPicker = (props: IconPickerProps) => {
  return (
    <div className="px-3 overflow-scroll grid grid-rows-3 grid-flow-col gap-2 justify-start">
      <IconCard name={"minus"} isSelected={!props.name} />

      {["home"].map((icon) => (
        <IconCard key={icon} name={icon} isSelected={icon === props.name} />
      ))}
    </div>
  )
}
