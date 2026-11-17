# CURRENT_PLAN.md

## Goal

Patch reachable npm dependency advisories in `llm_gpu_toolkit` without rewriting the CRA frontend or changing calculator behavior.

## Tasks

- [x] Record the current package managers, lockfiles, pre-fix audit, and dependency paths.
- [x] Upgrade direct `postcss` and pin reachable `nth-check` / `postcss` / `webpack-dev-server` copies to currently patched versions.
- [x] Keep CRA 5 compatible with webpack-dev-server 5 via a minimal `react-scripts` patch.
- [x] Verify with repo `tools/verify.py`, web `yarn build`, `tsc --noEmit`, `yarn test`, and a local `yarn start` smoke check.
- [x] Prove clean installs without `--ignore-engines` on the real CI package managers (web yarn 1.22 + `yarn install --frozen-lockfile`; root/web `npm ci`). Record Node 18 engine failure vs Node 20+ success.
- [x] Same-toolchain pins for remaining critical/high that have a patched same-major (or leaf CJS) release. Classify leftover `svgo@1.3.2` / `@svgr/*@5` as the CRA-blocker set.

## Out Of Scope

- Full frontend rewrite / leaving Create React App.
- Migrating webpack-dev-server 6 (requires webpack `^5.101.0` and Node `>=22.15.0`).
- Closing GitHub Dependabot alerts or deploying GitHub Pages.
- Changing Python calculator logic or model data.

## Verification

- `python3 tools/verify.py`
- `python3 -m py_compile get_model.py update_config.py setup.py`
- `cd llm-vram-calc-web && yarn build`
- `cd llm-vram-calc-web && npx tsc --noEmit`
- `cd llm-vram-calc-web && CI=true yarn test --watchAll=false`
- `cd llm-vram-calc-web && yarn install --frozen-lockfile` (Node 20+, no `--ignore-engines`)

## Next Candidates

- Add dataset freshness checks.
- Document calculator assumptions more clearly.
- Split CLI and web responsibilities.
- Remaining 4 high are `svgo@1.3.2` plus `@svgr/plugin-svgo` / `@svgr/webpack` / `react-scripts` parents. Clearing them needs Vite or an @svgr 8 swap, not another override. Do not take `npm audit --force` (react-scripts 2.1.3 / 0.0.0).
- `react-router-dom` still moderate until 7.18.x; stay on 6.30.6 unless a dedicated v7 migration is planned.
