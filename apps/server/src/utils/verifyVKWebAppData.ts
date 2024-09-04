import * as crypto from "node:crypto"

export const verifyVKWebAppData = (vkInitData?: string | null): boolean => {
  let sign: string | undefined
  const queryParams: { key: string; value: string }[] = []

  const processQueryParam = (key: string, value: string) => {
    if (typeof value === "string") {
      if (key === "sign") {
        sign = value
      } else if (key.startsWith("vk_")) {
        queryParams.push({ key, value })
      }
    }
  }

  const formattedSearch = vkInitData?.startsWith("?")
    ? vkInitData.slice(1)
    : vkInitData

  for (const param of formattedSearch?.split("&") ?? []) {
    const [key, value] = param.split("=")
    processQueryParam(key, value)
  }

  if (!sign || queryParams.length === 0) return false

  const queryString = queryParams
    .sort((a, b) => a.key.localeCompare(b.key))
    .reduce((acc, { key, value }, idx) => {
      return `${acc + (idx === 0 ? "" : "&")}${key}=${encodeURIComponent(value)}`
    }, "")

  const paramsHash = crypto
    .createHmac("sha256", <string>Bun.env.VK_CLIENT_SECRET)
    .update(queryString)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=$/, "")

  return paramsHash === sign
}
