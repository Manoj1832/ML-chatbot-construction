import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#111111] text-[#FFFFFF] hover:bg-[#222222]",
        destructive: "bg-[#222222] text-[#FFFFFF] hover:bg-[#111111]",
        outline: "border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#FFFFFF]",
        secondary: "bg-[#F5F5F5] text-[#111111] border border-[#EAEAEA] hover:bg-[#EAEAEA]",
        ghost: "text-[#111111] hover:bg-[#F5F5F5]",
        link: "text-[#111111] underline-offset-4 hover:underline",
        /* Monochrome mappings for legacy variant names */
        gold: "bg-[#111111] text-[#FFFFFF] hover:bg-[#222222] font-medium",
        "outline-gold": "border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] hover:border-[#111111] hover:bg-[#F5F5F5]",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm",
        sm: "h-10 px-4 text-xs",
        lg: "h-12 px-7 text-sm",
        xl: "h-13 px-8 py-3.5 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
