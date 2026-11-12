# LLM GPU Toolkit

<p align="center"><img src="docs/images/logo/main_logo.jpg" alt="LLM GPU Toolkit" width="160"></p>

Browse stored Ollama model metadata and compare a rough VRAM estimate with your GPU memory. This is a planning aid, not a hardware benchmark or a guarantee that a model will run.

[English](README.en.md) | [简体中文](README.md) | [繁體中文（臺灣）](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## Choose an entry

| Entry | Purpose |
| --- | --- |
| [Static calculator](index.html) | Select a stored model, quantization and GPU memory |
| [Model configuration](config.json) | Review which upstream pages the collector requests |
| [Collected JSON](modeldata/cleaned/) | Inspect the saved data before trusting its freshness |
| [React source](llm-vram-calc-web/) | Separate frontend source; do not confuse it with the root static page |

## Run the static page locally

From the repository root, start a server bound only to your computer and open http://127.0.0.1:8000. This serves existing files and does not refresh model data.

```sh
git clone https://github.com/jammyfu/llm_gpu_toolkit.git
cd llm_gpu_toolkit
python3 -m http.server 8000 --bind 127.0.0.1
```

## Refresh data deliberately

Use Python 3.8+ and a virtual environment. Review config.json, then the collector before running it. It requests upstream pages and writes local JSON. The current collector disables TLS certificate verification in several requests; review or fix this before relying on it in a sensitive environment. No model weights are downloaded by this command.

```sh
python3 -m venv .venv
# Windows: .venv\Scripts\activate
. .venv/bin/activate
python -m pip install -r requirements.txt
python get_model.py
```

## What the number means

The root page currently parses file-size GB/TB text, multiplies FP16 by 2, Q8_0 by 1.5 and other cases (including Q4_K_M) by 1.2, with a 0.5 minimum. It does not model context length, KV cache, training optimizer states or a particular inference engine. A “compatible” label is only this heuristic comparison. Data may be stale. Do not use it alone to purchase hardware or promise multi-GPU training capacity.

## Use and licensing

No LICENSE file exists at this revision. The package classifier says MIT, but that is not a complete license grant; confirm permission before reuse or redistribution. This update does not invent a license.

## More detail

Five localized guides do not mean the application interface supports five languages. The old mixed-language technical guide is retained as historical reference and may contain superseded install advice.

- [README.reference.md](README.reference.md)
- [CURRENT_PLAN.md](CURRENT_PLAN.md) · [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md)
- [Issues](https://github.com/jammyfu/llm_gpu_toolkit/issues)
