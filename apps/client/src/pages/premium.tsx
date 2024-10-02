import { BackButton } from "@/shared/ui/back-button"
import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { Text } from "@/shared/ui/typography"
import bridge from "@vkontakte/vk-bridge"
import { Button } from "@vkontakte/vkui"
import { isIOS } from "react-device-detect"
import { useTranslation } from "react-i18next"

export const Premium = () => {
  const { t } = useTranslation()

  return (
    <Screen>
      <Header before={<BackButton />} title={t("premium-page-title")} />

      <div className="flex flex-col flex-1">{/*  */}</div>

      <div className="p-4">
        {!isIOS ? (
          <Button
            stretched
            size="l"
            children={t("buy-premium-button")}
            onClick={() => {
              bridge
                .send("VKWebAppShowOrderBox", { type: "item", item: "premium" })
                .then((data) => {
                  console.log(data)
                })
            }}
          />
        ) : (
          <Text children={t("not-supported-platfrom-warning")} />
        )}
      </div>
    </Screen>
  )
}
