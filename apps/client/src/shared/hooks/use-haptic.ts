import bridge from "@vkontakte/vk-bridge"

type HapticStyle =
  | "impactHeavy"
  | "impactMedium"
  | "impactLight"
  | "error"
  | "success"
  | "warning"
  | "selection"

export const useHaptic = () => {
  return (style: HapticStyle) => {
    switch (style) {
      case "impactHeavy":
        bridge.send("VKWebAppTapticImpactOccurred", { style: "heavy" })
        break
      case "impactMedium":
        bridge.send("VKWebAppTapticImpactOccurred", { style: "medium" })
        break
      case "impactLight":
        bridge.send("VKWebAppTapticImpactOccurred", { style: "light" })
        break
      case "error":
        bridge.send("VKWebAppTapticNotificationOccurred", { type: "error" })
        break
      case "success":
        bridge.send("VKWebAppTapticNotificationOccurred", { type: "success" })
        break
      case "warning":
        bridge.send("VKWebAppTapticNotificationOccurred", { type: "warning" })
        break
      case "selection":
        bridge.send("VKWebAppTapticSelectionChanged")
        break
    }
  }
}
