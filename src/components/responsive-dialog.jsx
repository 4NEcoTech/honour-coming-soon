"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const ResponsiveDialog = DialogPrimitive.Root;

const ResponsiveDialogTrigger = DialogPrimitive.Trigger;

const ResponsiveDialogPortal = DialogPrimitive.Portal;

const ResponsiveDialogClose = DialogPrimitive.Close;

const ResponsiveDialogOverlay = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
);
ResponsiveDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ResponsiveDialogContent = React.forwardRef(
  ({ className, containerClassName, children, ...props }, ref) => (
    <ResponsiveDialogPortal>
      <ResponsiveDialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}>
        <div
          className={cn(
            "flex max-h-[calc(100vh-2rem)] flex-col",
            containerClassName
          )}>
          {children}
        </div>
      </DialogPrimitive.Content>
    </ResponsiveDialogPortal>
  )
);
ResponsiveDialogContent.displayName = DialogPrimitive.Content.displayName;

const ResponsiveDialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-4 text-center sm:text-left shrink-0",
      className
    )}
    {...props}
  />
);
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

const ResponsiveDialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4 border-t shrink-0",
      className
    )}
    {...props}
  />
);
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

const ResponsiveDialogTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
ResponsiveDialogTitle.displayName = DialogPrimitive.Title.displayName;

const ResponsiveDialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
ResponsiveDialogDescription.displayName =
  DialogPrimitive.Description.displayName;

const ResponsiveDialogBody = ({ className, ...props }) => (
  <div
    className={cn("flex-1 overflow-y-auto p-4 -mt-1 scrollbar-thin", className)}
    {...props}
  />
);
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";

const ResponsiveDialogCloseButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ResponsiveDialogClose
      ref={ref}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
        className
      )}
      {...props}>
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </ResponsiveDialogClose>
  )
);
ResponsiveDialogCloseButton.displayName = "ResponsiveDialogCloseButton";

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogCloseButton,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
