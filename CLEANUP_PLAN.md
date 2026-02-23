# CLEANUP_PLAN

This plan is generated after Phase 1–3 audits only. **No deletions have been executed yet.**

## 1) 🗑️ SAFE TO DELETE (high confidence)

### API endpoint

- `GET /api/admin/blog` in `src/app/api/admin/blog/route.ts`
  - Reason: zero callsites/tests/docs/webhook references found.
  - Pre-delete checks to run:
    1. `grep -R "/api/admin/blog" src` (expect no caller results)
    2. verify no external contract docs depend on it
    3. run lint/build after removal

### Files

- `src/components/admin/BlogEditor.tsx`
- `src/components/admin/QuotesTab.tsx`
- `src/components/blog/BlogContent.tsx`
- `src/components/common/BackToTop.tsx`
- `src/components/common/SettingsModal.tsx`
- `src/components/common/Skill.tsx`
- `src/components/common/UserMenu.tsx`
- `src/components/gears/GearCard.tsx`

For each file above (before deleting):

1. final `grep` for imports/usages
2. remove file
3. remove any dangling imports
4. run `npm run lint`

## 2) ⚠️ NEEDS REVIEW (medium confidence)

- `src/lib/blog-api.ts`
- `src/lib/lenis.ts`
- `src/hooks/use-umami.ts`
- `src/types/auth.ts`
- admin API `GET` handlers with no first-party caller but possible operational use:
  - `src/app/api/admin/settings/route.ts#GET`
  - `src/app/api/admin/projects/route.ts#GET`
  - `src/app/api/admin/experiences/route.ts#GET`
  - `src/app/api/admin/achievements/route.ts#GET`
- public-facing API reads potentially consumed outside first-party UI:
  - `GET /api/blog`
  - `GET /api/blog/[slug]`

## 3) 🔒 DO NOT TOUCH

- `src/app/api/auth/[...nextauth]/route.ts` (authentication contract)
- `src/app/api/health/route.ts` (health checks/ops)
- routes used by active UI workflows:
  - contact, chat, upload, visitor-count
  - blog write/delete routes
  - admin mutation routes (projects/experiences/achievements/settings)
- framework/config + validation scripts unless explicitly requested:
  - `next-env.d.ts`, `next.config.ts`, `scripts/*`, `src/validate/*`

## 4) 🔧 IMPORT FIXES

- Remove unused default `React` imports flagged in `DEADIMPORTS.md` / `deadimports-audit.json`.
- First pass can safely target page/component files where `React` identifier is not referenced.

## Execution protocol (if approved)

If you approve cleanup execution, steps will be:

1. re-run final reference grep for each SAFE item
2. delete SAFE files/endpoint
3. remove dangling imports
4. run lint and report side effects
5. generate `REMOVAL_SUMMARY.md`
