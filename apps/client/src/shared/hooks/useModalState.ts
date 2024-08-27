import { useState } from "react"

export const useModalState = (defaultState = false) => {
  const [isOpened, setIsOpened] = useState(defaultState)

  return {
    isOpened,
    open: () => setIsOpened(true),
    close: () => setIsOpened(false),
    onClose: () => setIsOpened(false),
  }
}
