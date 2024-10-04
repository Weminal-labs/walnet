import * as React from "react";
import { cva } from "class-variance-authority";

// Import utils
import { ClassNameUtils } from "../../utils/class_name";

const imageVariants = cva("", {
  variants: {
    rounded: {
      true: "rounded-lg",
    },
  },
  defaultVariants: {
    rounded: false,
  },
});

const Image = React.forwardRef(({ className, rounded, ...props }, ref) => {
  return (
    <img
      className={ClassNameUtils.cn(imageVariants({ rounded, className }))}
      ref={ref}
      {...props}
    />
  );
});
Image.displayName = "Image";

export { Image, imageVariants };
