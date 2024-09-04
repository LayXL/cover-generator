import { VK } from "vk-io"

if (!process.env.VK_SERVICE_SECRET) {
  throw new Error("VK_SERVICE_SECRET is not defined")
}

export const vkApi = new VK({
  token: process.env.VK_SERVICE_SECRET,
  language: "ru",
})
