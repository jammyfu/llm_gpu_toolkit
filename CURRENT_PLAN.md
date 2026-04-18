# CURRENT_PLAN.md

## Goal

Normalize the mixed-tooling repo into a stable planning loop without changing its data model or calculators.

## Tasks

- [ ] Define the repo as a hybrid Python + static web toolkit in the project brief.
- [ ] Add verification for Python entry scripts and required governance files.
- [ ] Capture a current plan that narrows work toward data freshness and calculator consistency.

## Out Of Scope

- Full frontend rewrite.
- Model data schema migration.

## Verification

- Run `python3 tools/verify.py`

## Next Candidates

- Add dataset freshness checks.
- Document calculator assumptions more clearly.
- Split CLI and web responsibilities.
