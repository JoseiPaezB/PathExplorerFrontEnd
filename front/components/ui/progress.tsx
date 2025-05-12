"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    showAnimation?: boolean;
    animationDuration?: number;
  }
>(
  (
    {
      className,
      value,
      indicatorClassName,
      showAnimation = true,
      animationDuration = 1.5,
      ...props
    },
    ref
  ) => {
    const [hasAnimated, setHasAnimated] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
      // If animation is disabled or has already run, set the value directly
      if (!showAnimation || hasAnimated) {
        setDisplayValue(value || 0);
        return;
      }

      // Initial animation
      const timer = setTimeout(() => {
        setDisplayValue(value || 0);
        setHasAnimated(true);
      }, 100);

      return () => clearTimeout(timer);
    }, [value, showAnimation, hasAnimated]);

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
          className
        )}
        {...props}
      >
        {showAnimation ? (
          <motion.div
            className={cn(
              "h-full w-full flex-1 bg-primary transition-colors",
              indicatorClassName
            )}
            initial={{ width: 0 }}
            animate={{ width: `${displayValue}%` }}
            transition={{
              duration: animationDuration,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        ) : (
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 bg-primary transition-all",
              indicatorClassName
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        )}
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
