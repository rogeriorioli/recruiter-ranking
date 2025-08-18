"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionProps extends React.ComponentPropsWithoutRef<"div"> {
  type?: "single" | "multiple";
  collapsible?: boolean;
}

const Accordion = React.forwardRef<
  React.ElementRef<"div">,
  AccordionProps
>(({ className, type = "single", collapsible = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full", className)}
    data-type={type}
    data-collapsible={collapsible}
    {...props}
  />
))
Accordion.displayName = "Accordion"

interface AccordionItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
}

const AccordionItem = React.forwardRef<
  React.ElementRef<"div">,
  AccordionItemProps
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b", className)}
    data-value={value}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & {
    children: React.ReactNode
  }
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
  </button>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>
      {children}
    </div>
  </div>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
