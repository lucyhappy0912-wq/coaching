import { ProgramScenes } from "@/components/home/ProgramScenes";
import type { CmsHomeProgram } from "@/lib/cms/types";

export function MomentScenes({ scenes }: { scenes: CmsHomeProgram[] }) {
  return <ProgramScenes programs={scenes} />;
}
