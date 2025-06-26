import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/common/classnames";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-primary text-primary hover:shadow-[0_0_8px] hover:shadow-primary/70 hover:text-primary-foreground",
        secondary:
          "border-purple-500 text-purple-400 hover:shadow-[0_0_8px] hover:shadow-purple-500/70 hover:text-purple-200",
        destructive:
          "border-red-500 text-red-400 hover:shadow-[0_0_8px] hover:shadow-red-500/70 hover:text-red-200",
        outline:
          "border-zinc-600 text-zinc-300 hover:shadow-[0_0_8px] hover:shadow-zinc-400/70 hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
