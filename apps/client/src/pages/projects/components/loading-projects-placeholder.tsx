import { repeatElement } from "@/shared/utils/repeatElement"

export const LoadingProjectsPlaceholder = () => {
  return (
    <div className="grid gap-2 grid-cols-2 container mx-auto sm:grid-cols-3 lg:grid-cols-4 px-4">
      {repeatElement(
        <div className="w-full aspect-[4/3] animate-pulse bg-inversed/5 rounded-xl" />,
        20
      )}
    </div>
  )
}
