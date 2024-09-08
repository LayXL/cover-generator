import { FormItem, Slider } from "@vkontakte/vkui"
import { useTranslation } from "react-i18next"
import { GradientAdjuster } from "./gradient-adjuster"

type RadialGradientAdjusterProps = {
  colors?: `#${string}`[]
  radius?: number
  onChange: (opts: { colors?: `#${string}`[]; radius?: number }) => void
}

export const RadialGradientAdjuster = (props: RadialGradientAdjusterProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <FormItem top={t("radial-gradient-size-slider-caption")}>
        <Slider
          step={0.01}
          min={0.1}
          max={2}
          value={props.radius ?? 1}
          onChange={(radius) => {
            props.onChange({ radius, colors: props.colors })
          }}
        />
      </FormItem>
      <div className="px-3">
        <GradientAdjuster
          colors={props.colors ?? []}
          onChange={(colors) => {
            props.onChange({ colors, radius: props.radius })
          }}
        />
      </div>
    </div>
  )
}
