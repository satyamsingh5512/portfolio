# DEADFILES Audit

Method:

- Enumerated all `*.js|*.jsx|*.ts|*.tsx` files under `src/` and `scripts/`.
- Built a static import graph from Next.js entry points (`src/app/**/{page,layout,route}.tsx|ts`), `src/middleware.ts`, and `scripts/*`.
- Marked only conservative candidates below. Dynamic/runtime wiring is treated as uncertainty.

## High-confidence candidates

| File                                      |     Size | Lines | Last known reference | Confidence | Reason                                                                                                                                |
| ----------------------------------------- | -------: | ----: | -------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/admin/BlogEditor.tsx`     | 20,331 B |   584 | none                 | HIGH       | No inbound imports; superseded by `BlogPostForm` flow (`src/app/admin/blog/new/page.tsx`, `src/app/admin/blog/edit/[slug]/page.tsx`). |
| `src/components/admin/QuotesTab.tsx`      |  6,685 B |   224 | none                 | HIGH       | No inbound imports from dashboard/tabs; references missing `/api/admin/quotes` endpoint.                                              |
| `src/components/blog/BlogContent.tsx`     |  6,259 B |   185 | none                 | HIGH       | Legacy MDX renderer; active blog path uses `TipTapBlogContent`.                                                                       |
| `src/components/common/BackToTop.tsx`     |  1,024 B |    40 | none                 | HIGH       | Not imported by layout/pages/components.                                                                                              |
| `src/components/common/SettingsModal.tsx` |  8,888 B |   267 | none                 | HIGH       | Not imported anywhere in active UI tree.                                                                                              |
| `src/components/common/Skill.tsx`         |    652 B |    22 | none                 | HIGH       | Not imported in active landing/setup flows.                                                                                           |
| `src/components/common/UserMenu.tsx`      |  4,087 B |   137 | none                 | HIGH       | Not imported by navbar/layout/pages.                                                                                                  |
| `src/components/gears/GearCard.tsx`       |    105 B |     8 | none                 | HIGH       | Not imported by `src/app/gears/page.tsx` or related components.                                                                       |

## Medium-confidence candidates (needs review)

| File                     |    Size | Lines | Last known reference | Confidence | Reason                                                                                         |
| ------------------------ | ------: | ----: | -------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `src/lib/blog-api.ts`    | 6,447 B |   205 | none                 | MEDIUM     | No importers found; looks like old file-based blog CRUD helper retained after Mongo migration. |
| `src/lib/lenis.ts`       |    44 B |     4 | none                 | MEDIUM     | No importer found; layout uses `lenis/react` directly.                                         |
| `src/hooks/use-umami.ts` | 1,013 B |    46 | none                 | MEDIUM     | No direct importer found; analytics may be planned/future.                                     |
| `src/types/auth.ts`      |   686 B |    40 | none                 | LOW/MEDIUM | No importer found; type files often reserved for future auth expansion.                        |

## Low-confidence / do-not-auto-delete set

These appeared unreachable in static graph but are commonly retained intentionally:

- standalone scripts under `scripts/` and `src/validate/`
- framework/config glue files (`next-env.d.ts`, `next.config.ts`)
- shared UI primitive inventory (`src/components/ui/*`) unless manually verified
- icon libraries (`src/components/svgs/*`, `src/components/technologies/*`) unless call-sites are fully audited

## Notes

- Static graph cannot prove runtime-only usage (dynamic route loading, future feature flags, external imports).
- No files were deleted in this phase.
