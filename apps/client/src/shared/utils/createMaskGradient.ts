// type Side = "left" | "right" | "top" | "bottom"

export const createMaskGradient = (
  deg: number,
  startPosition = 0,
  endPosition = 1
) => {
  return `linear-gradient(${deg}deg, rgba(0, 0, 0, 1) ${startPosition * 100}%, rgba(0, 0, 0, 0) ${endPosition * 100}%)`
}
