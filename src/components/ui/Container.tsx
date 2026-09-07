import { cn } from "@/lib/utils";

/** 히녹과 동일하게 좌우 여백만 두고 최대폭은 제한하지 않는 풀블리드 컨테이너 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-(--gutter)", className)}>{children}</div>;
}
