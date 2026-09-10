import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function SectionPage({ children }: { children: React.ReactNode }) {
  return <div className="bg-white pt-(--header-h)">{children}</div>;
}

export function PageFrame({
  children,
  wide = false,
  className,
}: {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("bg-grass-10 pt-(--header-h)", className)}>
      <Container className={cn("mx-auto py-12 sm:py-16 lg:py-24", wide ? "max-w-5xl" : "max-w-3xl")}>
        {children}
      </Container>
    </div>
  );
}
