import { Headline } from "@/shared/ui/typography"
import { Icon24ChevronCompactRight } from "@vkontakte/icons"
import { Subhead } from "@vkontakte/vkui"
import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

type ProjectCardProps = {
  title?: string | null
  updatedAt: Date
  onClick?: () => void
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { t } = useTranslation()

  return (
    <button type="button" onClick={props.onClick}>
      <div className="flex flex-col gap-1">
        <div className="bg-surface rounded-lg aspect-[4/3]" />
        <div className="flex items-center">
          <div className="flex-1 flex flex-col">
            <Headline
              className="line-clamp-1"
              children={props.title ?? t("untitled-project-placeholder")}
            />
            <Subhead
              className="text-primary/30"
              children={DateTime.fromJSDate(props.updatedAt).toRelative()}
            />
          </div>
          <Icon24ChevronCompactRight className="text-inversed/30" />
        </div>
      </div>
    </button>
  )
}
