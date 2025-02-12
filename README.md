# LLM GPU Toolkit

LLM GPU工具包，专注于大语言模型的GPU资源计算和优化，帮助开发者更好地规划和利用GPU资源。

## 功能特点

- 计算LLM模型在不同配置下的GPU显存占用
- 估算模型训练和推理时的GPU算力需求
- 提供多卡并行训练的资源分配建议
- 支持主流LLM模型的显存优化方案分析
- 模型量化对GPU资源影响的评估

## 安装说明

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

## 环境要求

- Python >= 3.8
- 依赖包会在安装时自动配置：
  - beautifulsoup4 >= 4.12.0
  - requests >= 2.31.0
  - urllib3 >= 2.0.0
  - certifi >= 2023.11.17
  - charset-normalizer >= 3.3.0
  - idna >= 3.6
  - soupsieve >= 2.5


## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 作者

- jammyfu
- GitHub: [https://github.com/jammyfu/llm-gpu-toolkit](https://github.com/jammyfu/llm-gpu-toolkit)

## 更新日志

### 0.1.0
- 初始版本发布
- 基础GPU资源计算功能实现
- 支持主流LLM模型的显存分析

## 本地服务器运行

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
