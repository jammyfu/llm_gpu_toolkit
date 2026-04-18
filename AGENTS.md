<!-- BEGIN:continuous-project-loop -->

## Continuous Project Loop

- Treat `CURRENT_PLAN.md` as the only current execution entry.
- Treat `MASTER_PLAN.md` as the long-range roadmap.
- Treat `TODO_BACKLOG.md` as the candidate pool for work outside the current plan.
- Record actual execution in `docs/project-governance/WORKLOG.md`.
- Update `docs/project-governance/DECISIONS.md` and `CHANGELOG.md` when repository behavior or workflow changes.
- Run `python3 tools/verify.py` before claiming completion.
- Preferred repo-level checks: `python3 -m py_compile get_model.py update_config.py setup.py`.

<!-- END:continuous-project-loop -->
