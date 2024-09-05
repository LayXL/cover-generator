import { Title } from "@/shared/ui/typography"
import type { ReactNode } from "react"

type HeaderProps = {
  title?: string
  before?: ReactNode
  after?: ReactNode
}

export const Header = (props: HeaderProps) => {
  return (
    <div className="relative h-14 flex items-center justify-center sm:justify-start px-4 gap-4">
      {props.before && (
        <div className="absolute left-4 sm:static">{props.before}</div>
      )}
      <Title level={2} className="font-semibold">
        {props.title}
      </Title>
      {props.after && <div className="absolute right-4">{props.after}</div>}
    </div>
  )
}
