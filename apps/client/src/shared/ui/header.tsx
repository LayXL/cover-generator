import { Title } from "@/shared/ui/typography"
import { cn } from "@/shared/utils/cn"
import type { ReactNode } from "react"

type HeaderProps = {
  title?: string
  before?: ReactNode
  after?: ReactNode
  fixed?: boolean
}

export const Header = (props: HeaderProps) => {
  const fixed = props.fixed

  return (
    <>
      <div
        className={cn(
          "relative min-h-14 flex items-center justify-center sm:justify-start px-4 gap-4",
          fixed && "fixed left-0 top-0 right-0 bg-primary"
        )}
      >
        {props.before && (
          <div className="absolute left-0 sm:static">{props.before}</div>
        )}
        <Title level={2} className="font-semibold">
          {props.title}
        </Title>
        {props.after && <div className="absolute right-0">{props.after}</div>}
      </div>
      {fixed && <div className="h-14" />}
    </>
  )
}
