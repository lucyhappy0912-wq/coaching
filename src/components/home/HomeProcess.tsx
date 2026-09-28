import { HOME_PROCESS } from "@/lib/visual";

export function HomeProcess() {
  return (
    <section className="bg-[#f7f6f3]">
      <div className="mx-auto max-w-5xl px-(--gutter) py-24 lg:py-36">
        <p className="c1 tracking-[0.22em] text-ink-50 uppercase">How we transition</p>
        <ol className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-16">
          {HOME_PROCESS.map((item, index) => (
            <li key={item.key}>
              <p className="c1 text-ink-50">{String(index + 1).padStart(2, "0")}</p>
              <p className="serif mt-3 text-[32px] leading-none tracking-[-0.03em] text-ink lg:text-[40px]">
                {item.key}
              </p>
              <p className="b2 mt-4 max-w-sm text-ink-70">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
