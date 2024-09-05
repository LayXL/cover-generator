import { Fragment } from "react/jsx-runtime"

export const repeatElement = (element: React.ReactNode, times: number) => {
  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
  return [...Array(times)].map((_, i) => <Fragment key={i}>{element}</Fragment>)
}
