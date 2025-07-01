"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>()
    const [value, setValue] = React.useState(props.value || "")

    React.useImperativeHandle(ref, () => textareaRef.current!)

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        const scrollHeight = textarea.scrollHeight
        const maxHeight = 200 // Maximum height in pixels
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
        textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden"
      }
    }, [])

    React.useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      onChange?.(e)
      // Delay height adjustment to next tick
      setTimeout(adjustHeight, 0)
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[24px] w-full resize-none bg-transparent px-0 py-0 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={textareaRef}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
AutoResizeTextarea.displayName = "AutoResizeTextarea"

export { AutoResizeTextarea }
