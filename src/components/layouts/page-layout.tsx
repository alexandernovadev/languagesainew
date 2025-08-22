import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  className = "space-y-6",
}: PageLayoutProps) {
  return <div className={`${className} pt-0`}>{children}</div>;
}
