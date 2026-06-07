import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-[#FF6B35]/10 text-[#FF6B35]",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        new: "bg-blue-100 text-blue-700",
        trending: "bg-purple-100 text-purple-700",
        outline: "border border-gray-200 text-gray-600",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
