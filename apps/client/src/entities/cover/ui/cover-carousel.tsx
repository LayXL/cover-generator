import { CoverCarouselItem } from "@/entities/cover/ui/cover-carousel-item"
import { animate, motion, useMotionValue } from "framer-motion"
import { useEffect } from "react"
import type { Cover, DeepPartial } from "shared/types"
import { useWindowSize } from "usehooks-ts"

type CoverCarouselsProps = {
  covers: DeepPartial<Cover>[]
  currentCoverIndex: number
  setCurrentCoverIndex: (index: number) => void
  onChangeTitle?: (value: string) => void
  onRemove?: () => void
}

export const CoverCarousel = (props: CoverCarouselsProps) => {
  const { width = 0 } = useWindowSize()
  const snapPoints = props.covers.map((_, index) => -index * (width - 32))

  const x = useMotionValue(snapPoints[props.currentCoverIndex])

  useEffect(() => {
    // x.set(snapPoints[props.currentCoverIndex])

    animate(x, snapPoints[props.currentCoverIndex], {
      type: "spring",
      duration: 0.3,
      ease: "easeInOut",
    })
  }, [x, props.currentCoverIndex, snapPoints, x.set])

  const handleDragEnd = () => {
    const closestPoint = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - x.get()) < Math.abs(prev - x.get()) ? curr : prev
    )

    animate(x, closestPoint, { type: "spring", stiffness: 300, damping: 30 })

    props.setCurrentCoverIndex(snapPoints.indexOf(closestPoint))
  }

  return (
    <motion.div
      className="flex px-4"
      drag="x"
      style={{ x }}
      dragConstraints={{
        left: -(width - 32) * (props.covers.length - 1),
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    >
      {props.covers.map((cover, i) => (
        <div key={cover.uuid}>
          <CoverCarouselItem
            index={i}
            currentCoverIndex={props.currentCoverIndex}
            cover={cover}
            x={x}
            onChangeTitle={
              props.currentCoverIndex === i ? props.onChangeTitle : undefined
            }
            onRemove={
              props.currentCoverIndex === i ? props.onRemove : undefined
            }
          />
        </div>
      ))}
    </motion.div>
  )
}
