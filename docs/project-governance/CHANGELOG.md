# CHANGELOG.md

## 2026-11-17 (round 2)

- Required Node `>=20` for `llm-vram-calc-web`; CI deploy workflow now uses Node 20 and `yarn install --frozen-lockfile`.
- Pinned additional patched transitive packages (proxy-addr, websocket-driver 0.7.5, form-data, underscore, js-yaml 3.15.2/4.3.2, ws 7.5.14, browserslist, fast-uri, serialize-javascript 7.1.4, svgo 2.8.4, babel 7.29.x, moment 2.31.0, react-router-dom 6.30.6).
- `postinstall` skips `patch-package` when omitted from the install. Added css-select 2 CJS default unwrap for nth-check 2.

## 2026-11-17

- Upgraded direct `postcss` to 8.5.33 in the repo root and `llm-vram-calc-web`.
- Forced patched copies of `nth-check`, `postcss`, `nanoid`, `source-map-js`, `webpack-dev-server`, and `webpack-dev-middleware` through yarn resolutions and npm overrides.
- Added a CRA 5 compatibility patch so local `yarn start` can use webpack-dev-server 5.2.7.

## 2026-04-18

- Added standardized governance files and continuous loop entrypoints.
- Added a repo-level `tools/verify.py` and `tools/next_plan.py`.
- Normalized the README entry section for agent and human navigation.
