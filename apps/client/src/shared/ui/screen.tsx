import type { ReactNode } from "react"

type ScreenProps = {
  children: ReactNode
}

export const Screen = (props: ScreenProps) => {
  return <div className="min-h-screen flex flex-col">{props.children}</div>
}
