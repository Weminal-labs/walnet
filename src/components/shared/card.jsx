import React from "react";

// Import utils
import { ClassNameUtils } from "../../utils/class_name";

const Card = React.forwardRef(({ className, shadow, ...props }, ref) => (
  <div
    ref={ref}
    className={ClassNameUtils.cn(
      "rounded-lg border bg-card text-card-foreground",
      shadow ? `shadow-${shadow}` : "",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={ClassNameUtils.cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={ClassNameUtils.cn("body-sm-semibold", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={ClassNameUtils.cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(
  ({ className, fullPadding, ...props }, ref) => (
    <div
      ref={ref}
      className={ClassNameUtils.cn("p-4", fullPadding ? "" : "pt-0", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={ClassNameUtils.cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
