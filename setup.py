from setuptools import setup, find_packages
import os
import sys
from subprocess import check_call

def setup_virtual_env():
    """创建并配置虚拟环境"""
    venv_path = os.path.join(os.path.dirname(__file__), 'venv')
    
    if not os.path.exists(venv_path):
        # 创建虚拟环境
        check_call([sys.executable, '-m', 'venv', venv_path])
        
        # 获取虚拟环境中的 pip 路径
        if sys.platform == 'win32':
            pip_path = os.path.join(venv_path, 'Scripts', 'pip')
        else:
            pip_path = os.path.join(venv_path, 'bin', 'pip')
            
        # 升级 pip
        check_call([pip_path, 'install', '--upgrade', 'pip'])
        
        print(f"虚拟环境已创建在: {venv_path}")
        print("要激活虚拟环境，请运行：")
        if sys.platform == 'win32':
            print(f"    {os.path.join(venv_path, 'Scripts', 'activate')}")
        else:
            print(f"    source {os.path.join(venv_path, 'bin', 'activate')}")

setup(
    name="llm-model-tools",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        'beautifulsoup4>=4.12.0',
        'requests>=2.31.0',
        'urllib3>=2.0.0',
        'certifi>=2023.11.17',
        'charset-normalizer>=3.3.0',
        'idna>=3.6',
        'soupsieve>=2.5',
    ],
    author="jammyfu",
    description="LLM模型数据获取和显存计算工具",
    long_description=open('README.md').read(),
    long_description_content_type="text/markdown",
    url="https://github.com/jammyfu/llm-model-tools",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.8',
)

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'setup_venv':
        setup_virtual_env()
    else:
        setup() 