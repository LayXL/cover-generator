import { isObject } from "./isObject"

export function deepMerge<
  T extends Record<string, any>,
  U extends Record<string, any>,
>(obj1: T, obj2: U): T & U {
  const result: Record<string, any> = { ...obj1 }

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (isObject(obj2[key]) && isObject(result[key])) {
        // Recursively merge nested objects
        result[key] = deepMerge(result[key], obj2[key])
      } else {
        // Copy or overwrite the property
        result[key] = obj2[key]
      }
    }
  }

  return result as T & U
}
