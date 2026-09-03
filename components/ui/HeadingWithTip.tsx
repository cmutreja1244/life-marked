import type { ReactNode } from "react";
import { InfoTip } from "@/components/ui/InfoTip";

export function HeadingWithTip({
  as: Tag = "h2",
  className,
  tip,
  label,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  tip: string;
  label?: string;
  children: ReactNode;
}) {
  const text = typeof children === "string" ? children : "this section";
  return (
    <div className="flex items-start gap-2">
      <Tag className={className}>{children}</Tag>
      <span className="mt-1.5">
        <InfoTip text={tip} label={label ?? `About ${text}`} />
      </span>
    </div>
  );
}
