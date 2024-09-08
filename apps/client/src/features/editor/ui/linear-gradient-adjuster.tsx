import { GradientAdjuster } from "./gradient-adjuster"

type LinearGradientAdjusterProps = {
  colors?: `#${string}`[]
  angle?: number
  onChange: (opts: { colors?: `#${string}`[]; angle?: number }) => void
}

export const LinearGradientAdjuster = (props: LinearGradientAdjusterProps) => {
  return (
    <div className="flex flex-col">
      <div className="px-3">
        <GradientAdjuster
          colors={props.colors ?? []}
          onChange={(colors) => {
            props.onChange({ colors })
          }}
        />
      </div>
    </div>
  )
}
