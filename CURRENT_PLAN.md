# CURRENT_PLAN.md

## Goal

Patch reachable npm dependency advisories in `llm_gpu_toolkit` without rewriting the CRA frontend or changing calculator behavior.

## Tasks

- [x] Record the current package managers, lockfiles, pre-fix audit, and dependency paths.
- [x] Upgrade direct `postcss` and pin reachable `nth-check` / `postcss` / `webpack-dev-server` copies to currently patched versions.
- [x] Keep CRA 5 compatible with webpack-dev-server 5 via a minimal `react-scripts` patch.
- [x] Verify with repo `tools/verify.py`, web `yarn build`, `tsc --noEmit`, `yarn test`, and a local `yarn start` smoke check.

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

## Next Candidates

- Add dataset freshness checks.
- Document calculator assumptions more clearly.
- Split CLI and web responsibilities.
- Replace unmaintained `react-scripts@5.0.1` if remaining CRA toolchain advisories need a non-override fix.
