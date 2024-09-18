import { useModalState } from "@/shared/hooks/useModalState"
import { Header } from "@/shared/ui/header"
import { Modal } from "@/shared/ui/modal"
import { cn } from "@/shared/utils/cn"
import { Icon24Dismiss } from "@vkontakte/icons"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { hexColor } from "../lib/checkIsValidHex"
import { ColorPickerModal } from "./color-picker-modal"

type ColorInputProps = {
  value?: `#${string}`
  onChange?: (value: `#${string}`) => void
  isOpeningColorPicker?: boolean
}

export const ColorInput = (props: ColorInputProps) => {
  const { t } = useTranslation()

  const [value, setValue] = useState<string>(
    props.value?.replaceAll("#", "").toLocaleUpperCase() ?? ""
  )

  useEffect(() => {
    setValue(props.value?.replaceAll("#", "").toLocaleUpperCase() ?? "")
  }, [props.value])

  const colorPickerModal = useModalState()

  return (
    <>
      <input
        className={cn(
          "flex-1 h-9 px-3 rounded-[10px] border border-inversed/10 outline-none w-full",
          props.isOpeningColorPicker &&
            "cursor-default caret-transparent select-none"
        )}
        value={`#${value}`}
        onChange={
          props.isOpeningColorPicker
            ? undefined
            : ({ target: { value } }) => {
                setValue(value.replaceAll("#", "").toLocaleUpperCase())

                const parsed = hexColor.safeParse(value)
                if (!parsed.success) return

                props.onChange?.(parsed.data)
              }
        }
        onClick={
          props.isOpeningColorPicker ? () => colorPickerModal.open() : undefined
        }
      />
      {props.isOpeningColorPicker && (
        <Modal {...colorPickerModal}>
          <Header
            title={t("pick-color-modal-title")}
            after={
              <div className="pr-4">
                <Icon24Dismiss
                  className="cursor-pointer"
                  onClick={colorPickerModal.close}
                />
              </div>
            }
          />
          <ColorPickerModal
            color={`#${value}`}
            onChange={(color) => {
              setValue(value.replaceAll("#", "").toLocaleUpperCase())
              props.onChange?.(`#${color}`)
            }}
          />
        </Modal>
      )}
    </>
  )
}
