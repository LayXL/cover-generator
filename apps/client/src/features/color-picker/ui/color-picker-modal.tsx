type ColorPickerModalProps = {
  color?: string
  onChange: (color: string) => void
}

export const ColorPickerModal = (props: ColorPickerModalProps) => {
  return (
    <div className="p-4">
      <input
        type="color"
        value={props.color ?? "#000"}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  )
}
