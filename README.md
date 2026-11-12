# LLM GPU Toolkit

![LLM GPU Toolkit](docs/images/llm-gpu-toolkit-hero.webp)

<sub>AI 生成的项目品牌插画：大模型挤进小显卡，不是软件截图。</sub>

浏览已保存的 Ollama 模型资料，粗略比较预估显存与 GPU 容量。这是选型参考，不是硬件实测，也不保证模型一定能运行。

[English](README.en.md) | [简体中文](README.md) | [繁體中文（臺灣）](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 选择入口

| 入口 | 用途 |
| --- | --- |
| [静态计算页面](index.html) | 选择已存模型、量化类型和显存容量 |
| [模型配置](config.json) | 检查采集脚本将请求哪些上游页面 |
| [已采集 JSON](modeldata/cleaned/) | 先检查保存的数据是否仍然有效 |
| [React 源码](llm-vram-calc-web/) | 独立前端源码，勿与根目录静态页混淆 |

## 本地运行静态页

在仓库根目录启动仅绑定本机的服务器，然后打开 http://127.0.0.1:8000。这只提供已有文件，不会自动更新模型数据。

```sh
git clone https://github.com/jammyfu/llm_gpu_toolkit.git
cd llm_gpu_toolkit
python3 -m http.server 8000 --bind 127.0.0.1
```

## 有意识地更新数据

使用 Python 3.8+ 和虚拟环境，先检查 config.json 及采集脚本再运行。脚本访问上游页面并写入本地 JSON；当前部分请求关闭了 TLS 证书校验，在敏感环境使用前应审查或修复。该命令不会下载模型权重。

```sh
python3 -m venv .venv
# Windows: .venv\Scripts\activate
. .venv/bin/activate
python -m pip install -r requirements.txt
python get_model.py
```

## 估算值代表什么

根目录页面目前解析文件大小的 GB/TB 文本，FP16 乘 2、Q8_0 乘 1.5，其他情况（含 Q4_K_M）乘 1.2，最小值为 0.5。它没有模拟上下文长度、KV 缓存、训练优化器状态或特定推理引擎。“可运行”标签只是这个粗略比较，资料也可能过时。不要单凭它购买硬件或承诺多卡训练容量。

## 使用与许可

当前版本没有 LICENSE 文件。包的分类字段写有 MIT，但这不是完整的许可授权；复用或再分发前请确认权利。本次更新不会自行补造许可证。

## 进一步阅读

五语导读不代表应用界面支持五语。原混合语言技术说明保留为历史参考，其中安装建议可能已经过时。

- [README.reference.md](README.reference.md)
- [CURRENT_PLAN.md](CURRENT_PLAN.md) · [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- [CONTRIBUTING.md](CONTRIBUTING.md) · [SECURITY.md](SECURITY.md)
- [Issues](https://github.com/jammyfu/llm_gpu_toolkit/issues)
