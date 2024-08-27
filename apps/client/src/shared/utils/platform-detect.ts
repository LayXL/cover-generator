export let isTelegram = window.Telegram?.WebApp?.initData?.length !== 0
export let isVK = !isTelegram
