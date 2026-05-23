import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold", {
  variants: { variant: { default: "border-transparent bg-brand-light text-brand", outline: "border-paper-line text-ink-soft", destructive: "border-transparent bg-red-50 text-red-700" } },
  defaultVariants: { variant: "default" },
});
export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
