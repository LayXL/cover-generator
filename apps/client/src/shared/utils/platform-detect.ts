export const isTelegram = window.Telegram?.WebApp?.initData?.length !== 0
export const isVK = !isTelegram
