import { LinedLink } from "@/components/ui/Buttons";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { AUDIENCES } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * 성인 · 시니어 · 리더십을 좌우 교차 3행으로 보여준다.
 * 3단 그리드가 아닌 이유: 세 대상은 골라 담는 상품이 아니라 서로 다른 실무다.
 * 우선순위는 순서로만 표현하고 세 블록의 크기·구성은 동일하게 둔다.
 *
 * 카피는 사진 위가 아니라 사진 옆 흰 배경에 둔다. sage·paper 톤은 스크림을
 * 걸어도 흰 글자 대비가 3.4:1까지밖에 나오지 않는다. 사진 위에 올리는 것은
 * 불투명 라벨 칩뿐이다.
 */
export function AudienceRows() {
  return (
    <section id="audience" className="py-16 lg:py-24">
      <Container className="space-y-16 lg:space-y-24">
        {AUDIENCES.map((item, i) => (
          <Reveal key={item.id}>
            <article
              id={`audience-${item.id}`}
              className={cn(
                "flex flex-col gap-7 lg:items-center lg:gap-12",
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden lg:aspect-3/2 lg:w-[54%]">
                <Photo
                  src={item.image}
                  tone={item.tone}
                  alt={item.title}
                  sizes="(min-width: 1025px) 54vw, 100vw"
                />
                <span className="c1 absolute top-4 left-4 bg-white/90 px-3 py-1.5 tracking-[0.15em] text-forest uppercase">
                  {item.label}
                </span>
              </div>

              <div className="lg:flex-1">
                <h2 className="t2">{item.title}</h2>
                <p className="b2 mt-5 max-w-xl text-ink-90">{item.body}</p>
                <LinedLink href={item.link.href} className="mt-8">
                  {item.link.label}
                </LinedLink>
              </div>
            </article>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
