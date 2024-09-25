import { useProjectStore } from "@/shared/store"
import { useEffect } from "react"

export const useClearProject = () => {
  const clearProject = useProjectStore((store) => store.clearProject)

  useEffect(() => {
    clearProject()
  }, [clearProject])
}
