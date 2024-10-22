import { useCloudStorage } from "@/shared/hooks/use-cloud-storage"
import { useModalState } from "@/shared/hooks/use-modal-state"
import { Header } from "@/shared/ui/header"
import { Modal } from "@/shared/ui/modal"
import { Screen } from "@/shared/ui/screen"
import { Title } from "@/shared/ui/typography"
import { trpc } from "@/shared/utils/trpc"
import {
  Icon20DiamondOutline,
  Icon20HelpOutline,
  Icon28Cards2,
  Icon28Clock,
  Icon28ViewOutline,
} from "@vkontakte/icons"
import bridge, { BannerAdLocation } from "@vkontakte/vk-bridge"
import { Button, ConfigProvider, Div, Group, IconButton } from "@vkontakte/vkui"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Feature } from "../premium"
import { BottomProjectsBar } from "./components/bottom-projects-bar"
import { LoadingProjectsErrorPlaceholder } from "./components/loading-projects-error-placeholder"
import { LoadingProjectsPlaceholder } from "./components/loading-projects-placeholder"
import { NoProjectsPlaceholder } from "./components/no-projects-placeholder"
import { ProjectsList } from "./components/projects-list"
import { useClearProject } from "./hooks/use-clear-project"

export const Projects = () => {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const projects = trpc.project.getMany.useQuery()

  const premium = trpc.user.premium.useQuery()

  const onboardingModal = useModalState()

  const [onboardingClosed, setOnboardingClosed] = useCloudStorage(
    "onboardingClosed",
    false
  )

  useEffect(() => {
    if (onboardingClosed.isSuccess && onboardingClosed.data === false) {
      onboardingModal.open()
    }
  }, [onboardingModal, onboardingClosed])

  useClearProject()

  useEffect(() => {
    if (!premium.data?.isPremium && premium.isSuccess) {
      bridge.send("VKWebAppShowBannerAd", {
        banner_location: BannerAdLocation.BOTTOM,
        can_close: true,
      })
    } else bridge.send("VKWebAppHideBannerAd")

    return () => {
      bridge.send("VKWebAppHideBannerAd")
    }
  }, [premium.data?.isPremium, premium.isSuccess])

  return (
    <Screen className="pb-safe-area-bottom max-h-screen">
      <Header
        title={t("my-projects-title")}
        after={
          <div className="flex gap-4 pr-4">
            <IconButton
              onClick={onboardingModal.open}
              children={<Icon20HelpOutline />}
            />
            <IconButton
              onClick={() => navigate("/premium")}
              children={<Icon20DiamondOutline />}
            />
          </div>
        }
      />

      {projects.isSuccess && projects.data.length > 0 && (
        <>
          <ProjectsList data={projects.data} />
          <BottomProjectsBar createdProjectsCount={projects.data.length} />
        </>
      )}
      {projects.data?.length === 0 && <NoProjectsPlaceholder />}
      {projects.isError && <LoadingProjectsErrorPlaceholder />}
      {projects.isLoading && <LoadingProjectsPlaceholder />}

      <Modal {...onboardingModal}>
        <Title className="text-center p-4" children={"Добро пожаловать!"} />
        <ConfigProvider platform="android">
          <Group>
            <Feature
              icon={<Icon28Cards2 />}
              title={"Красивое меню для вашего сообщества"}
              subtitle={"Легко создавайте крутые обложки для вашего меню"}
            />
          </Group>
          <Group>
            <Feature
              icon={<Icon28Clock />}
              title={"За пять минут"}
              subtitle={"Сэкономьте время на обложки не потеряв в качестве"}
            />
          </Group>
          <Group>
            <Feature
              icon={<Icon28ViewOutline />}
              title={"Предпросмотр меню"}
              subtitle={"Посмотрите на то, как будет выглядеть ваше меню"}
            />
          </Group>
        </ConfigProvider>
        <Div>
          <Button
            onClick={() => {
              setOnboardingClosed.mutate(true)
              onboardingModal.close()
            }}
            stretched
            size="l"
            children={"Круто"}
          />
        </Div>
      </Modal>
    </Screen>
  )
}
