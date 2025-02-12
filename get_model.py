import re
import json
import urllib3
import requests
from pathlib import Path
from bs4 import BeautifulSoup

# 禁用 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ModelProcessor:
    def __init__(self, config_path='config.json'):
        self.load_config(config_path)
        self.setup_directories()

    def load_config(self, config_path):
        """加载配置文件"""
        with open(config_path, 'r', encoding='utf-8') as f:
            self.config = json.load(f)

    def setup_directories(self):
        """创建必要的目录结构"""
        cleaned_dir = self.config['output_dirs'].get('cleaned')
        if cleaned_dir:
            Path(cleaned_dir).mkdir(parents=True, exist_ok=True)

    def get_file_path(self, filename, is_cleaned=False):
        """获取文件的完整路径"""
        cleaned_dir = self.config['output_dirs'].get('cleaned')
        return str(Path(cleaned_dir) / filename)

    def clean_model_id(self, model_id, model_type, model_version):
        """清理模型ID，提取关键信息"""
        # 提取基本大小信息（如1.5b, 7b等）
        size_match = re.search(r'(\d+\.?\d*b)', model_id.lower())
        if not size_match:
            return None, None, None, None, None

        base_size = size_match.group(1)

        if model_type == "deepseek":
            return self._clean_deepseek_model(base_size, model_id, model_version)
        elif model_type == "qwen":
            return self._clean_qwen_model(base_size, model_id, model_version)
        elif model_type == "llama":
            return self._clean_llama_model(base_size, model_id, model_version)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")

    def _clean_deepseek_model(self, base_size, model_id, model_version):
        """处理 DeepSeek 模型 ID"""
        # 构建基础模型名称和URL
        base_model = f"deepseek-{model_version}:{base_size}"
        base_url = f"https://ollama.com/library/{base_model}"

        # 构建扩展模型名称
        architecture = '-qwen' if base_size not in ['8b', '70b'] else '-llama'
        extended_model = f"{base_model}{architecture}-distill"

        return self._process_quantization(base_model, extended_model, base_url, model_id)

    def _clean_qwen_model(self, base_size, model_id, model_version):
        """处理 Qwen 模型 ID"""
        # 构建基础模型名称
        base_model = f"qwen{model_version}:{base_size}"
        if 'instruct' in model_id.lower():
            base_model += '-instruct'

        base_url = f"https://ollama.com/library/{base_model}"
        extended_model = base_model  # Qwen 使用相同的基础名称

        return self._process_quantization(base_model, extended_model, base_url, model_id)

    def _clean_llama_model(self, base_size, model_id, model_version):
        """处理 Llama 模型 ID"""
        # 处理 vision 模型的特殊情况
        if 'vision' in model_version.lower():
            # 从模型ID中提取大小信息
            size_match = re.search(r'(\d+)b', model_id.lower())
            if size_match:
                base_size = f"{size_match.group(1)}b"
            base_model = f"llama{model_version}:{base_size}"
        else:
            # 普通 Llama 模型
            base_model = f"llama{model_version}:{base_size}"
        
        # 处理 instruct 变体
        if 'instruct' in model_id.lower():
            base_model += '-instruct'
        
        base_url = f"https://ollama.com/library/{base_model}"
        extended_model = base_model

        # 处理量化版本
        if 'q2_k' in model_id.lower():
            quant = 'Q2_K'
            extended_model += '-q2_k'
        elif 'q3_k_m' in model_id.lower():
            quant = 'Q3_K_M'
            extended_model += '-q3_k_m'
        elif 'q3_k_s' in model_id.lower():
            quant = 'Q3_K_S'
            extended_model += '-q3_k_s'
        elif 'q4_k_m' in model_id.lower():
            quant = 'Q4_K_M'
            extended_model += '-q4_k_m'
        elif 'q4_k_s' in model_id.lower():
            quant = 'Q4_K_S'
            extended_model += '-q4_k_s'
        elif 'q4_0' in model_id.lower():
            quant = 'Q4_0'
            extended_model += '-q4_0'
        elif 'q5_0' in model_id.lower():
            quant = 'Q5_0'
            extended_model += '-q5_0'
        elif 'q5_1' in model_id.lower():
            quant = 'Q5_1'
            extended_model += '-q5_1'
        elif 'q5_k_m' in model_id.lower():
            quant = 'Q5_K_M'
            extended_model += '-q5_k_m'
        elif 'q6_k' in model_id.lower():
            quant = 'Q6_K'
            extended_model += '-q6_k'
        elif 'q8_0' in model_id.lower():
            quant = 'Q8_0'
            extended_model += '-q8_0'
        elif 'fp16' in model_id.lower():
            quant = 'FP16'
            extended_model += '-fp16'
        else:
            quant = 'BASE'
        
        extended_url = f"https://ollama.com/library/{extended_model}"
        
        # 对于非量化版本，返回基础模型信息
        if quant == 'BASE':
            return base_model, base_model, base_url, base_url, quant
        else:
            return None, extended_model, None, extended_url, quant

    def _process_quantization(self, base_model, extended_model, base_url, model_id):
        """处理量化信息"""
        if 'fp16' in model_id.lower():
            quant = 'FP16'
            extended_model += '-fp16'
            extended_url = f"https://ollama.com/library/{extended_model}"
            return None, extended_model, None, extended_url, quant
        elif 'q8_0' in model_id.lower():
            quant = 'Q8_0'
            extended_model += '-q8_0'
            extended_url = f"https://ollama.com/library/{extended_model}"
            return None, extended_model, None, extended_url, quant
        else:
            quant = 'Q4_K_M'
            extended_model += '-q4_k_m'
            extended_url = f"https://ollama.com/library/{extended_model}"
            return base_model, extended_model, base_url, extended_url, quant

    def parse_model_info(self, json_data, model_type, model_version):
        """解析和清理模型信息"""
        try:
            models = json.loads(json_data) if isinstance(json_data, str) else json_data
        except json.JSONDecodeError as e:
            print(f"JSON解析错误: {e}")
            return []

        cleaned_models = {}

        for model in models:
            base_model, extended_model, base_url, extended_url, quant = self.clean_model_id(model['model'], model_type, model_version)
            if not extended_model:
                continue

            size_match = re.search(r'(\d+\.?\d*)b', extended_model.lower())
            if not size_match:
                continue

            size_label = f"{size_match.group(1)}B"

            # 直接使用从页面获取的文件大小，不进行计算
            file_size = model['file_size']

            if base_model and base_url:
                base_key = f"{base_model}-{quant}"
                if base_key not in cleaned_models:
                    cleaned_models[base_key] = {
                        "model": base_model,
                        "size_label": size_label,
                        "file_size": file_size,  # 使用原始文件大小
                        "quantization": quant,
                        "url": base_url
                    }

            extended_key = f"{extended_model}-{quant}"
            if extended_key not in cleaned_models:
                cleaned_models[extended_key] = {
                    "model": extended_model,
                    "size_label": size_label,
                    "file_size": file_size,  # 使用原始文件大小
                    "quantization": quant,
                    "url": extended_url
                }

        return list(cleaned_models.values())

    def process_model(self, model_config):
        """处理指定类型的模型"""
        output_file = self.get_file_path(model_config['output_file'])

        try:
            # 从 fetch_model_data 获取清理后的模型数据
            cleaned_models = self.fetch_model_data(model_config)

            # 定义量化方式的排序优先级
            quant_priority = {
                "BASE": 0,  # 基础模型优先
                "FP16": 1,
                "Q8_0": 2,
                "Q6_K": 3,
                "Q5_K_M": 4,
                "Q5_1": 5,
                "Q5_0": 6,
                "Q4_K_M": 7,
                "Q4_K_S": 8,
                "Q4_0": 9,
                "Q3_K_M": 10,
                "Q3_K_S": 11,
                "Q2_K": 12
            }

            # 按模型大小和量化方式排序
            cleaned_models.sort(key=lambda x: (
                float(x["size_label"].replace("B", "")),  # 首先按模型大小排序
                quant_priority.get(x["quantization"], 999),  # 然后按量化方式排序
                len(x["model"])  # 最后按模型名称长度排序
            ))

            # 输出结果
            if cleaned_models:
                json_output = json.dumps(cleaned_models, indent=2, ensure_ascii=False)
                print(f"\n清理后的{model_config['name']}模型信息:")
                print(json_output)

                # 保存到新文件
                with open(output_file, "w", encoding="utf-8") as f:
                    f.write(json_output)
                print(f"\n共处理 {len(cleaned_models)} 个唯一模型")
                print(f"清理后数据保存在: {output_file}")
            else:
                print(f"未获取到任何有效的{model_config['name']}模型信息")

        except Exception as e:
            print(f"处理{model_config['name']}模型时出错: {e}")
            import traceback
            print(f"堆栈跟踪:\n{traceback.format_exc()}")

    def fetch_model_data(self, model_config):
        """从网页获取模型数据"""
        tags_url = model_config['tags_url']

        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(tags_url, headers=headers, verify=False)
            response.raise_for_status()

            print(f"\n获取页面 {tags_url} 的响应状态: {response.status_code}")

            # 解析HTML
            soup = BeautifulSoup(response.text, 'html.parser')

            # 提取模型数据
            models_data = []
            model_divs = soup.find_all('div', class_='flex px-4 py-3')

            print(f"\n找到 {len(model_divs)} 个模型div")

            for div in model_divs:
                # 获取模型名称
                model_link = div.find('a')
                if not model_link:
                    print("未找到模型链接")
                    continue

                model_name = model_link.get_text(strip=True)
                print(f"\n处理模型: {model_name}")

                # 获取文件大小
                size_text = div.find('div', class_='flex items-baseline space-x-1 text-[13px] text-neutral-500')
                if size_text:
                    # 获取所有文本节点并连接
                    full_text = ''.join(size_text.stripped_strings)
                    print(f"完整文本: {full_text}")

                    # 使用正则表达式提取文件大小
                    size_match = re.search(r'([\d.]+ ?[KMGT]B)', full_text)
                    if size_match:
                        file_size = size_match.group(1)
                        print(f"提取到的文件大小: {file_size}")
                    else:
                        file_size = ""
                        print("未能从文本中提取文件大小")
                else:
                    file_size = ""
                    print("未找到文件大小div")

                model_data = {
                    "model": model_name,
                    "file_size": file_size
                }

                print(f"添加数据: {model_data}")
                models_data.append(model_data)

            # 使用 model_config 信息进行 parse_model_info 处理
            cleaned_models = self.parse_model_info(models_data, model_config['key'], model_config['version'])

            return cleaned_models  # 返回清理后的数据

        except Exception as e:
            print(f"获取{model_config['name']}模型数据时出错: {e}")
            print(f"错误详情: {str(e)}")
            import traceback
            print(f"堆栈跟踪:\n{traceback.format_exc()}")
            return []

def main():
    processor = ModelProcessor()
    for model_config in processor.config['models']:
        print(f"\n处理 {model_config['name']} 模型...")
        processor.process_model(model_config)

if __name__ == "__main__":
    main()
