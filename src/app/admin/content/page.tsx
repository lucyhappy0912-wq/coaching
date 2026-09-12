import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsEnabled } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/store";

import { saveSiteContent } from "./actions";

export const dynamic = "force-dynamic";

const field = "adm-input mt-1 h-10 w-full rounded-[4px] border border-ink-50 bg-white px-3 text-forest";
const area = "adm-input mt-1 min-h-24 w-full rounded-[4px] border border-ink-50 bg-white px-3 py-2 text-forest";

export default async function AdminContentPage() {
  await requireAdmin();
  const content = await getContent();
  const faqs = [...content.faqs, ...Array.from({ length: 6 }, () => ({ q: "", a: "" }))].slice(0, 6);

  return (
    <AdminShell title="콘텐츠">
      {!cmsEnabled() ? (
        <p className="adm-body mb-4 text-danger">저장소가 없어 저장할 수 없습니다. Supabase SQL을 실행하고 환경변수를 확인하세요.</p>
      ) : null}
      <form action={saveSiteContent} className="space-y-10">
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">사이트 정보</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="adm-label text-forest-70">영문 이름<input className={field} name="site.name" defaultValue={content.site.name} /></label>
            <label className="adm-label text-forest-70">한글 이름<input className={field} name="site.nameKo" defaultValue={content.site.nameKo} /></label>
            <label className="adm-label text-forest-70 sm:col-span-2">한 줄 소개<input className={field} name="site.tagline" defaultValue={content.site.tagline} /></label>
            <label className="adm-label text-forest-70 sm:col-span-2">설명<textarea className={area} name="site.description" defaultValue={content.site.description} /></label>
            <label className="adm-label text-forest-70">전화<input className={field} name="site.phone" defaultValue={content.site.phone} /></label>
            <label className="adm-label text-forest-70">이메일<input className={field} name="site.email" defaultValue={content.site.email} /></label>
            <label className="adm-label text-forest-70 sm:col-span-2">주소<input className={field} name="site.addressLine" defaultValue={content.site.addressLine} /></label>
            <label className="adm-label text-forest-70">평일<input className={field} name="site.hours" defaultValue={content.site.hours} /></label>
            <label className="adm-label text-forest-70">토요일<input className={field} name="site.lunch" defaultValue={content.site.lunch} /></label>
            <label className="adm-label text-forest-70">대표<input className={field} name="site.owner" defaultValue={content.site.owner} /></label>
            <label className="adm-label text-forest-70">상호<input className={field} name="site.company" defaultValue={content.site.company} /></label>
            <label className="adm-label text-forest-70">사업자번호<input className={field} name="site.bizNo" defaultValue={content.site.bizNo} /></label>
          </div>
        </section>

        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">상단 띠</h2>
          <div className="mt-4 grid gap-3">
            <input className={field} name="top.0" defaultValue={content.topMessages[0] ?? ""} />
            <input className={field} name="top.1" defaultValue={content.topMessages[1] ?? ""} />
          </div>
        </section>

        {content.hero.map((slide, index) => (
          <section key={index} className="rounded-[6px] border border-ink-15 bg-white p-5">
            <h2 className="adm-h text-forest">히어로 {index + 1}</h2>
            <div className="mt-4 grid gap-3">
              <label className="adm-label text-forest-70">작은 제목<input className={field} name={`hero.${index}.eyebrow`} defaultValue={slide.eyebrow} /></label>
              <label className="adm-label text-forest-70">제목<input className={field} name={`hero.${index}.title`} defaultValue={slide.title} /></label>
              <label className="adm-label text-forest-70">본문<textarea className={area} name={`hero.${index}.body`} defaultValue={slide.body} /></label>
              <label className="adm-label text-forest-70">버튼 문구<input className={field} name={`hero.${index}.ctaLabel`} defaultValue={slide.cta.label} /></label>
              <label className="adm-label text-forest-70">버튼 링크<input className={field} name={`hero.${index}.ctaHref`} defaultValue={slide.cta.href} /></label>
              <label className="adm-label text-forest-70">이미지 URL<input className={field} name={`hero.${index}.image`} defaultValue={slide.image} /></label>
              <label className="adm-label text-forest-70">영상 URL<input className={field} name={`hero.${index}.video`} defaultValue={slide.video} /></label>
              <input type="hidden" name={`hero.${index}.tone`} value={slide.tone} />
            </div>
          </section>
        ))}

        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">코치</h2>
          <div className="mt-4 grid gap-3">
            <label className="adm-label text-forest-70">이름<input className={field} name="coach.name" defaultValue={content.coach.name} /></label>
            <label className="adm-label text-forest-70">역할<input className={field} name="coach.role" defaultValue={content.coach.role} /></label>
            <label className="adm-label text-forest-70">소개<textarea className={area} name="coach.intro" defaultValue={content.coach.intro} /></label>
            <label className="adm-label text-forest-70">이력 (줄마다 한 줄)<textarea className={area} name="coach.credentials" defaultValue={content.coach.credentials.join("\n")} /></label>
            <label className="adm-label text-forest-70">사진 URL<input className={field} name="coach.image" defaultValue={content.coach.image} /></label>
            <input type="hidden" name="coach.tone" value={content.coach.tone} />
          </div>
        </section>

        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">FAQ</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="grid gap-2">
                <input className={field} name={`faq.${index}.q`} defaultValue={item.q} placeholder="질문" />
                <textarea className={area} name={`faq.${index}.a`} defaultValue={item.a} placeholder="답" />
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="adm-body h-11 rounded-[4px] bg-forest px-6 font-medium text-white">
          저장하고 사이트에 반영
        </button>
      </form>
    </AdminShell>
  );
}
