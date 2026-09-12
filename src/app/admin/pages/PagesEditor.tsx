"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { ImageSlot } from "@/app/admin/_components/ImageSlot";
import { SaveBar } from "@/app/admin/_components/SaveBar";
import { ToneSelect } from "@/app/admin/_components/ToneSelect";
import { ADM_AREA, ADM_INPUT } from "@/app/admin/_components/fields";
import { savePageSlice, type SaveState } from "@/app/admin/pages-actions";
import type { CmsPages, MediaRef, PageKey, PhotoTone } from "@/lib/cms/types";
import { PAGE_META } from "@/lib/cms/page-keys";

function linesOf(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function MediaCard({
  prefix,
  value,
  onChange,
  label,
}: {
  prefix: string;
  value: MediaRef;
  onChange: (next: MediaRef) => void;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <ImageSlot
        name={`${prefix}.image`}
        value={value.image}
        videoName={`${prefix}.video`}
        videoValue={value.video}
        tone={value.tone}
        label={label}
        onChange={(image) => onChange({ ...value, image })}
        onVideoChange={(video) => onChange({ ...value, video })}
      />
      <ToneSelect
        name={`${prefix}.tone`}
        value={value.tone}
        onChange={(tone: PhotoTone) => onChange({ ...value, tone })}
      />
    </div>
  );
}

export function PagesEditor({
  slug,
  initial,
  canSave,
}: {
  slug: PageKey;
  initial: unknown;
  canSave: boolean;
}) {
  const meta = PAGE_META.find((item) => item.slug === slug);
  const [saved, setSaved] = useState(initial);
  const [value, setValue] = useState(initial);
  const valueRef = useRef(value);
  valueRef.current = value;
  const [state, action, pending] = useActionState(savePageSlice, { ok: false } satisfies SaveState);

  useEffect(() => {
    if (state.ok && state.stamp) setSaved(valueRef.current);
  }, [state.ok, state.stamp]);

  const dirty = JSON.stringify(value) !== JSON.stringify(saved);
  const status = pending
    ? "저장 중…"
    : state.error
      ? state.error
      : dirty
        ? "저장하지 않은 변경이 있습니다."
        : state.ok
          ? "저장했습니다. 공개 페이지에 바로 반영됩니다."
          : "사진·영상과 글을 고친 뒤 저장하면 그 페이지만 바뀝니다.";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="payload" value={JSON.stringify(value)} />
      {!canSave ? (
        <p className="adm-body text-danger">이 환경에서는 저장할 수 없습니다.</p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="adm-body text-ink-70">사진이 없으면 그라데이션만 보입니다. 영상을 넣으면 사진 대신 재생됩니다.</p>
        {meta ? (
          <a
            href={meta.preview}
            target="admin-preview"
            rel="noopener"
            className="adm-body rounded-[4px] border border-ink-50 px-3 py-2 text-forest hover:bg-ink-05"
          >
            공개 페이지에서 보기
          </a>
        ) : null}
      </div>
      {renderFields(slug, value, setValue)}
      <SaveBar
        status={status}
        pending={pending}
        disabled={!canSave}
        onReset={() => setValue(saved)}
      />
    </form>
  );
}

function renderFields(slug: PageKey, value: unknown, setValue: (next: unknown) => void) {
  if (slug === "home") {
    const page = value as CmsPages["home"];
    return (
      <>
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">첫 화면</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <MediaCard prefix="moment" label="홈 첫 화면 사진" value={page.moment} onChange={(moment) => setValue({ ...page, moment: { ...page.moment, ...moment } })} />
            <div className="space-y-5">
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">작은 제목</span>
                <input className={ADM_INPUT} value={page.moment.eyebrow} onChange={(event) => setValue({ ...page, moment: { ...page.moment, eyebrow: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">문장 (줄마다 한 줄)</span>
                <textarea className={ADM_AREA} value={page.moment.lines.join("\n")} onChange={(event) => setValue({ ...page, moment: { ...page.moment, lines: linesOf(event.target.value) } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">본문</span>
                <textarea className={ADM_AREA} value={page.moment.body} onChange={(event) => setValue({ ...page, moment: { ...page.moment, body: event.target.value } })} />
              </label>
            </div>
          </div>
        </section>
        {page.programs.map((item, index) => (
          <section key={item.id} className="rounded-[6px] border border-ink-15 bg-white p-5">
            <h2 className="adm-h text-forest">{item.title}</h2>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <MediaCard
                prefix={`program.${index}`}
                label={`${item.title} 사진`}
                value={item}
                onChange={(media) =>
                  setValue({
                    ...page,
                    programs: page.programs.map((row, i) => (i === index ? { ...row, ...media } : row)),
                  })
                }
              />
              <div className="space-y-5">
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">큰 문장</span>
                  <input
                    className={ADM_INPUT}
                    value={item.line}
                    onChange={(event) =>
                      setValue({
                        ...page,
                        programs: page.programs.map((row, i) => (i === index ? { ...row, line: event.target.value } : row)),
                      })
                    }
                  />
                </label>
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">본문 (줄마다 한 문단)</span>
                  <textarea
                    className={ADM_AREA}
                    value={item.lead.join("\n")}
                    onChange={(event) =>
                      setValue({
                        ...page,
                        programs: page.programs.map((row, i) => (i === index ? { ...row, lead: linesOf(event.target.value) } : row)),
                      })
                    }
                  />
                </label>
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">버튼 문구</span>
                  <input
                    className={ADM_INPUT}
                    value={item.cta}
                    onChange={(event) =>
                      setValue({
                        ...page,
                        programs: page.programs.map((row, i) => (i === index ? { ...row, cta: event.target.value } : row)),
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </section>
        ))}
      </>
    );
  }

  if (slug === "story") {
    const page = value as CmsPages["story"];
    return page.slides.map((slide, index) => (
      <section key={slide.id} className="rounded-[6px] border border-ink-15 bg-white p-5">
        <h2 className="adm-h text-forest">장면 {index + 1}</h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <MediaCard
            prefix={`slide.${index}`}
            label={`${index + 1}번째 장면 사진`}
            value={slide}
            onChange={(media) =>
              setValue({ slides: page.slides.map((row, i) => (i === index ? { ...row, ...media } : row)) })
            }
          />
          <div className="space-y-5">
            <label className="block">
              <span className="adm-label mb-1.5 block text-forest-70">제목</span>
              <textarea
                className={ADM_AREA}
                value={slide.title}
                onChange={(event) =>
                  setValue({ slides: page.slides.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })
                }
              />
            </label>
            <label className="block">
              <span className="adm-label mb-1.5 block text-forest-70">본문 (줄마다 한 문단)</span>
              <textarea
                className={ADM_AREA}
                value={slide.lines.join("\n")}
                onChange={(event) =>
                  setValue({ slides: page.slides.map((row, i) => (i === index ? { ...row, lines: linesOf(event.target.value) } : row)) })
                }
              />
            </label>
          </div>
        </div>
      </section>
    ));
  }

  if (slug === "way") {
    const page = value as CmsPages["way"];
    return (
      <>
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">첫 화면</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <MediaCard prefix="way.hero" label="전환 첫 화면 사진" value={page.hero} onChange={(hero) => setValue({ ...page, hero: { ...page.hero, ...hero } })} />
            <div className="space-y-5">
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">영문 제목</span>
                <input className={ADM_INPUT} value={page.hero.eyebrow} onChange={(event) => setValue({ ...page, hero: { ...page.hero, eyebrow: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">한국어 제목</span>
                <textarea className={ADM_AREA} value={page.hero.title} onChange={(event) => setValue({ ...page, hero: { ...page.hero, title: event.target.value } })} />
              </label>
            </div>
          </div>
        </section>
        {page.items.map((item, index) => (
          <section key={item.no} className="rounded-[6px] border border-ink-15 bg-white p-5">
            <h2 className="adm-h text-forest">{item.no} {item.title}</h2>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <MediaCard
                prefix={`way.${index}`}
                label={`${item.no} 사진`}
                value={item}
                onChange={(media) =>
                  setValue({ ...page, items: page.items.map((row, i) => (i === index ? { ...row, ...media } : row)) })
                }
              />
              <div className="space-y-5">
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">제목</span>
                  <input
                    className={ADM_INPUT}
                    value={item.title}
                    onChange={(event) =>
                      setValue({ ...page, items: page.items.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })
                    }
                  />
                </label>
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">본문 (줄마다 한 문단)</span>
                  <textarea
                    className={ADM_AREA}
                    value={item.body.join("\n")}
                    onChange={(event) =>
                      setValue({ ...page, items: page.items.map((row, i) => (i === index ? { ...row, body: linesOf(event.target.value) } : row)) })
                    }
                  />
                </label>
              </div>
            </div>
          </section>
        ))}
      </>
    );
  }

  if (slug === "belief") {
    const page = value as CmsPages["belief"];
    return (
      <>
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">첫 화면</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <MediaCard prefix="belief.hero" label="Belief 첫 화면 사진" value={page.hero} onChange={(hero) => setValue({ ...page, hero: { ...page.hero, ...hero } })} />
            <div className="space-y-5">
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">영문 체인</span>
                <input className={ADM_INPUT} value={page.hero.chain} onChange={(event) => setValue({ ...page, hero: { ...page.hero, chain: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">한 줄</span>
                <input className={ADM_INPUT} value={page.hero.line} onChange={(event) => setValue({ ...page, hero: { ...page.hero, line: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">닫는 문장 (줄마다 한 줄)</span>
                <textarea className={ADM_AREA} value={page.close.join("\n")} onChange={(event) => setValue({ ...page, close: linesOf(event.target.value) })} />
              </label>
            </div>
          </div>
        </section>
        {page.items.map((item, index) => (
          <section key={item.no} className="rounded-[6px] border border-ink-15 bg-white p-5">
            <h2 className="adm-h text-forest">{item.en}</h2>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <MediaCard
                prefix={`belief.${index}`}
                label={`${item.en} 사진`}
                value={item}
                onChange={(media) =>
                  setValue({ ...page, items: page.items.map((row, i) => (i === index ? { ...row, ...media } : row)) })
                }
              />
              <div className="space-y-5">
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">영문</span>
                  <input
                    className={ADM_INPUT}
                    value={item.en}
                    onChange={(event) =>
                      setValue({ ...page, items: page.items.map((row, i) => (i === index ? { ...row, en: event.target.value } : row)) })
                    }
                  />
                </label>
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">제목</span>
                  <input
                    className={ADM_INPUT}
                    value={item.title}
                    onChange={(event) =>
                      setValue({ ...page, items: page.items.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })
                    }
                  />
                </label>
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">본문 (줄마다 한 문단)</span>
                  <textarea
                    className={ADM_AREA}
                    value={item.body.join("\n")}
                    onChange={(event) =>
                      setValue({ ...page, items: page.items.map((row, i) => (i === index ? { ...row, body: linesOf(event.target.value) } : row)) })
                    }
                  />
                </label>
              </div>
            </div>
          </section>
        ))}
      </>
    );
  }

  if (slug === "stage" || slug === "next-chapter" || slug === "founder") {
    const page = value as CmsPages["stage"];
    return (
      <>
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">첫 화면</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <MediaCard prefix="hero" label="히어로 사진" value={page.hero} onChange={(hero) => setValue({ ...page, hero })} />
            <div className="space-y-5">
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">작은 제목</span>
                <input className={ADM_INPUT} value={page.eyebrow} onChange={(event) => setValue({ ...page, eyebrow: event.target.value })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">큰 문장</span>
                <input className={ADM_INPUT} value={page.line} onChange={(event) => setValue({ ...page, line: event.target.value })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">리드</span>
                <textarea className={ADM_AREA} value={page.lead} onChange={(event) => setValue({ ...page, lead: event.target.value })} />
              </label>
            </div>
          </div>
        </section>
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">소개</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <MediaCard prefix="split" label="소개 사진" value={page.split} onChange={(split) => setValue({ ...page, split })} />
            <label className="block">
              <span className="adm-label mb-1.5 block text-forest-70">소개 본문 (줄마다 한 문단)</span>
              <textarea className={ADM_AREA} value={page.intro.join("\n")} onChange={(event) => setValue({ ...page, intro: linesOf(event.target.value) })} />
            </label>
          </div>
        </section>
        {slug === "founder" ? (
          <section className="rounded-[6px] border border-ink-15 bg-white p-5">
            <h2 className="adm-h text-forest">After 6 weeks</h2>
            <div className="mt-4 space-y-5">
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">제목</span>
                <input className={ADM_INPUT} value={page.after.title} onChange={(event) => setValue({ ...page, after: { ...page.after, title: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">리드</span>
                <textarea className={ADM_AREA} value={page.after.lead} onChange={(event) => setValue({ ...page, after: { ...page.after, lead: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">표 (before | after, 한 줄에 하나)</span>
                <textarea
                  className={ADM_AREA}
                  value={page.after.pairs.map((pair) => `${pair.before} | ${pair.after}`).join("\n")}
                  onChange={(event) =>
                    setValue({
                      ...page,
                      after: {
                        ...page.after,
                        pairs: linesOf(event.target.value).map((line) => {
                          const [before, after] = line.split("|");
                          return { before: (before ?? "").trim(), after: (after ?? "").trim() };
                        }),
                      },
                    })
                  }
                />
              </label>
            </div>
          </section>
        ) : null}
        {page.weeks.map((item, index) => (
          <section key={item.week} className="rounded-[6px] border border-ink-15 bg-white p-5">
            <h2 className="adm-h text-forest">
              {item.week} {item.stage}
            </h2>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <MediaCard
                prefix={`week.${index}`}
                label={`${item.week} 사진`}
                value={item}
                onChange={(media) =>
                  setValue({ ...page, weeks: page.weeks.map((row, i) => (i === index ? { ...row, ...media } : row)) })
                }
              />
              <div className="space-y-5">
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">단계</span>
                  <input
                    className={ADM_INPUT}
                    value={item.stage}
                    onChange={(event) =>
                      setValue({ ...page, weeks: page.weeks.map((row, i) => (i === index ? { ...row, stage: event.target.value } : row)) })
                    }
                  />
                </label>
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">제목</span>
                  <input
                    className={ADM_INPUT}
                    value={item.title}
                    onChange={(event) =>
                      setValue({ ...page, weeks: page.weeks.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)) })
                    }
                  />
                </label>
                <label className="block">
                  <span className="adm-label mb-1.5 block text-forest-70">본문</span>
                  <textarea
                    className={ADM_AREA}
                    value={item.body.join("\n")}
                    onChange={(event) =>
                      setValue({ ...page, weeks: page.weeks.map((row, i) => (i === index ? { ...row, body: linesOf(event.target.value) } : row)) })
                    }
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="adm-label mb-1.5 block text-forest-70">From</span>
                    <input
                      className={ADM_INPUT}
                      value={item.from}
                      onChange={(event) =>
                        setValue({ ...page, weeks: page.weeks.map((row, i) => (i === index ? { ...row, from: event.target.value } : row)) })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="adm-label mb-1.5 block text-forest-70">To</span>
                    <input
                      className={ADM_INPUT}
                      value={item.to}
                      onChange={(event) =>
                        setValue({ ...page, weeks: page.weeks.map((row, i) => (i === index ? { ...row, to: event.target.value } : row)) })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>
        ))}
      </>
    );
  }

  if (slug === "leadership") {
    const page = value as CmsPages["leadership"];
    return (
      <>
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">첫 화면</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <MediaCard prefix="lead.hero" label="히어로 사진" value={page.hero} onChange={(hero) => setValue({ ...page, hero: { ...page.hero, ...hero } })} />
            <div className="space-y-5">
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">작은 제목</span>
                <input className={ADM_INPUT} value={page.hero.eyebrow} onChange={(event) => setValue({ ...page, hero: { ...page.hero, eyebrow: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">큰 문장</span>
                <textarea className={ADM_AREA} value={page.hero.line} onChange={(event) => setValue({ ...page, hero: { ...page.hero, line: event.target.value } })} />
              </label>
              <label className="block">
                <span className="adm-label mb-1.5 block text-forest-70">메타</span>
                <input className={ADM_INPUT} value={page.hero.meta} onChange={(event) => setValue({ ...page, hero: { ...page.hero, meta: event.target.value } })} />
              </label>
            </div>
          </div>
        </section>
        <section className="rounded-[6px] border border-ink-15 bg-white p-5">
          <h2 className="adm-h text-forest">본문</h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <MediaCard prefix="lead.split" label="본문 사진" value={page.split} onChange={(split) => setValue({ ...page, split })} />
            <label className="block">
              <span className="adm-label mb-1.5 block text-forest-70">문장 (줄마다 한 문단)</span>
              <textarea className={ADM_AREA} value={page.body.join("\n")} onChange={(event) => setValue({ ...page, body: linesOf(event.target.value) })} />
            </label>
          </div>
        </section>
      </>
    );
  }

  const page = value as CmsPages["check"];
  return (
    <section className="rounded-[6px] border border-ink-15 bg-white p-5">
      <h2 className="adm-h text-forest">진단 첫 화면</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <MediaCard prefix="check" label="진단 히어로 사진" value={page} onChange={(media) => setValue({ ...page, ...media })} />
        <div className="space-y-5">
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">작은 제목</span>
            <input className={ADM_INPUT} value={page.eyebrow} onChange={(event) => setValue({ ...page, eyebrow: event.target.value })} />
          </label>
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">제목</span>
            <textarea className={ADM_AREA} value={page.title} onChange={(event) => setValue({ ...page, title: event.target.value })} />
          </label>
        </div>
      </div>
    </section>
  );
}
