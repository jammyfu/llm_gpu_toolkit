# WORKLOG.md

## 2026-04-18

- Bootstrapped the repository into the `continuous-project-loop` structure.
- Added durable planning files, governance logs, and a repo-level verification entry.
- Standardized the README entry section and automation guidance for `llm_gpu_toolkit`.

## 2026-11-17

- Patched npm dependency advisories in this repo only: direct `postcss` to 8.5.33; yarn `resolutions` / npm `overrides` for `nth-check@2.1.1`, `postcss@8.5.33`, `nanoid@3.3.20`, `source-map-js@1.2.2`, `webpack-dev-server@5.2.7`, and `webpack-dev-middleware@7.4.6`.
- Regenerated `yarn.lock` and `package-lock.json` with yarn/npm (no hand-edited lockfiles). CI continues to use yarn in `llm-vram-calc-web`.
- Added a `patch-package` overlay so CRA 5 `yarn start` works with webpack-dev-server 5 (`server` + `setupMiddlewares`).
- GitHub Dependabot/code-scanning APIs returned HTTP 403 with this token (`Resource not accessible by integration`); used lockfile trees plus GitHub Advisory Database instead.
- Did not merge, deploy, ignore audit output, or close alerts.

## 2026-11-12

- Added five-language task guides; preserved original mixed-language reference.
- Corrected missing-license and installation claims; documented actual static-page heuristic and TLS limitation without changing runtime code.
- Added offline README route/link checks; no license or repository visibility changed.
