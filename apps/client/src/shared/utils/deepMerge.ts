import { isObject } from "./isObject"

export function deepMerge<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(obj1: T, obj2: U): T & U {
  const result: Record<string, unknown> = { ...obj1 }

  for (const key in obj2) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (obj2.hasOwnProperty(key)) {
      if (isObject(obj2[key]) && isObject(result[key])) {
        result[key] = deepMerge(result[key], obj2[key])
      } else {
        result[key] = obj2[key]
      }
    }
  }

  return result as T & U
}
