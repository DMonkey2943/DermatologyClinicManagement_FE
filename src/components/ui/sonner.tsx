"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-success-600 dark:text-success-500" />,
        info: <InfoIcon className="size-5 text-blue-light-500 dark:text-blue-light-500" />,
        warning: <TriangleAlertIcon className="size-5 text-warning-600 dark:text-orange-400" />,
        error: <OctagonXIcon className="size-5 text-error-600 dark:text-error-500" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "flex items-center gap-2 !text-sm",
          success: "!text-success-600 !dark:text-success-500",
          info: "!text-blue-light-500 !dark:text-blue-light-500",
          warning: "!text-warning-600 !dark:text-orange-400",
          error: "!text-error-600 !dark:text-error-500",
          loading: "!text-gray-500",
          description: "!text-xs !font-normal",
        },
        closeButton: true,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
