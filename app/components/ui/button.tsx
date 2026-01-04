import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer transition duration-200  items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary-100 focus-visible:ring-primary-100/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 text-light-100 shadow-100 hover:bg-primary-500",
        transparent:
          "bg-transparent text-light-100 shadow-100 hover:bg-light-50",
        destructive:
          "bg-red-500 text-light-100 shadow-100 hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40",
        outline:
          "border-2 border-primary-100 bg-light-100 text-primary-100 shadow-xs hover:bg-primary-100 hover:text-white ",
        secondary: "bg-light-300 text-dark-100 shadow-100 hover:bg-light-400",
        ghost: "text-primary-100 hover:bg-primary-50 hover:text-primary-500",
        link: "text-primary-100 underline-offset-4 hover:underline hover:text-primary-500",
        success:
          "bg-success-500 text-light-100 shadow-100 hover:bg-success-700",
        accent: "bg-pink-500 text-light-100 shadow-100 hover:bg-pink-500/80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
