import { BackButton } from "@/shared/ui/back-button"
import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { useTranslation } from "react-i18next"

export const Premium = () => {
  const { t } = useTranslation()

  return (
    <Screen>
      <Header before={<BackButton />} title={t("premium-page-title")} />
    </Screen>
  )
}
