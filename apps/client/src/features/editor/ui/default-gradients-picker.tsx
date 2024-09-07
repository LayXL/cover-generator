import { type DefaultGradient, defaultGradients } from "../lib/defaultGradients"
import { DefaultGradientItem } from "./default-gradient-item"

type DefaultGradientsPickerProps = {
  onChoose?: (gradient: DefaultGradient) => void
}

export const DefaultGradientsPicker = (props: DefaultGradientsPickerProps) => {
  return (
    <div className="py-3 border-b border-b-inversed/15">
      <div className="flex gap-2 overflow-scroll px-3">
        {defaultGradients.map((gradient) => (
          <DefaultGradientItem
            key={JSON.stringify(gradient)}
            colors={gradient}
            onClick={() => {
              props.onChoose?.(gradient)
            }}
          />
        ))}
      </div>
    </div>
  )
}
