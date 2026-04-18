#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def read_lines(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [line.rstrip() for line in path.read_text(encoding="utf-8").splitlines()]


def main() -> int:
    current_plan = read_lines(ROOT / "CURRENT_PLAN.md")
    backlog = [line[2:].strip() for line in read_lines(ROOT / "TODO_BACKLOG.md") if line.startswith("- ")]

    print("Current plan summary:")
    for line in current_plan[:12]:
        print(line)

    print("\nSuggested next candidates:")
    if backlog:
        for item in backlog[:5]:
            print(f"- {item}")
    else:
        print("- Review WORKLOG and MASTER_PLAN to draft the next cycle.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
