import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { FC, HTMLAttributes, ReactNode, forwardRef } from "react";

interface LinkBtnProps extends LinkProps, HTMLAttributes<HTMLAnchorElement> {
  varient?: "primary" | "success" | "danger";
}

// eslint-disable-next-line react/display-name
export const LinkBtn = forwardRef<HTMLAnchorElement, LinkBtnProps>(
  ({ varient = "primary", children, className, ...rest }, ref) => {
    return (
      <Link
        ref={ref}
        className={clsx(
          "text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
          varient === "primary" &&
            " bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800",
          varient === "success" &&
            " bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800",
          varient === "danger" &&
            " bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800",
          className
        )}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);
