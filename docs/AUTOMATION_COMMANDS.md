# AUTOMATION_COMMANDS.md

## Core Commands

- `python3 tools/verify.py`
- `python3 tools/next_plan.py`

## Preferred Underlying Checks

- `python3 -m py_compile get_model.py update_config.py setup.py`

## Automation Notes

- Run Python syntax validation every cycle.
- Treat model data refresh as a separate explicit task.
- Do not mutate downloaded data silently during summary updates.
