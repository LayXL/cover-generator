import type { DefaultGradient } from "../lib/defaultGradients"

type DefaultGradientItemProps = {
  onClick?: () => void
  colors: DefaultGradient
}

export const DefaultGradientItem = (props: DefaultGradientItemProps) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="w-12 h-16 rounded-md border border-inversed/10 overflow-hidden"
    >
      <div
        className="size-full"
        style={{
          background: `linear-gradient(-90deg, ${props.colors.join(", ")})`,
        }}
      />
    </button>
  )
}
