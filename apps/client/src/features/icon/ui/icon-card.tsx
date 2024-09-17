import { cn } from "@/shared/utils/cn"
import { motion } from "framer-motion"
import { Icon } from "./icon"

type IconCardProps = {
  name: string
  isSelected?: boolean
  onClick?: () => void
}

export const IconCard = (props: IconCardProps) => {
  return (
    <motion.div
      className={cn(
        "size-12 grid place-items-center bg-inversed/5 rounded-xl cursor-pointer border-2 border-transparent",
        props.isSelected && "border-accent"
      )}
      whileHover={{ opacity: 0.5 }}
      whileTap={{ scale: 0.9 }}
      onClick={props.onClick}
    >
      <Icon name={props.name} size={28} className="text-inversed/30" />
    </motion.div>
  )
}
