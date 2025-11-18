import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={
        "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white font-medium text-sm shadow-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
};
