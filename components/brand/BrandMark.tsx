import Image from "next/image";
import Link from "next/link";

export function BrandMark({
  href,
  size = "header",
  label = "LifeMarked",
}: {
  href: string;
  size?: "header" | "compact";
  label?: string;
}) {
  const heightClass = size === "compact" ? "h-6" : "h-8 md:h-9";
  return (
    <Link href={href} className="flex items-center" aria-label={label}>
      <Image
        src="/Logo_Wide_NoBG.png"
        alt={label}
        width={180}
        height={40}
        className={`${heightClass} w-auto`}
        priority
      />
    </Link>
  );
}
