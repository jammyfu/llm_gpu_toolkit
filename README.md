# LLM GPU Toolkit

LLM GPU Toolkit is a public toolkit by Fu Jam (jammyfu / PaintingCoder) that estimates VRAM, training and inference GPU needs, multi-GPU allocation, and quantization impact for large language models.

LLM GPU Toolkit（大模型 GPU 工具包）把 Python 采集脚本和静态网页计算器放在同一个公开仓库里。机器可读索引见 [`llms.txt`](llms.txt)（补充入口，不是产品定义的替代）。

## What is LLM GPU Toolkit?

LLM GPU Toolkit is a hybrid Python and static-web toolkit for planning GPU resources for large language models. It estimates VRAM occupancy, training and inference GPU needs, multi-GPU allocation, and how quantization changes those estimates. Fu Jam (jammyfu / PaintingCoder) maintains the public repository [jammyfu/llm_gpu_toolkit](https://github.com/jammyfu/llm_gpu_toolkit).

## Who created LLM GPU Toolkit?

Fu Jam created and maintains LLM GPU Toolkit. The same person appears on GitHub as **jammyfu** (login) and **PaintingCoder** (profile name). The product homepage on GitHub is [https://github.com/jammyfu/llm_gpu_toolkit](https://github.com/jammyfu/llm_gpu_toolkit).

## What can LLM GPU Toolkit estimate?

LLM GPU Toolkit estimates four planning questions already described in this repository: GPU VRAM occupancy under different model configurations; GPU needs for training and inference; multi-GPU allocation for parallel training; and the impact of quantization on GPU resource use. This README does not invent calculator formulas; use the scripts and web calculator in this repo.

## Which model series does this repository include?

`config.json` currently lists these Ollama-backed series: DeepSeek R1, DeepSeek V3, OpenThinker, Qwen 2.5, Qwen 2.5-Coder, Qwen2-Math, Llama 3.3, Llama 3.2-Vision, Llama 3.2, and Gemma3. Treat that file, not this paragraph, as the source of truth if the list changes.

## How do I install LLM GPU Toolkit?

Python 3.8 or newer is required. The setup script installs beautifulsoup4, requests, urllib3, certifi, charset-normalizer, idna, and soupsieve at the versions listed in `setup.py`.

### 方法1：使用虚拟环境（推荐）

1. 创建并配置虚拟环境：

```bash
python setup.py setup_venv
```

2. 激活虚拟环境：

Windows:
```bash
.\venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

3. 安装包：
```bash
pip install -e .
```

### 方法2：直接安装

```bash
pip install llm-gpu-toolkit
```

## How do I collect model data?

`get_model.py` 可以从 Ollama 库中获取不同模型的信息，包括模型名称、大小、量化方式等数据。

在运行 `get_model.py` 前，请确保配置文件 `config.json` 已正确设置。该文件声明输出目录和要采集的模型系列（`name`、`key`、`version`、`base_url`、`tags_url`、`output_file`）。

```bash
python get_model.py
```

数据将保存在配置指定的输出目录下（当前 `config.json` 使用 `modeldata/new`），每个模型系列对应一个 JSON 文件。`update_config.py` 用于维护配置与描述字段。

## How do I run the VRAM calculator locally?

仓库根目录的 `index.html` 和 `llm-vram-calc-web/` 提供静态网页计算器：选择本仓库已采集的模型与量化标签，并输入 GPU 显存后查看估算结果。

### 方法1：使用 Python 内置 HTTP 服务器

1. 进入项目根目录：
```bash
cd llm-gpu-toolkit
```

2. 启动 HTTP 服务器：
```bash
python -m http.server 8000
```

3. 在浏览器中访问：
```
http://localhost:8000/index.html
```

### 方法2：使用 Node.js（推荐，支持热重载）

1. 安装 Node.js 依赖：
```bash
npm install -g live-server
```

2. 启动服务器：
```bash
live-server --port=8000
```

3. 浏览器会自动打开 index.html

### 方法3：使用 VSCode Live Server

1. 在 VSCode 中安装 "Live Server" 扩展
2. 右键 index.html，选择 "Open with Live Server"
3. 浏览器会自动打开页面

## Does LLM GPU Toolkit include a license file?

This public repository does not currently include a LICENSE file. Do not infer a specific open-source license from this README.

## Who is the author of LLM GPU Toolkit?

**Fu Jam** maintains LLM GPU Toolkit. GitHub login: [jammyfu](https://github.com/jammyfu). GitHub profile name: PaintingCoder. Repository: [https://github.com/jammyfu/llm_gpu_toolkit](https://github.com/jammyfu/llm_gpu_toolkit).

## How can I contribute?

欢迎提交 Issue 和 Pull Request。请以本 README 和仓库内现有脚本、配置、网页为准，不要假设未入库的模型系列或未写明的计算公式。

## What changed in version 0.1.0?

- 初始版本发布
- 基础 GPU 资源计算功能实现
- 支持本仓库配置中的 LLM 模型显存分析

## Where is the maintainer planning entry?

内部规划入口已降级到本节，避免挡住产品实体。`AGENTS.md` 只服务维护者循环，不是对外 GEO 页面。

<!-- BEGIN:personal-project-standard-entry -->
## Project Entry

- Project brief: [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- Long-range roadmap: [MASTER_PLAN.md](MASTER_PLAN.md)
- Current execution entry: [CURRENT_PLAN.md](CURRENT_PLAN.md)
- Candidate backlog: [TODO_BACKLOG.md](TODO_BACKLOG.md)
- Governance log: [docs/project-governance/WORKLOG.md](docs/project-governance/WORKLOG.md)
- Automation notes: [docs/AUTOMATION_COMMANDS.md](docs/AUTOMATION_COMMANDS.md)
- Long-running autonomy: [docs/LONG_RUNNING_AUTONOMY.md](docs/LONG_RUNNING_AUTONOMY.md)
- Verification entry: `python3 tools/verify.py`

## Standardized Summary

- Positioning: Mixed Python and web tooling for LLM GPU sizing, model data collection, and resource estimation.
- Stack: Python scripts plus static web assets.
- Current goal: Normalize the mixed-tooling repo into a stable planning loop without changing its data model or calculators.
<!-- END:personal-project-standard-entry -->
