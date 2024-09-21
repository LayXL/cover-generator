import { type FC, createElement, useCallback, useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"

type DebounceProps<T> = {
  value: T
  delay?: number
  children: FC<{ set: (value: T) => void; current: T }>
  onChange?: (value: T) => void
}

export function Debounce<T>(props: DebounceProps<T>) {
  const [value, setValue] = useState(props.value)

  const [debounced] = useDebounceValue(value, props.delay ?? 500)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    props.onChange?.(debounced)
  }, [debounced])

  const callback = useCallback(props.children, [])

  return createElement(callback, {
    current: value,
    set: (newValue) => {
      setValue(newValue)
    },
  })
}
