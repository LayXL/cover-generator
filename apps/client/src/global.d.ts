declare global {
  interface Window {
    Telegram: any
  }
}

import "react"

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
