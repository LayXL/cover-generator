import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { useEffect } from "react"
import { useWindowSize } from "usehooks-ts"
import { Cover } from "../../../shared/types"
import { CoverRenderer } from "./cover-renderer"

type CoverCarouselsProps = {
  covers: Cover[]
  currentCoverIndex: number
  setCurrentCoverIndex: (index: number) => void
}

export const CoverCarousel = (props: CoverCarouselsProps) => {
  const { width = 0 } = useWindowSize()
  const snapPoints = props.covers.map((_, index) => -index * (width - 32))

  const x = useMotionValue(snapPoints[props.currentCoverIndex])

  useEffect(() => {
    x.set(snapPoints[props.currentCoverIndex])
  }, [props.currentCoverIndex, snapPoints])

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
        <CoverCarouselItem
          key={i}
          index={i}
          currentCoverIndex={props.currentCoverIndex}
          cover={cover}
          x={x}
        />
      ))}
    </motion.div>
  )
}

type CoverCarouselItemProps = {
  index: number
  currentCoverIndex: number
  cover: Cover
  x: MotionValue<number>
}

const CoverCarouselItem = (props: CoverCarouselItemProps) => {
  const { width = 0 } = useWindowSize()
  const itemX = useTransform(
    props.x,
    (latestX) => latestX + props.index * (width - 32)
  )

  const scale = useTransform(itemX, [-width, 0, width], [0.75, 1, 0.75])

  return (
    <div className="w-[calc(100vw-32px)]">
      <motion.div
        className="rounded-xl overflow-hidden"
        id={
          props.index === props.currentCoverIndex ? "cover-preview" : undefined
        }
        style={{
          scale,
        }}
      >
        <CoverRenderer {...props.cover} />
      </motion.div>
    </div>
  )
}
