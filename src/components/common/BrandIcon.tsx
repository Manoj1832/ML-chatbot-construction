import { cn } from "@/lib/utils";

export type BrandIconName =
  | "architectural-design"
  | "building-approval"
  | "commercial-construction"
  | "contact-mail"
  | "location-pin"
  | "phone"
  | "process-01-consultation"
  | "process-02-planning"
  | "process-03-estimation"
  | "process-04-construction"
  | "process-05-inspection"
  | "process-06-handover"
  | "quality-assurance"
  | "residential-construction"
  | "structural-design"
  | "whatsapp";

interface BrandIconProps {
  name: BrandIconName;
  className?: string;
  invert?: boolean;
  alt?: string;
}

export function BrandIcon({ name, className, invert = false, alt = "" }: BrandIconProps) {
  return (
    <img
      src={`/assets/icons/${name}.svg`}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      width={24}
      height={24}
      className={cn(
        "w-6 h-6 shrink-0 select-none",
        invert && "brightness-0 invert",
        className
      )}
      loading="lazy"
      decoding="async"
    />
  );
}
