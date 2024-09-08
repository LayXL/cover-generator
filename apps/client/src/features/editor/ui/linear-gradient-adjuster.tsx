import { FormItem, Slider } from "@vkontakte/vkui"
import { useTranslation } from "react-i18next"
import { GradientAdjuster } from "./gradient-adjuster"

type LinearGradientAdjusterProps = {
  colors?: `#${string}`[]
  angle?: number
  onChange: (opts: { colors?: `#${string}`[]; angle?: number }) => void
}

export const LinearGradientAdjuster = (props: LinearGradientAdjusterProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <FormItem top={t("linear-gradient-angle-slider-caption")}>
        <Slider
          min={0}
          max={360}
          value={props.angle ?? 0}
          onChange={(angle) => {
            props.onChange({ angle, colors: props.colors })
          }}
        />
      </FormItem>
      <div className="px-3">
        <GradientAdjuster
          colors={props.colors ?? []}
          onChange={(colors) => {
            props.onChange({ colors, angle: props.angle })
          }}
        />
      </div>
    </div>
  )
}
