import { ConsultCta, ProcessChain } from "@/components/content/Journey";
import { COACHING_LINKS, HinokShell, VisualIntro, VisualStep } from "@/components/content/HinokPage";
import type { PhotoTone } from "@/lib/cms/types";
import type { WeekCopy } from "@/lib/content";

export function ProgramPage({
  eyebrow,
  title,
  lead,
  current,
  tone,
  intro,
  process,
  weeks,
  extra,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  current: string;
  tone: PhotoTone;
  intro: readonly string[];
  process: readonly string[];
  weeks: readonly WeekCopy[];
  extra?: React.ReactNode;
}) {
  return (
    <>
      <HinokShell railTitle="Coaching" railLinks={COACHING_LINKS} current={current}>
        <VisualIntro
          tone={tone}
          caption={eyebrow}
          title={title}
          paragraphs={[lead, ...intro.slice(0, 2)]}
        />
        <div className="mt-10 flex justify-center">
          <ProcessChain steps={process} />
        </div>
        {weeks.map((item) => (
          <VisualStep
            key={item.week}
            index={item.week}
            title={`${item.stage}. ${item.title}`}
            body={item.body}
            aside={`${item.change.from}  →  ${item.change.to}`}
          />
        ))}
        {extra}
      </HinokShell>
      <ConsultCta />
    </>
  );
}
