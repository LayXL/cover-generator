import { cn } from "@/shared/utils/cn"
import { motion } from "framer-motion"
import { useRef } from "react"
import { Icon } from "./icon"

type IconCardProps = {
  category: "emoji" | "icon"
  name: string
  isSelected?: boolean
  onClick?: () => void
}

export const IconCard = (props: IconCardProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={parentRef}
      className={cn(
        "size-12 grid place-items-center bg-inversed/5 rounded-xl cursor-pointer border-2 border-transparent",
        props.isSelected && "border-accent"
      )}
      whileHover={{ opacity: 0.5 }}
      whileTap={{ scale: 0.9 }}
      onClick={props.onClick}
    >
      {props.category === "icon" && (
        <Icon
          name={props.name}
          size={28}
          className={["text-inversed/30", props.isSelected && "text-accent"]}
        />
      )}
      {props.category === "emoji" && (
        <img
          loading="lazy"
          className="size-7"
          src={`/emojis/${props.name}`}
          alt=""
        />
      )}
    </motion.div>
  )
}
