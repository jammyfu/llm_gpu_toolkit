#!/bin/bash

# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
source .venv/bin/activate

# 升级pip
python -m pip install --upgrade pip

# 安装依赖
pip install -r requirements.txt

echo "安装完成！" 