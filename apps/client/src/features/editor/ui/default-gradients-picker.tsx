import { Icon28MinusOutline } from "@vkontakte/icons"
import { type DefaultGradient, defaultGradients } from "../lib/defaultGradients"
import { DefaultGradientItem } from "./default-gradient-item"

type DefaultGradientsPickerProps = {
  onChoose?: (gradient: DefaultGradient) => void
  onRemove?: () => void
}

export const DefaultGradientsPicker = (props: DefaultGradientsPickerProps) => {
  return (
    <div className="py-3 border-b border-b-inversed/15">
      <div className={"overflow-scroll"}>
        <div className="flex w-fit gap-2 px-3">
          <button
            type={"button"}
            className={
              "w-12 h-16 rounded-md border border-inversed/10 bg-inversed/5 grid place-items-center"
            }
            onClick={props.onRemove}
          >
            <Icon28MinusOutline />
          </button>

          <div className={"w-px rounded-full bg-inversed/10 my-1.5"} />

          {defaultGradients.map((gradient) => (
            <DefaultGradientItem
              key={JSON.stringify(gradient)}
              colors={gradient}
              onClick={() => props.onChoose?.(gradient)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
