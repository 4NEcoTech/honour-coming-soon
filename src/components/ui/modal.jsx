"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Modal = React.forwardRef(
  (
    {
      className,
      children,
      position = "center",
      size = "md",
      animation = "zoom",
      open = false,
      onClose,
      closeOnOutsideClick = true,
      showCloseButton = true,
      title,
      ...props
    },
    ref,
  ) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === "Escape" && onClose) {
          onClose()
        }
      }

      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"

      return () => {
        document.removeEventListener("keydown", handleEsc)
        document.body.style.overflow = "auto"
      }
    }, [onClose])

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget && closeOnOutsideClick && onClose) {
        onClose()
      }
    }

    // Position classes
    const positionClasses = {
      center: "items-center justify-center",
      top: "items-start justify-center",
      bottom: "items-end justify-center",
    }

    // Size classes for content
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw]",
    }

    // Animation classes
    const animationClasses = {
      fade: "animate-in fade-in duration-300",
      zoom: "animate-in zoom-in-95 duration-300",
      slide: "animate-in slide-in-from-bottom-5 duration-300",
    }

    if (!open || !mounted) return null

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex p-4 sm:p-6 md:p-8 bg-black/50 backdrop-blur-sm transition-all duration-200",
          positionClasses[position] || positionClasses.center,
        )}
        onClick={handleBackdropClick}
        {...props}
      >
        <div
          className={cn(
            "bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-200",
            sizeClasses[size] || sizeClasses.md,
            animationClasses[animation] || animationClasses.zoom,
            className,
          )}
        >
          {showCloseButton && onClose && (
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}

          {title && (
            <div className="px-6 py-4 border-b">
              {typeof title === "string" ? <h2 className="text-xl font-semibold">{title}</h2> : title}
            </div>
          )}

          <div className={cn(!title && "pt-8")}>{children}</div>
        </div>
      </div>
    )
  },
)

Modal.displayName = "Modal"

export { Modal }

