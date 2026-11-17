# WORKLOG.md

## 2026-04-18

- Bootstrapped the repository into the `continuous-project-loop` structure.
- Added durable planning files, governance logs, and a repo-level verification entry.
- Standardized the README entry section and automation guidance for `llm_gpu_toolkit`.

## 2026-11-17 (round 2)

- Re-verified installs without `--ignore-engines`. CI Node was 18; WDS 5 pulls `@peculiar/x509@1.14.3` (`engines.node >=20`). Set web `engines.node >=20` + `.npmrc engine-strict=true`, and moved `.github/workflows/static.yml` to Node 20 with `yarn install --frozen-lockfile`. Node 18 `npm ci` / `yarn install --frozen-lockfile` now fail with engine errors (exit 1).
- `patch-package` stays in `devDependencies`. `postinstall` runs `scripts/apply-react-scripts-patch.js`, which skips when the CLI is omitted. Isolated `npm ci --omit=dev` exit 0.
- Dual locks kept. Security pins reproduce on both; hoist differs (`brace-expansion`: yarn flattened to 2.1.8, npm kept 1.1.22 + 2.1.8). CI source of truth is yarn.
- Same-major/leaf pins cleared the previous 2 critical + most high (proxy-addr, websocket-driver 0.7.5 not 0.8, form-data, underscore, js-yaml 3.15.2/4.3.2, ws 7.5.14, browserslist, fast-uri, serialize-javascript 7.1.4, svgo 2.8.4, babel plugin, moment 2.31.0, react-router-dom 6.30.6 / `@remix-run/router` 1.23.4).
- Remaining npm unique: 27 total, **4 high / 0 critical**, all the `svgo@1.3.2` → `@svgr@5` → `react-scripts@5.0.1` chain. `fixAvailable` is react-scripts **2.1.3 downgrade**. GitHub Dependabot/code-scanning still HTTP 403.
- Added `svgo++css-select+2.1.0.patch` so css-select 2 can call nth-check 2's CJS `default` export. `yarn build` / tests still pass with postcss 8.5.33 and nth-check 2.1.1.
- Did not merge, deploy, close alerts, or rewrite off CRA.

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
