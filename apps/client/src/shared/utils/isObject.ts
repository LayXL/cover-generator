// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isObject(obj: any): obj is Record<string, any> {
  return obj && typeof obj === "object" && !Array.isArray(obj)
}
