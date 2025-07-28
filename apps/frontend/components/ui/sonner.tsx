"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "rgba(0, 0, 0, 0)",
          "--normal-text": "rgba(209, 213, 219, 1)",
          "--normal-border": "rgba(12, 5, 27, 0.49)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
