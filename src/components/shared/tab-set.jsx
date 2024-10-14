import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// Import utils
import { ClassNameUtils } from "../../utils/class_name";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={ClassNameUtils.cn(
      "inline-flex h-14 items-center justify-center rounded-md",
      "bg-gray-800/50", // Nền tối hơn
      "backdrop-filter backdrop-blur-lg",
      "p-1",
      "text-gray-300",
      "border border-gray-700",
      "shadow-lg",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={ClassNameUtils.cn(
      "mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium",
      "ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "bg-white/10 border-sm my-1",
      "data-[state=active]:bg-blue-500 data-[state=active]:text-white", // Thay đổi ở đây
      "data-[state=active]:shadow-sm",
      "hover:bg-white/20", // Thêm hiệu ứng hover
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={ClassNameUtils.cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
