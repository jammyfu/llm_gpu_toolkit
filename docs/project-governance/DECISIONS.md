# DECISIONS.md

## 2026-09-01

- Public product GEO lives in `README.md` (first ~50 words plus question-shaped FAQ H2s) and a root `llms.txt` hedge. `AGENTS.md` stays a maintainer loop file, not a GEO page.
- Do not invent a license, calculator formulas, or supported model series beyond `config.json` and existing repository surfaces.
- Keep the personal-project-standard-entry block below the product FAQ so crawlers and humans see LLM GPU Toolkit first.

## 2026-04-18

- Adopt `CURRENT_PLAN.md` as the only current execution entry for `llm_gpu_toolkit`.
- Keep the repository-specific product or technical direction unchanged during governance bootstrap.
- Use `python3 tools/verify.py` as the canonical verification entrypoint.
