import re
import json
import urllib3
import requests
from pathlib import Path
from bs4 import BeautifulSoup
import os

# 禁用 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ModelProcessor:
    def __init__(self, config_path='config.json'):
        """初始化模型处理器，加载配置和设置目录"""
        self.load_config(config_path)
        self.setup_directories()
        self.model_type_handlers = {
            "deepseek": self._clean_deepseek_model,
            "qwen": self._clean_qwen_model,
            "llama": self._clean_llama_model,
            "openthinker": self._clean_openthinker_model,  # 添加 openthinker
        }

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

    def get_size_label(self, model_name):
        """从模型名称中提取大小标签"""
        size_match = re.search(r'(\d+\.?\d*)b', model_name.lower())
        if size_match:
            return f"{size_match.group(1)}B"
        return "未知大小"

    def clean_model_id(self, model_id, model_type, model_version):
        """清理模型ID，提取关键信息"""
        # 提取基本大小信息（如1.5b, 7b等）
        size_match = re.search(r'(\d+\.?\d*b)', model_id.lower())

        # 针对 openthinker，大小信息可能不在模型 ID 中
        if model_type == 'openthinker':
            # openthinker模型，根据名称确定base_size
            if '7b' in model_id.lower():
                base_size = '7b'
            elif '32b' in model_id.lower():
                base_size = '32b'
            else:
                base_size = '32b'  # 默认大小
        elif not size_match:
            print(f"警告：模型 ID '{model_id}' 中未找到大小信息。")
            return None, None, None, None, None, None
        else:
            base_size = size_match.group(1)

        handler = self.model_type_handlers.get(model_type)
        if handler:
            return handler(base_size, model_id, model_version)
        else:
            raise ValueError(f"不支持的模型类型: {model_type}")

    def _clean_deepseek_model(self, base_size, model_id, model_version):
        """处理 DeepSeek 模型 ID"""
        # 构建基础模型名称和URL
        base_model = f"deepseek-{model_version}:{base_size}"
        base_url = f"https://ollama.com/library/{base_model}"
        quant = 'BASE'
        quant_info = "基础版本 (无量化)"

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
        quant = 'BASE'
        quant_info = "基础版本 (无量化)"

        base_url = f"https://ollama.com/library/{base_model}"
        extended_model = base_model  # Qwen 使用相同的基础名称

        return self._process_quantization(base_model, extended_model, base_url, model_id)

    def _clean_llama_model(self, base_size, model_id, model_version):
        """处理 Llama 模型 ID"""
        # 处理 vision 模型的特殊情况
        quant = 'BASE'
        quant_info = "基础版本 (无量化)"
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
            quant_info = "Q2_K 量化"
            extended_model += '-q2_k'
        elif 'q3_k_m' in model_id.lower():
            quant = 'Q3_K_M'
            quant_info = "Q3_K_M 量化"
            extended_model += '-q3_k_m'
        elif 'q3_k_s' in model_id.lower():
            quant = 'Q3_K_S'
            quant_info = "Q3_K_S 量化"
            extended_model += '-q3_k_s'
        elif 'q4_k_m' in model_id.lower():
            quant = 'Q4_K_M'
            quant_info = "Q4_K_M 量化"
            extended_model += '-q4_k_m'
        elif 'q4_k_s' in model_id.lower():
            quant = 'Q4_K_S'
            quant_info = "Q4_K_S 量化"
            extended_model += '-q4_k_s'
        elif 'q4_0' in model_id.lower():
            quant = 'Q4_0'
            quant_info = "Q4_0 量化"
            extended_model += '-q4_0'
        elif 'q5_0' in model_id.lower():
            quant = 'Q5_0'
            quant_info = "Q5_0 量化"
            extended_model += '-q5_0'
        elif 'q5_1' in model_id.lower():
            quant = 'Q5_1'
            quant_info = "Q5_1 量化"
            extended_model += '-q5_1'
        elif 'q5_k_m' in model_id.lower():
            quant = 'Q5_K_M'
            quant_info = "Q5_K_M 量化"
            extended_model += '-q5_k_m'
        elif 'q6_k' in model_id.lower():
            quant = 'Q6_K'
            quant_info = "Q6_K 量化"
            extended_model += '-q6_k'
        elif 'q8_0' in model_id.lower():
            quant = 'Q8_0'
            quant_info = "Q8_0 量化"
            extended_model += '-q8_0'
        elif 'fp16' in model_id.lower():
            quant = 'FP16'
            quant_info = "FP16 量化"
            extended_model += '-fp16'
        else:
            quant = 'BASE'
            quant_info = "基础版本 (无量化)"

        extended_url = f"https://ollama.com/library/{extended_model}"

        # 对于非量化版本，返回基础模型信息
        if quant == 'BASE':
            return base_model, base_model, base_url, base_url, quant, quant_info
        else:
            return None, extended_model, None, extended_url, quant, quant_info

    def _clean_openthinker_model(self, base_size, model_id, model_version):
        """处理 Openthinker 模型 ID"""
        # 默认量化类型
        quant = 'BASE'
        quant_info = "基础版本 (无量化)"
        extended_model = f"openthinker:{base_size}" # 默认是openthinker:32b
        base_model = extended_model

        # 根据模型 ID 确定量化类型
        if 'q4_k_m' in model_id.lower():
            quant = 'Q4_K_M'
            quant_info = "Q4_K_M 量化"
            extended_model = f"{base_model}-q4_k_m" # 量化之后的是openthinker:32b-q4_k_m
        elif 'q8_0' in model_id.lower():
            quant = 'Q8_0'
            quant_info = "Q8_0 量化"
            extended_model = f"{base_model}-q8_0"
        elif 'fp16' in model_id.lower():
            quant = 'FP16'
            quant_info = "FP16 量化"
            extended_model = f"{base_model}-fp16"

        # 构建模型 URL
        base_url = f"https://ollama.com/library/{base_model}"
        extended_url = f"https://ollama.com/library/{extended_model}"

        return base_model, extended_model, base_url, extended_url, quant, quant_info

    def _process_quantization(self, base_model, extended_model, base_url, model_id):
        """处理量化信息"""
        quant = 'BASE'  # 默认量化类型
        quant_info = "基础版本 (无量化)"

        # 哈希值与量化类型的映射
        hash_to_quant = {
            "aaffe05a5e2e": ("Q4_K_M", "Q4_K_M 量化"),  # 示例：哈希值 "aaffe05a5e2e" 对应 "Q4_K_M" 量化
            "another_hash": ("Q8_0", "Q8_0 量化"),  # 添加更多哈希值和量化类型的对应关系
        }

        if 'fp16' in model_id.lower():
            quant = 'FP16'
            extended_model = f"{base_model}-fp16" if base_model else f"{extended_model}-fp16"
            extended_url = f"https://ollama.com/library/{extended_model}"
            quant_info = "FP16 量化"
        elif 'q8_0' in model_id.lower():
            quant = 'Q8_0'
            extended_model = f"{base_model}-q8_0" if base_model else f"{extended_model}-q8_0"
            extended_url = f"https://ollama.com/library/{extended_model}"
            quant_info = "Q8_0 量化"
        elif 'q4_k_m' in model_id.lower():
            quant = 'Q4_K_M'
            extended_model = f"{base_model}-q4_k_m" if base_model else f"{extended_model}-q4_k_m"
            extended_url = f"https://ollama.com/library/{extended_model}"
            quant_info = "Q4_K_M 量化"
        else:
            # 尝试从哈希值映射中获取量化信息
            if model_id in hash_to_quant:
                quant, quant_info = hash_to_quant[model_id]
                extended_model = f"{base_model}-{quant.lower()}" if base_model else f"{extended_model}-{quant.lower()}"
                extended_url = f"https://ollama.com/library/{extended_model}"
            else:
                # 如果没有匹配的量化类型，则保持 base 模型
                extended_model = base_model
                extended_url = base_url
                quant_info = "基础版本 (无量化)"

        # 如果有量化信息，则返回 None 作为 base_model，否则返回原始的 base_model
        if quant != 'BASE':
            return None, extended_model, None, extended_url, quant, quant_info
        else:
            return base_model, extended_model, base_url, extended_url, quant, quant_info

    def parse_model_info(self, json_data, model_type, model_version):
        """解析和清理模型信息"""
        try:
            models = json.loads(json_data) if isinstance(json_data, str) else json_data
        except json.JSONDecodeError as e:
            print(f"JSON解析错误: {e}")
            return []

        cleaned_models = {}

        for model in models:
            try:
                print(f"正在处理模型: {model['model']}")  # 添加日志

                result = self.clean_model_id(model['model'], model_type, model_version)
                if result:
                    base_model, extended_model, base_url, extended_url, quant, quant_info = result
                else:
                    print(f"跳过模型 {model['model']}，因为 clean_model_id 返回 None")
                    continue

                print(f"clean_model_id 返回: base_model={base_model}, extended_model={extended_model}, quant={quant}, quant_info={quant_info}")  # 添加日志

                if not extended_model:
                    print(f"跳过模型 {model['model']}，因为 extended_model 为 None")  # 添加日志
                    continue

                size_match = re.search(r'(\d+\.?\d*)b', extended_model.lower())
                if not size_match:
                    print(f"警告：模型 '{model['model']}' 的 extended_model '{extended_model}' 中未找到大小信息，跳过。")
                    continue

                size_label = f"{size_match.group(1)}B"

                # 直接使用从页面获取的文件大小，不进行计算
                file_size = model['file_size']

                # 使用正确的 URL
                if base_model and base_url:
                    base_key = f"{base_model}-{quant}"
                    if base_key not in cleaned_models:
                        cleaned_models[base_key] = {
                            "model": base_model,
                            "size_label": size_label,
                            "file_size": file_size,  # 使用原始文件大小
                            "quantization": quant,
                            "quantization_info": quant_info,
                            "url": base_url
                        }

                extended_key = f"{extended_model}-{quant}"
                if extended_key not in cleaned_models:
                    cleaned_models[extended_key] = {
                        "model": extended_model,
                        "size_label": size_label,
                        "file_size": file_size,  # 使用原始文件大小
                        "quantization": quant,
                         "quantization_info": quant_info,
                        "url": extended_url  # 使用正确的extended_url
                    }
            except Exception as e:
                print(f"解析模型 '{model['model']}' 时出错: {e}")
                import traceback
                print(f"堆栈跟踪:\n{traceback.format_exc()}")
                continue

        return list(cleaned_models.values())

    def process_model(self, model_config):
        """处理指定类型的模型"""
        output_file = self.get_file_path(model_config['output_file'])

        # 检查文件是否已存在
        if os.path.exists(output_file):
            print(f"\n{model_config['name']}模型数据已存在于 {output_file}，跳过抓取...")
            return

        try:
            # 从 fetch_model_data 获取清理后的模型数据
            raw_models = self.fetch_model_data(model_config)
            cleaned_models = []

            # 遍历原始模型并清理模型 ID
            for raw_model in raw_models:
                model_name = raw_model['model']
                model_id = raw_model['model_id']  # 从抓取的原始数据中获取模型 ID
                file_size = raw_model['file_size']
                model_type = model_config['key']
                model_version = model_config['version']

                print(f"正在清理模型 ID: {model_name}, model_id: {model_id}")
                result = self.clean_model_id(
                    model_name,  # 将模型名称传递给 clean_model_id
                    model_type,
                    model_version
                )

                if result:
                    base_model, extended_model, base_url, extended_url, quant, quant_info = result
                else:
                    print(f"跳过 {model_name}，因为无法清理模型 ID")
                    continue

                if extended_model:
                    # 将其他信息添加到清理后的模型中
                    cleaned_model = {
                        "model": extended_model,
                        "size_label": self.get_size_label(extended_model),  # 使用辅助函数获取大小标签
                        "file_size": file_size,
                        "quantization": quant,
                        "quantization_info": quant_info,
                        "url": extended_url,
                        "model_id": model_id  # 保存哈希值
                    }
                    cleaned_models.append(cleaned_model)
                else:
                    print(f"跳过 {model_name}，因为无法清理模型 ID")


            # 定义量化方式的排序优先级
            quant_priority = {
                "BASE": 0,
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
                float(x["size_label"].replace("B", "")),
                quant_priority.get(x["quantization"], 999),
                len(x["model"])
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

        # 尝试获取系统证书路径
        system_certs = None
        for path in ['/etc/ssl/certs/ca-certificates.crt', '/etc/ca-certificates/pem']:
            if os.path.exists(path):
                system_certs = path
                break

        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            # 使用 verify 参数，如果找到了系统证书
            if system_certs:
                response = requests.get(tags_url, headers=headers, verify=system_certs)
            else:
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

                # 提取模型id和文件大小
                model_id = None
                file_size = None

                # 查找包含模型 ID 和文件大小的 div
                info_div = div.find('div', class_='flex items-baseline space-x-1 text-[13px] text-neutral-500')
                if info_div:
                    info_span = info_div.find('span')
                    if info_span:
                        info_text = info_span.get_text(strip=True)
                        parts = info_text.split("•")  # 使用 "•" 分隔文本
                        if len(parts) >= 2:
                            model_id_match = re.match(r'^([a-f0-9]+)', parts[0].strip())  # 提取模型ID
                            if model_id_match:
                                model_id = model_id_match.group(1)
                            file_size_match = re.search(r'([\d.]+ ?[KMGT]B)', parts[1].strip())  # 提取文件大小
                            if file_size_match:
                                file_size = file_size_match.group(1)

                if model_id and file_size:
                    model_data = {
                        "model": model_name,
                        "model_id": model_id,  # 保存哈希值
                        "file_size": file_size
                    }
                    print(f"添加数据: {model_data}")
                    models_data.append(model_data)
                else:
                    print(f"未能提取模型ID或文件大小，跳过模型: {model_name}")

            return models_data

        except requests.exceptions.RequestException as e:
            print(f"请求出错：{e}")
            return []
        except Exception as e:
            print(f"发生未预期的错误：{e}")
            return []

    # 新增一个通用方法，用于获取页面中所有模型数据
    def fetch_and_parse_models(self, tags_url, max_models=None):
        """从指定URL获取并解析模型数据，支持返回指定数量的模型，并根据哈希校验量化信息，同时访问模型链接获取更多参数"""
        models = []
        # 定制请求头（可根据需要调整）
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        try:
            response = requests.get(tags_url, headers=headers, verify=False)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            model_divs = soup.find_all("div", class_="flex px-4 py-3")
            # 哈希值和量化类型映射（根据实际情况扩展）
            hash_to_quant = {
                "aaffe05a5e2e": ("Q4_K_M", "Q4_K_M 量化"),
                "another_hash": ("Q8_0", "Q8_0 量化"),
            }
            count = 0
            for div in model_divs:
                if max_models and count >= max_models:
                    break
                # 获取模型名称和对应链接
                a = div.find("a", class_="group")
                if not a:
                    continue
                model_name = a.get_text(strip=True)
                relative_url = a.get("href")
                full_url = ("https://ollama.com" + relative_url) if relative_url.startswith("/") else relative_url

                # 获取包含哈希值、文件大小等信息的元素
                info_div = div.find("div", class_="flex items-baseline space-x-1 text-[13px] text-neutral-500")
                if not info_div:
                    continue
                span = info_div.find("span")
                if not span:
                    continue

                # 提取哈希值（位于 font-mono 的 span 内）
                hash_span = span.find("span", class_="font-mono")
                if not hash_span:
                    continue
                hash_val = hash_span.get_text(strip=True)

                # 利用分隔符 '•' 提取文件大小（通常为第二部分）
                parts = span.get_text(" ", strip=True).split("•")
                file_size = parts[1].strip() if len(parts) > 1 else None

                # 构建初步模型数据
                model_info = {
                    "model": model_name,
                    "model_id": hash_val,
                    "file_size": file_size,
                    "url": full_url,
                }

                # 根据哈希值校验量化信息
                if hash_val in hash_to_quant:
                    quant, quant_info = hash_to_quant[hash_val]
                    model_info["quantization"] = quant
                    model_info["quantization_info"] = quant_info
                else:
                    model_info["quantization"] = "BASE"
                    model_info["quantization_info"] = "基础版本 (无量化)"

                # 访问对应链接获取更多详细参数
                additional_params = self.fetch_model_parameters(full_url)
                if additional_params:
                    model_info.update(additional_params)

                models.append(model_info)
                count += 1

            return models

        except Exception as e:
            print(f"Error fetching models from {tags_url}: {e}")
            return []

    # 新增辅助方法，访问模型链接以获取更多参数
    def fetch_model_parameters(self, model_url):
        """进入模型链接页面，解析并返回更多附加的参数"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        try:
            response = requests.get(model_url, headers=headers, verify=False)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            additional_params = {}
            # 示例：假设页面中存在 class 为 "additional-params" 的div，其中包含更多参数
            params_div = soup.find("div", class_="additional-params")
            if params_div:
                for p in params_div.find_all("p"):
                    key_tag = p.find("strong")
                    if key_tag:
                        key = key_tag.get_text(strip=True).rstrip(":")
                        # 获取紧跟在 key 后的文本作为值
                        value = key_tag.next_sibling.strip() if key_tag.next_sibling else ""
                        additional_params[key] = value
            return additional_params
        except Exception as e:
            print(f"Error fetching additional parameters from {model_url}: {e}")
            return {}

def main():
    processor = ModelProcessor()

    # 显示处理开始信息
    print("\n开始处理模型数据...")
    print("已配置的模型:")
    for model in processor.config['models']:
        print(f"- {model['name']}")

    # 处理每个模型
    for model_config in processor.config['models']:
        output_file = processor.get_file_path(model_config['output_file'])
        if os.path.exists(output_file):
            print(f"\n跳过 {model_config['name']} - 数据文件已存在: {output_file}")
            continue

        print(f"\n处理 {model_config['name']} 模型...")
        processor.process_model(model_config)

if __name__ == "__main__":
    main()
