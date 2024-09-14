import { CUBIC_BEZIER } from "@/shared/utils/animations"
import { type MotionValue, motion, useTransform } from "framer-motion"
import type { Cover, DeepPartial } from "shared/types"
import { useWindowSize } from "usehooks-ts"
import { CoverCarouselItemHeader } from "./cover-carousel-item-header"
import { CoverRenderer } from "./cover-renderer"

type CoverCarouselItemProps = {
  index: number
  currentCoverIndex: number
  cover: DeepPartial<Cover>
  x: MotionValue<number>
  onChangeTitle?: (value: string) => void
  onRemove?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  isInvisible?: boolean
}
export const CoverCarouselItem = (props: CoverCarouselItemProps) => {
  const { width = 0 } = useWindowSize()
  const itemX = useTransform(
    props.x,
    (latestX) => (latestX ?? 0) + props.index * (width - 32)
  )

  const scale = useTransform(itemX, [-width, 0, width], [0.75, 1, 0.75])
  const opacity = useTransform(itemX, [-width, 0, width], [-0.75, 1, -0.75])

  return (
    <motion.div
      className="flex flex-col gap-2 min-w-[calc(100vw-32px)] h-full"
      style={{ scale }}
    >
      <motion.div
        animate={{ opacity: props.isInvisible ? 0 : 1 }}
        transition={{ duration: 0.3, ease: CUBIC_BEZIER }}
      >
        <motion.div style={{ opacity }}>
          <CoverCarouselItemHeader
            title={props.cover.title}
            onChangeTitle={props.onChangeTitle}
            onRemove={props.onRemove}
            canUndo={props.canUndo}
            canRedo={props.canRedo}
            onUndo={props.onUndo}
            onRedo={props.onRedo}
          />
        </motion.div>
      </motion.div>

      <div className="w-full h-[calc(100%-52px)] xs:h-[240px] sm:h-[300px]">
        <div className="w-full aspect-[376/256] xs:w-auto xs:h-full xs:mx-auto">
          <CoverRenderer
            {...props.cover}
            id={
              props.index === props.currentCoverIndex
                ? "cover-preview"
                : undefined
            }
            overrideClassName
            className="rounded-xl aspect-[376/256] size-full"
          />
        </div>
      </div>
    </motion.div>
  )
}
