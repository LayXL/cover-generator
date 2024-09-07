import { CUBIC_BEZIER } from "@/shared/utils/animations"
import { cn } from "@/shared/utils/cn"
import { FloatingPortal } from "@floating-ui/react"
import type { ClassValue } from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { type ReactNode, createContext, useContext } from "react"

type ModalProps = {
  isOpened: boolean
  onClose: () => void
  children?: ReactNode
  withoutCloseButton?: boolean
  fullscreen?: boolean
  withoutTint?: boolean
  className?: ClassValue
}

const ModalContext = createContext({
  isOpened: false,
  onClose: () => {},
  close: () => {},
})

export const useModal = () => useContext(ModalContext)

export const Modal = (props: ModalProps) => {
  return (
    <ModalContext.Provider
      value={{
        isOpened: props.isOpened,
        onClose: props.onClose,
        close: props.onClose,
      }}
    >
      <AnimatePresence>
        {props.isOpened && (
          <FloatingPortal root={document.getElementById("root")}>
            <motion.div
              initial={{ backgroundColor: "rgba(0,0,0,0)" }}
              animate={
                !props.withoutTint
                  ? { backgroundColor: "rgba(0,0,0,0.5)" }
                  : undefined
              }
              exit={{
                backgroundColor: "rgba(0,0,0,0)",
                pointerEvents: "none",
              }}
              className={cn(
                "fixed inset-0 h-[var(--ma-viewport-height)] flex flex-col justify-end z-50",
                props.fullscreen && "h-screen justify-stretch"
              )}
              onClick={props.onClose}
            >
              <motion.div
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                exit={{ translateY: "100%" }}
                transition={
                  props.fullscreen
                    ? {
                        ease: CUBIC_BEZIER,
                      }
                    : {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 1.2,
                        duration: 0.3,
                      }
                }
                className={cn(
                  "relative bg-modal rounded-t-3xl pb-16 -mb-16 overflow-hidden",
                  props.fullscreen && "h-full pb-safe-area-bottom -mb-0",
                  props.className
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={cn(props.fullscreen && "overflow-scroll h-full")}
                >
                  {props.children}
                </div>
              </motion.div>
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  )
}
