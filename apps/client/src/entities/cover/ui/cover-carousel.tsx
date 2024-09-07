import { ResizableInput } from "@/shared/ui/resizable-input"
import { Icon24Delete, Icon24Write } from "@vkontakte/icons"
import {
  type MotionValue,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import type { Cover, DeepPartial } from "shared/types"
import { useWindowSize } from "usehooks-ts"
import { CoverRenderer } from "./cover-renderer"

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
    x.set(snapPoints[props.currentCoverIndex])
  }, [props.currentCoverIndex, snapPoints, x.set])

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

type CoverCarouselItemProps = {
  index: number
  currentCoverIndex: number
  cover: DeepPartial<Cover>
  x: MotionValue<number>
  onChangeTitle?: (value: string) => void
  onRemove?: () => void
}

const CoverCarouselItem = (props: CoverCarouselItemProps) => {
  const { t } = useTranslation()

  const { width = 0 } = useWindowSize()
  const itemX = useTransform(
    props.x,
    (latestX) => latestX + props.index * (width - 32)
  )

  const scale = useTransform(itemX, [-width, 0, width], [0.75, 1, 0.75])

  const titleInputRef = useRef<HTMLInputElement>(null)

  return (
    <motion.div className="flex flex-col gap-2" style={{ scale }}>
      <div className="flex items-center px-1.5 gap-1.5">
        <div className="flex flex-1 gap-1.5">
          <ResizableInput
            ref={titleInputRef}
            type="text"
            placeholder={t("untitled-cover-placeholder")}
            value={props.cover.title ?? ""}
            onChange={(e) => props.onChangeTitle?.(e.currentTarget.value)}
            className="text-primary placeholder:text-inversed/60"
          />
          <Icon24Write
            className="text-inversed/50"
            onClick={() => titleInputRef.current?.focus()}
          />
        </div>
        <button type="button" onClick={props.onRemove}>
          <Icon24Delete className="text-inversed/50" />
        </button>
      </div>

      <div className="w-[calc(100vw-32px)]">
        <div
          className="rounded-xl overflow-hidden"
          id={
            props.index === props.currentCoverIndex
              ? "cover-preview"
              : undefined
          }
        >
          <CoverRenderer {...props.cover} />
        </div>
      </div>
    </motion.div>
  )
}
