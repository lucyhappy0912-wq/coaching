import { ConsultCta } from "@/components/content/Journey";
import { MomentPin } from "@/components/home/MomentPin";
import { ProgramScenes } from "@/components/home/ProgramScenes";
import { getContent } from "@/lib/cms/store";
import { visibleByHref } from "@/lib/menu";

export default async function Home() {
  const { pages, menuOff, menuOn } = await getContent();
  return (
    <>
      <MomentPin moment={pages.home.moment} />
      <ProgramScenes programs={visibleByHref(pages.home.programs, menuOff, menuOn)} />
      <ConsultCta showCheck={false} />
    </>
  );
}
