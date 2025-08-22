import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  className = "",
}: PageLayoutProps) {
  return <div className={`${className} pt-0`}>{children}</div>;
}
