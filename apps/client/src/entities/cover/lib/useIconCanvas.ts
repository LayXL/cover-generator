import { useQuery } from "@tanstack/react-query"
import type { DeepPartial, Icon } from "shared/types"
import { buildIcon } from "./buildIcon"

export const useIconCanvas = (icon?: DeepPartial<Icon>, pixelRatio = 1) => {
  return useQuery({
    queryKey: ["iconCanvas", icon],
    queryFn: () => (icon ? buildIcon(icon, pixelRatio) : null),
  }).data
}
