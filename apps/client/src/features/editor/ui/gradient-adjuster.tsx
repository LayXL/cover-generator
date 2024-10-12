import { ColorInput } from "@/features/color-picker/ui/color-input"
import { Icon24Arrow2SquarepathOutline } from "@vkontakte/icons"
import { motion } from "framer-motion"

type GradientAdjusterProps = {
  colors: `#${string}`[]
  onChange: (colors: `#${string}`[]) => void
}

export const GradientAdjuster = (props: GradientAdjusterProps) => {
  return (
    <div className="p-1.5 flex flex-col gap-1.5 bg-inversed/5 rounded-xl">
      <div className="border border-inversed/10 h-9 rounded-[10px] overflow-hidden">
        <motion.div
          className="size-full"
          animate={{
            background: `linear-gradient(90deg, ${props.colors.join(", ")})`,
          }}
        />
      </div>
      <div className="flex">
        <ColorInput
          value={props.colors[0]}
          onChange={(color) => {
            props.onChange([color, props.colors[1]])
          }}
          isOpeningColorPicker
        />
        <button
          className="px-3 grid place-items-center"
          type="button"
          onClick={() => props.onChange([...props.colors.reverse()])}
        >
          <Icon24Arrow2SquarepathOutline
            color="currentColor"
            className="text-primary/30"
          />
        </button>
        <ColorInput
          value={props.colors[1]}
          onChange={(color) => {
            props.onChange([props.colors[0], color])
          }}
          isOpeningColorPicker
        />
      </div>
    </div>
  )
}
