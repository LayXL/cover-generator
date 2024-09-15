import { Title } from "@/shared/ui/typography"
import { motion } from "framer-motion"
import { useState } from "react"
import { useTimeout } from "usehooks-ts"

export const FallbackEditor = () => {
  const [showText, setShowText] = useState(false)

  useTimeout(() => setShowText(true), 500)

  return (
    <div className="h-screen grid place-items-center">
      {showText && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Title
            level={2}
            className="animate-pulse font-medium text-center"
            i18nKey="editor-loading-title"
          />
        </motion.div>
      )}
    </div>
  )
}
