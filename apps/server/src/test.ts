import "dotenv/config"

if (!Bun.env.TEST_BEARER) {
  throw new Error("TEST_BEARER is not defined")
}

const headers = new Headers()

headers.append("Content-Type", "application/json")
headers.append("Authorization", Bun.env.TEST_BEARER)
headers.append("Accept", "*/*")
headers.append("Accept-Language", "en-US,en;q=0.9")
headers.append("Accept-Encoding", "gzip, deflate")
headers.append("Connection", "keep-alive")

// const BASE_URL = `${Bun.env.TELEGRAM_WEB_APP_URL}/api`
