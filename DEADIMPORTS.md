# DEADIMPORTS Audit

Scope: files reviewed during Phase 1/2 plus project-wide conservative scan.

Rules applied:

- skipped `import type ...` and named `type` imports
- skipped side-effect imports (`import 'x.css'`)
- flagged only identifiers with no token usage after import

## Findings

Total candidates: **62**

Primary pattern detected:

- Unused default `React` imports in files using the automatic JSX runtime.
- Import: `React` from `react`
- Reason: no local `React` symbol usage in file body
- Safe to remove: **YES**

## Representative entries (line + file)

| File                                        | Line | Import  | Reason                                                         | Safe to remove |
| ------------------------------------------- | ---: | ------- | -------------------------------------------------------------- | -------------- |
| `src/app/page.tsx`                          |   11 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/app/gears/page.tsx`                    |    9 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/app/journey/page.tsx`                  |    5 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/app/work-experience/page.tsx`          |    7 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/app/setup/page.tsx`                    |    9 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/app/contact/page.tsx`                  |    7 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/app/journey/certificates/page.tsx`     |    7 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/components/projects/DBProjectList.tsx` |   12 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/components/projects/ProjectList.tsx`   |    2 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/components/common/Footer.tsx`          |    2 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/components/common/Navbar.tsx`          |    4 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/components/common/ThemeSwitch.tsx`     |    5 | `React` | Uses named hooks import separately; default `React` is unused. | YES            |
| `src/components/landing/About.tsx`          |    2 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/components/landing/Projects.tsx`       |    5 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |
| `src/components/blog/CodeCopyButton.tsx`    |    2 | `React` | Automatic JSX runtime; no `React` symbol usage.                | YES            |

## Full raw list

- Generated at `deadimports-audit.json` (62 entries).
- No import deletions were performed in this phase.
