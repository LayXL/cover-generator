import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "../utils/cn"

type ResizableInputProps = InputHTMLAttributes<HTMLInputElement>

export const ResizableInput = forwardRef<HTMLInputElement, ResizableInputProps>(
  (props, ref) => {
    return (
      <div className="relative">
        <p className={cn(props.className, "invisible")}>
          {(props.value?.toString().length ?? 0) > 0
            ? props.value
            : props.placeholder}
        </p>
        <input
          {...props}
          ref={ref}
          className={cn(props.className, "absolute inset-0")}
        />
      </div>
    )
  }
)
