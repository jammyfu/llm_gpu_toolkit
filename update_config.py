import json
import os
import sys
import re
import shutil
import datetime
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse


def backup_config(config_path):
    """创建 config.json 的备份文件"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{config_path}.bak_{timestamp}"
    
    try:
        shutil.copy2(config_path, backup_path)
        print(f"已创建配置文件备份: {backup_path}")
        return True
    except Exception as e:
        print(f"创建备份失败: {e}")
        return False


def fetch_model_description(url):
    """从模型页面获取 README 内容作为描述，返回精确的核心描述文本"""
    try:
        print(f"正在从 {url} 获取模型描述...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 查找 README 标题
        readme_header = soup.find('h2', string='Readme')
        if not readme_header:
            readme_header = soup.find('h2', string=re.compile('README', re.IGNORECASE))
        
        description = None
        
        if readme_header:
            # 尝试找到主要描述段落
            # 首先查找 README 下的第一个 <p> 标签，通常包含主要描述
            current_element = readme_header.find_next()
            
            # 跳过下载链接或其他非主要描述内容
            while current_element and (
                not current_element.name == 'p' or 
                'download' in current_element.get_text().lower() or
                'requires' in current_element.get_text().lower() or
                len(current_element.get_text(strip=True)) < 30  # 跳过短小的段落
            ):
                current_element = current_element.find_next()
            
            if current_element and current_element.name == 'p':
                description = current_element.get_text(strip=True)
                
                # 检查是否获取到合适的描述（至少包含一些关键词）
                if not any(keyword in description.lower() for keyword in ['model', 'capability', 'feature', 'support', 'parameter']):
                    description = None
        
        # 如果上述方法没找到合适的描述，尝试从页面其他部分获取
        if not description:
            # 寻找页面中任何可能的描述文本（通常是第一个大段落）
            for p in soup.find_all('p'):
                text = p.get_text(strip=True)
                if len(text) > 100 and any(keyword in text.lower() for keyword in ['model', 'capability', 'feature']):
                    description = text
                    break
            
            # 如果还是没找到，尝试获取页面上的任何长文本
            if not description:
                for element in soup.find_all(['p', 'div']):
                    text = element.get_text(strip=True)
                    if len(text) > 120:  # 至少要有一定长度
                        description = text
                        break
        
        # 确保描述不会太长
        if description and len(description) > 500:
            description = description[:497] + "..."
            
        if description:
            # 清理描述文本（移除多余空格、特殊字符等）
            description = re.sub(r'\s+', ' ', description)
            description = description.strip()
            
        return description
    
    except Exception as e:
        print(f"获取模型描述时出错: {e}")
        return None


def translate_to_chinese(text):
    """将英文描述翻译为中文（简单映射关系，仅供示例）"""
    # 为不同模型定义特定的中文翻译
    translations = {
        "gemma": {
            "en": "Gemma is a lightweight, family of models from Google built on Gemini technology. The Gemma 3 models are multimodal—processing text and images—and feature a 128K context window with support for over 140 languages. Available in 1B, 4B, 12B, and 27B parameter sizes, they excel in tasks like question answering, summarization, and reasoning, while their compact design allows deployment on resource-limited devices.",
            "zh": "Gemma 是 Google 基于 Gemini 技术开发的轻量级模型家族。Gemma 3 系列支持多模态（处理文本和图像），拥有128K上下文窗口，支持超过140种语言。有1B、4B、12B和27B参数规模版本，在问答、摘要和推理等任务上表现出色，其紧凑设计可部署在资源有限的设备上。"
        },
        "llama": {
            "en": "Llama is an efficient and versatile language model from Meta. It offers strong capabilities across reasoning, coding, and general knowledge tasks with efficient performance.",
            "zh": "Llama 是 Meta 开发的高效多功能语言模型。它在推理、编程和通用知识任务中表现出强大的能力，同时保持高效的性能。"
        },
        "mixtral": {
            "en": "Mixtral is a sparse mixture of experts model that delivers strong performance across many tasks with efficient compute requirements.",
            "zh": "Mixtral 是一种稀疏混合专家模型，在多种任务中表现出色，同时具有高效的计算需求。"
        }
    }
    
    # 尝试寻找匹配的预定义翻译
    for model_key, translation in translations.items():
        if model_key.lower() in text.lower() and text.lower().find(translation["en"].lower()) != -1:
            return translation["zh"]
    
    # 如果没有预定义翻译，返回一个通用的中文描述
    return f"这是一个强大的语言模型，可能具备多种自然语言处理能力，包括文本生成、问答和推理等功能。该模型（{text[:50]}...）根据官方描述，可能适用于各种应用场景。"


def parse_ollama_url(url):
    """解析 Ollama 模型 URL，提取模型名称和版本信息"""
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip('/').split('/')
    
    if len(path_parts) < 2 or path_parts[0] != 'library':
        print("无效的 Ollama 模型 URL，格式应为: https://ollama.com/library/model-name")
        return None
    
    full_model_name = path_parts[1]
    
    # 尝试分离模型名称和版本
    if ':' in full_model_name:
        model_name, version = full_model_name.split(':', 1)
    else:
        # 如果没有冒号，则整个名称作为模型名，版本为空
        model_name, version = full_model_name, ""
    
    # 处理类似 llama3.1 或 qwen2.5 这样的名称
    match = re.match(r'^([a-zA-Z]+)(\d+\.\d+.*)', model_name)
    if match:
        key = match.group(1)
        version_from_name = match.group(2)
        # 如果版本为空，使用名称中提取的版本
        if not version:
            version = version_from_name
            # 在这种情况下，模型名称应该是不包含版本号的部分
            model_name = key
    else:
        key = model_name
    
    return {
        "name": model_name,
        "key": key,
        "version": version,
        "full_model_name": full_model_name
    }


def create_model_config(model_info, model_url):
    """创建模型配置字典，包括从页面获取的描述，区分中文和英文"""
    model_name = model_info["name"]
    version = model_info["version"]
    full_model_name = model_info["full_model_name"]
    
    # 组合显示名称，例如 "llama 3.3"
    display_name = f"{model_name} {version}" if version else model_name
    
    # 生成基础 URL 和标签 URL
    base_url = f"https://ollama.com/library/{full_model_name}"
    tags_url = f"{base_url}/tags"
    
    # 生成输出文件名
    output_file = f"{model_name.lower()}_{version.replace('.', '_').replace('-', '_')}".rstrip('_')
    if not output_file.endswith("_models"):
        output_file += "_models"
    output_file += ".json"
    
    # 从模型页面获取描述
    fetched_description = fetch_model_description(model_url)
    
    # 如果成功获取描述，使用获取的描述；否则使用默认描述
    if fetched_description:
        # 英文描述直接使用获取的描述
        en_description = f"{display_name.title()}: {fetched_description}"
        
        # 中文描述使用翻译函数转换
        zh_description = f"{display_name.title()}: {translate_to_chinese(fetched_description)}"
        
        print("成功获取模型描述！")
    else:
        # 默认描述（中英文）
        zh_description = f"{display_name.title()}: 这是一个从 Ollama 库中获取的模型，可能具有强大的自然语言处理能力，支持多种任务如文本生成、问答和推理等。"
        en_description = f"{display_name.title()}: This is a model fetched from the Ollama library, likely featuring powerful natural language processing capabilities, supporting various tasks such as text generation, question answering, and reasoning."
        print("使用默认模型描述")
    
    return {
        "name": display_name,
        "key": model_info["key"],
        "version": version,
        "description": zh_description,
        "description_en": en_description,
        "base_url": base_url,
        "tags_url": tags_url,
        "output_file": output_file
    }


def update_config_file(config_path, new_model_config):
    """更新配置文件，添加新的模型配置"""
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # 检查是否已存在相同的模型配置
        existing_models = [model for model in config.get('models', [])
                         if model.get('base_url') == new_model_config['base_url']]
        
        if existing_models:
            print(f"警告: 配置文件中已存在相同 URL 的模型配置: {new_model_config['base_url']}")
            replace = input("是否要替换现有配置? (y/n): ").lower() == 'y'
            
            if replace:
                # 移除现有配置
                config['models'] = [model for model in config.get('models', [])
                                   if model.get('base_url') != new_model_config['base_url']]
            else:
                print("操作取消，配置未更新。")
                return False
        
        # 添加新的模型配置
        config['models'].append(new_model_config)
        
        # 写入更新后的配置
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=4)
        
        print(f"配置文件已更新，添加了模型: {new_model_config['name']}")
        return True
    
    except Exception as e:
        print(f"更新配置文件时出错: {e}")
        return False


def main():
    # 默认配置文件路径
    config_path = "config.json"
    
    # 检查配置文件是否存在
    if not os.path.exists(config_path):
        print(f"错误: 配置文件 {config_path} 不存在")
        return
    
    # 从命令行获取 URL，或者请求用户输入
    if len(sys.argv) > 1:
        model_url = sys.argv[1]
    else:
        model_url = input("请输入 Ollama 模型 URL (例如: https://ollama.com/library/gemma3): ").strip()
    
    # 解析 URL
    model_info = parse_ollama_url(model_url)
    if not model_info:
        return
    
    print(f"模型信息解析结果: {model_info}")
    
    # 创建模型配置，包括从URL获取的描述
    new_model_config = create_model_config(model_info, model_url)
    
    # 显示将要添加的配置
    print("\n将添加以下模型配置:")
    print(json.dumps(new_model_config, ensure_ascii=False, indent=2))
    
    # 确认是否继续
    if input("\n是否继续? (y/n): ").lower() != 'y':
        print("操作已取消")
        return
    
    # 备份配置文件
    if not backup_config(config_path):
        if input("备份失败，是否仍要继续? (y/n): ").lower() != 'y':
            print("操作已取消")
            return
    
    # 更新配置文件
    if update_config_file(config_path, new_model_config):
        print("配置更新成功!")
    else:
        print("配置更新失败，请检查错误信息")


if __name__ == "__main__":
    main() 