import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

export function HomeSplit({
  image,
  imageRight,
  dark = false,
  objectPosition = "center",
  children,
}: {
  image: string;
  imageRight: boolean;
  dark?: boolean;
  objectPosition?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("px-(--gutter) py-16 lg:py-24", dark ? "bg-[#111] text-white" : "bg-[#f7f6f3] text-ink")}>
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className={cn(imageRight ? "lg:order-1" : "lg:order-2")}>{children}</div>
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden",
            imageRight ? "lg:order-2" : "lg:order-1",
          )}
        >
          <Photo
            src={image}
            tone="paper"
            alt=""
            objectPosition={objectPosition}
            className="absolute inset-0"
            sizes="(min-width: 1025px) 40vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
