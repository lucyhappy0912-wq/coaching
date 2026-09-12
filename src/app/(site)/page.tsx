import { ConsultCta } from "@/components/content/Journey";
import { MomentPin } from "@/components/home/MomentPin";
import { ProgramScenes } from "@/components/home/ProgramScenes";
import { getContent } from "@/lib/cms/store";

export default async function Home() {
  const { pages } = await getContent();
  return (
    <>
      <MomentPin moment={pages.home.moment} />
      <ProgramScenes programs={pages.home.programs} />
      <ConsultCta showCheck={false} />
    </>
  );
}
