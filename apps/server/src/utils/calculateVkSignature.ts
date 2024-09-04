import md5 from "md5"

export const verifyVKSignature = (params: Record<string, string>): boolean => {
  const keys = Object.keys(params)
  keys.sort()

  let str = ""
  keys.map((item) => {
    if (item !== "sig") {
      str += `${item}=${params[item]}`
    }
  })

  str = str + Bun.env.VK_CLIENT_SECRET

  const calculatedSignature = md5(str)

  return calculatedSignature === params.sig
}
