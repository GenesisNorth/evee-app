import { forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

export const Input = forwardRef<TextInput, TextInputProps>(({ className, ...props }, ref) => (
  <TextInput
    ref={ref}
    placeholderTextColor="#9b9fa3"
    className={cn(
      "h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-foreground",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
