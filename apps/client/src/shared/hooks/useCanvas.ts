import type { RefObject } from "react"

export const useCanvas = (ref: RefObject<HTMLCanvasElement>) => {
  const canvas = ref.current

  if (!canvas) return { canvas: null, ctx: null }
  const ctx = canvas.getContext("2d")

  if (!ctx) return { canvas: null, ctx: null }

  return { canvas, ctx }
}
