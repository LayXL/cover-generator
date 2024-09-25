import { Header } from "@/shared/ui/header"
import { Screen } from "@/shared/ui/screen"
import { trpc } from "@/shared/utils/trpc"
import { useScrollLock } from "@vkontakte/vkui"
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

  useClearProject()
  useScrollLock()

  return (
    <Screen className="pb-safe-area-bottom max-h-screen">
      <Header title={t("my-projects-title")} />

      {projects.isSuccess && projects.data.length > 0 && (
        <>
          <ProjectsList data={projects.data} />
          <BottomProjectsBar />
        </>
      )}
      {projects.data?.length === 0 && <NoProjectsPlaceholder />}
      {projects.isError && <LoadingProjectsErrorPlaceholder />}
      {projects.isLoading && <LoadingProjectsPlaceholder />}
    </Screen>
  )
}
