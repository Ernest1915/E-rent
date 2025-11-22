import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={
        "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm " +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: SectionProps) {
  return (
    <div className={"mb-3 flex flex-col gap-1 " + className}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: SectionProps) {
  return (
    <h2 className={"text-xl font-semibold tracking-tight " + className}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className = "" }: SectionProps) {
  return (
    <div className={"text-sm text-gray-600 leading-relaxed " + className}>
      {children}
    </div>
  );
}
