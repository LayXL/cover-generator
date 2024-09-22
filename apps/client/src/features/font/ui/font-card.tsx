import { Text } from "@/shared/ui/typography"
import { cn } from "@/shared/utils/cn"
import { motion } from "framer-motion"
import { useState } from "react"
import { FontFamily } from "./font-family"

type FontCardProps = {
  title: string
  font: string
  isSelected?: boolean
  onClick?: () => void
}

export const FontCard = (props: FontCardProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.button
      className={cn(
        "w-32 h-10 bg-inversed/5 border-2 border-transparent grid place-items-center rounded-xl",
        props.isSelected && "border-accent"
      )}
      whileHover={{ opacity: 0.5 }}
      whileTap={{ scale: 0.9 }}
      onClick={props.onClick}
      style={{ fontFamily: props.font }}
    >
      {loaded ? (
        <Text
          className={cn(
            "text-primary/30 text-center overflow-hidden h-[1lh]",
            props.isSelected && "text-primary"
          )}
          children={props.title}
        />
      ) : (
        <div
          className="h-[1lh] rounded-full animate-pulse bg-inversed/5 overflow-hidden text-center text-transparent px-1"
          children={props.title}
        />
      )}
      <FontFamily name={props.font} onLoaded={() => setLoaded(true)} />
    </motion.button>
  )
}
