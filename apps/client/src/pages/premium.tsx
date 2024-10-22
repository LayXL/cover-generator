import { BackButton } from "@/shared/ui/back-button"
import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { Text } from "@/shared/ui/typography"
import { trpc } from "@/shared/utils/trpc"
import {
  Icon28BlockOutline,
  Icon28DocumentOutline,
  Icon28PictureStackOutline,
  Icon56DiamondOutline,
} from "@vkontakte/icons"
import bridge from "@vkontakte/vk-bridge"
import { Button, Group, Placeholder } from "@vkontakte/vkui"
import type { ReactNode } from "react"
import { isIOS } from "react-device-detect"
import { useTranslation } from "react-i18next"

export const Feature = (props: {
  icon: ReactNode
  title: string
  subtitle: string
}) => {
  return (
    <div className="px-4 flex items-center gap-2">
      <div className="size-7 text-accent-static">{props.icon}</div>
      <div className="flex flex-col">
        <p>{props.title}</p>
        <p className="text-inversed/50 text-sm">{props.subtitle}</p>
      </div>
    </div>
  )
}

export const Premium = () => {
  const { t } = useTranslation()
  const utils = trpc.useUtils()
  const { data } = trpc.user.premium.useQuery()

  return (
    <Screen>
      <Header before={<BackButton />} title={t("premium-page-title")} />

      <div className="flex flex-col flex-1">
        <Group>
          <Placeholder
            icon={<Icon56DiamondOutline className="text-accent-static" />}
            header={t(
              data?.isPremium
                ? "premium-page-header-bought"
                : "premium-page-header"
            )}
            children={t(
              data?.isPremium ? "premium-page-text-bought" : "premium-page-text"
            )}
          />
        </Group>

        <Group>
          <Feature
            icon={<Icon28DocumentOutline />}
            title={t("premium-more-projects-feature-title")}
            subtitle={t("premium-more-projects-feature-subtitle")}
          />
        </Group>

        <Group>
          <Feature
            icon={<Icon28PictureStackOutline />}
            title={t("premium-more-covers-feature-title")}
            subtitle={t("premium-more-covers-feature-subtitle")}
          />
        </Group>

        <Group>
          <Feature
            icon={<Icon28BlockOutline />}
            title={t("premium-no-ads-feature-title")}
            subtitle={t("premium-no-ads-feature-subtitle")}
          />
        </Group>
      </div>

      {!data?.isPremium && (
        <div className="p-4 mb-safe-area-bottom">
          {!isIOS ? (
            <Button
              stretched
              size="l"
              children={t("buy-premium-button")}
              onClick={() => {
                bridge
                  .send("VKWebAppShowOrderBox", {
                    type: "item",
                    item: "premium",
                  })
                  .then(() => {
                    utils.user.premium.invalidate()
                  })
              }}
            />
          ) : (
            <Text
              className="text-center"
              children={t("not-supported-platfrom-warning")}
            />
          )}
        </div>
      )}
    </Screen>
  )
}
