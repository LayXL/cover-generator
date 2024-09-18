import { IconCard } from "./icon-card"

type IconPickerProps = {
  name?: string
  onSelect: (name: string | null) => void
}

export const IconPicker = (props: IconPickerProps) => {
  return (
    <div className="px-3 overflow-scroll grid grid-rows-3 grid-flow-col gap-2 justify-start">
      <IconCard
        name={"minus"}
        isSelected={!props.name}
        onClick={() => props.onSelect(null)}
      />

      {["home"].map((icon) => (
        <IconCard
          key={icon}
          name={icon}
          isSelected={icon === props.name}
          onClick={() => props.onSelect(icon)}
        />
      ))}
    </div>
  )
}
