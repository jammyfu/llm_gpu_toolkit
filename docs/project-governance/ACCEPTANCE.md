# ACCEPTANCE.md

## Current Acceptance Gates

- Python validation entry works.
- Docs describe the mixed-tooling structure clearly.
- README links to the planning and automation entrypoints.
- Web production build, TypeScript `noEmit`, and CRA unit test pass after dependency security pins. Remaining CRA toolchain advisories are recorded, not ignored.
- Clean installs without `--ignore-engines`: web `yarn install --frozen-lockfile` and root/web `npm ci` succeed on Node 20+. Node 18 fails engines. `npm ci --omit=dev` does not fail on missing `patch-package`.
- npm unique audit after round 2 is 4 high / 0 critical (svgo 1.3.2 / @svgr 5 / react-scripts). GitHub Dependabot/code-scanning remain 403. Do not merge or deploy on this PR.
