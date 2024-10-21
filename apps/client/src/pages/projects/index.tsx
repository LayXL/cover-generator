import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { trpc } from "@/shared/utils/trpc"
import bridge, { BannerAdLocation } from "@vkontakte/vk-bridge"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { BottomProjectsBar } from "./components/bottom-projects-bar"
import { LoadingProjectsErrorPlaceholder } from "./components/loading-projects-error-placeholder"
import { LoadingProjectsPlaceholder } from "./components/loading-projects-placeholder"
import { NoProjectsPlaceholder } from "./components/no-projects-placeholder"
import { ProjectsList } from "./components/projects-list"
import { useClearProject } from "./hooks/use-clear-project"

export const Projects = () => {
  const { t } = useTranslation()

  const projects = trpc.project.getMany.useQuery()

  const premium = trpc.user.premium.useQuery()

  useClearProject()

  useEffect(() => {
    if (!premium.data?.isPremium) {
      bridge
        .send("VKWebAppShowBannerAd", {
          banner_location: BannerAdLocation.TOP,
          can_close: true,
        })
        .catch(() => {
          bridge.send("VKWebAppShowBannerAd", {
            banner_location: BannerAdLocation.BOTTOM,
            can_close: true,
          })
        })
    } else bridge.send("VKWebAppHideBannerAd")

    return () => {
      bridge.send("VKWebAppHideBannerAd")
    }
  }, [premium.data?.isPremium])

  return (
    <Screen className="pb-safe-area-bottom max-h-screen">
      <Header title={t("my-projects-title")} />

      {projects.isSuccess && projects.data.length > 0 && (
        <>
          <ProjectsList data={projects.data} />
          <BottomProjectsBar createdProjectsCount={projects.data.length} />
        </>
      )}
      {projects.data?.length === 0 && <NoProjectsPlaceholder />}
      {projects.isError && <LoadingProjectsErrorPlaceholder />}
      {projects.isLoading && <LoadingProjectsPlaceholder />}
    </Screen>
  )
}
