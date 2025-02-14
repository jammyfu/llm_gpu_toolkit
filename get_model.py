import re
import json
import urllib3
import requests
from pathlib import Path
from bs4 import BeautifulSoup
import os
import time

# 禁用 SSL 警告
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ModelProcessor:
    def __init__(self, config_path='config.json'):
        """初始化模型处理器，加载配置和设置目录"""
        self.load_config(config_path)
        self.setup_directories()
        self.model_type_handlers = {
            "deepseek": self._process_deepseek_model,
        }

    def load_config(self, config_path):
        """加载配置文件"""
        with open(config_path, 'r', encoding='utf-8') as f:
            self.config = json.load(f)

    def setup_directories(self):
        """创建必要的目录结构"""
        output_dir = self.config.get("output_dirs", {}).get("cleaned", "modeldata/cleaned")
        Path(output_dir).mkdir(parents=True, exist_ok=True)

    def get_file_path(self, filename, is_cleaned=False):
        """获取文件的完整路径"""
        output_dir = self.config.get("output_dirs", {}).get("cleaned", "modeldata/cleaned")
        return str(Path(output_dir) / filename)

    def _process_deepseek_model(self, base_size, model_id, model_version):
        """处理 Deepseek 模型"""
        model_config = next(
            (model for model in self.config['models']
             if model['key'] == 'deepseek' and model['version'] == model_version),
            None
        )

        if not model_config or 'tags_url' not in model_config:
            raise ValueError(f"未找到 deepseek {model_version} 的配置信息或 tags_url")

        tags_url = model_config['tags_url']
        models = self.fetch_and_parse_models(tags_url)

        output_file = self.get_file_path(f"deepseek_{model_version.lower()}_models.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(models, f, ensure_ascii=False, indent=2)

        return models

    def process_model(self, model_config):
        """处理指定类型的模型"""
        output_file = self.get_file_path(model_config['output_file'])

        if os.path.exists(output_file):
            print(f"\n{model_config['name']}模型数据已存在于 {output_file}，跳过抓取...")
            return

        try:
            raw_models = self.fetch_model_data(model_config)

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

            raw_models.sort(key=lambda x: (
                float(x.get("size_label", "0B").replace("B", "")),
                quant_priority.get(x.get("quantization", ""), 999),
                len(x.get("model", ""))
            ))

            if raw_models:
                json_output = json.dumps(raw_models, indent=2, ensure_ascii=False)
                print(f"\n{model_config['name']}模型信息:")
                print(json_output)

                with open(output_file, "w", encoding="utf-8") as f:
                    f.write(json_output)
                print(f"\n共处理 {len(raw_models)} 个唯一模型")
                print(f"数据保存在: {output_file}")
            else:
                print(f"未获取到任何有效的{model_config['name']}模型信息")

        except Exception as e:
            print(f"处理{model_config['name']}模型时出错: {e}")
            import traceback
            print(f"堆栈跟踪:\n{traceback.format_exc()}")

    def fetch_model_data(self, model_config):
        """从网页获取模型数据，精确匹配下拉列表中的默认模型名称，latest 也是默认模型"""
        tags_url = model_config['tags_url']
        model_prefix = model_config.get('prefix', '')

        try:
            import urllib3
            import time
            import re
            from bs4 import BeautifulSoup

            # 禁用 SSL 警告
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            session = requests.Session()
            session.verify = False
            
            # 首先获取主页面，查找下拉列表中的默认模型
            base_url = tags_url.replace('/tags', '')
            print(f"\n获取主页面 {base_url} 的响应状态: ", end='')
            response = session.get(base_url, headers=headers)
            response.raise_for_status()
            print(response.status_code)
            
            main_soup = BeautifulSoup(response.text, 'html.parser')
            default_models = set()
            
            # 从下拉列表获取默认模型（精确匹配）
            nav = main_soup.find('nav', {'id': 'tags-nav'})
            if nav:
                for link in nav.find_all('a', href=True):
                    if '/tags' not in link['href']:  # 排除 "View all" 链接
                        model_name = link.find('span', {'title': True})['title']
                        default_models.add(model_name)
                        print(f"添加默认模型: {model_name}")
            
            print(f"找到所有默认模型: {default_models}")
            
            # 获取 tags 页面的所有模型
            print(f"\n获取标签页面 {tags_url} 的响应状态: ", end='')
            response = session.get(tags_url, headers=headers)
            response.raise_for_status()
            print(response.status_code)
            
            soup = BeautifulSoup(response.text, 'html.parser')
            models_data = []
            model_divs = soup.find_all('div', class_='flex px-4 py-3')
            print(f"\n找到 {len(model_divs)} 个模型div")
            
            details_by_model_id = {}
            
            for div in model_divs:
                try:
                    model_link = div.find('a')
                    if not model_link:
                        continue

                    # 获取模型名称
                    raw_model_name_tag = model_link.find('div', class_='break-all')
                    if raw_model_name_tag:
                        raw_model_name = raw_model_name_tag.get_text(strip=True)
                    else:
                        raw_model_name = model_link.get_text(strip=True)

                    # 判断是否为默认模型
                    # 1. 检查是否为 latest 标签
                    is_latest = 'latest' in raw_model_name.lower()
                    # 2. 检查是否精确匹配下拉列表中的模型名称
                    is_in_dropdown = raw_model_name in default_models
                    is_default_model = is_latest or is_in_dropdown
                    
                    full_model_name = f"{model_prefix}:{raw_model_name}" if model_prefix else raw_model_name
                    print(f"\n处理模型: {full_model_name} {'(默认模型)' if is_default_model else ''}")
                    
                    # 获取详情页 URL
                    relative_url = model_link.get('href', '')
                    if relative_url:
                        absolute_url = f"https://ollama.com{relative_url}" if relative_url.startswith('/') else f"https://ollama.com/{relative_url}"
                    else:
                        print(f"未找到模型 {full_model_name} 的详情页 URL")
                        continue
                    
                    model_data = {
                        "model": full_model_name,
                        "url": absolute_url,
                        "is_default": is_default_model
                    }
                    
                    # 从 tag 页面获取基础信息
                    info_div = div.find('div', class_='flex items-baseline space-x-1 text-[13px] text-neutral-500')
                    if info_div:
                        span_tag = info_div.find('span')
                        if span_tag:
                            info_text = span_tag.get_text(strip=True)
                            hash_match = re.search(r'([a-f0-9]{12})', info_text)
                            if hash_match:
                                model_data["model_id"] = hash_match.group(1)
                            parts = info_text.split("•")
                            if len(parts) >= 2:
                                size_match = re.search(r'([\d.]+ ?[KMGT]B)', parts[1].strip())
                                if size_match:
                                    model_data["file_size"] = size_match.group(1)
                    
                    # 获取详情页信息
                    model_id = model_data.get("model_id")
                    details = {}
                    
                    print(f"获取详情页信息: {absolute_url}")
                    try:
                        detail_response = session.get(absolute_url, headers=headers)
                        detail_response.raise_for_status()
                        detail_soup = BeautifulSoup(detail_response.text, 'html.parser')
                        
                        # 查找模型信息区域
                        model_info_div = detail_soup.find('div', class_='min-w-full divide-y divide-gray-200')
                        if model_info_div:
                            info_items = model_info_div.find_all('div', class_='flex sm:space-x-2 items-center')
                            for item in info_items:
                                label = item.find('span', class_='hidden sm:block')
                                value = item.find('span', class_='text-neutral-400')
                                if label and value:
                                    key = label.get_text(strip=True).lower()
                                    val = value.get_text(strip=True)
                                    print(f"找到信息: {key} = {val}")
                                    
                                    if key == 'arch':
                                        details["arch"] = val
                                    elif key == 'parameters':
                                        details["parameters"] = val
                                    elif key == 'quantization':
                                        quant_value = val.upper()
                                        details["quantization"] = quant_value
                                        # 使用英文格式
                                        if is_default_model:
                                            details["quantization_info"] = f"Default ({quant_value})"
                                        else:
                                            details["quantization_info"] = f"{quant_value}"
                        
                        # 获取描述信息
                        desc_div = detail_soup.find('div', class_='prose dark:prose-invert')
                        if desc_div:
                            details["description"] = desc_div.get_text(strip=True)
                        
                        if model_id:
                            details_by_model_id[model_id] = details
                        
                        print("\n找到的详细信息:")
                        for key, value in details.items():
                            print(f"{key}: {value}")
                        
                        time.sleep(1)
                    except Exception as detail_error:
                        print(f"获取详情页信息失败: {detail_error}")
                    
                    # 合并详情数据
                    for key, value in details.items():
                        if key not in model_data:
                            model_data[key] = value
                    
                    print(f"最终数据: {model_data}")
                    models_data.append(model_data)
                except Exception as model_error:
                    print(f"处理单个模型时出错: {model_error}")
                    continue
            
            # 按照模型名称排序，但默认模型排在前面
            models_data.sort(key=lambda x: (not x.get('is_default', False), x.get("model", "")))
            return models_data

        except Exception as e:
            print(f"获取模型数据时出错: {e}")
            import traceback
            print(f"堆栈跟踪:\n{traceback.format_exc()}")
            return []

    def fetch_quantization_details(self, model_url, headers):
        """进入模型链接页面，解析并返回量化信息"""
        try:
            response = requests.get(model_url, headers=headers, verify=False)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # 查找量化信息
            quantization = "Q4_K_M"  # 默认量化
            quantization_info = "Q4_K_M 量化"
            size_label = "7B" # 默认大小

            params_div = soup.find('div', class_='grid grid-cols-2 gap-4')
            if params_div:
                param_items = params_div.find_all('div', class_='flex flex-col')
                for item in param_items:
                    label = item.find('div', class_='text-sm text-neutral-500')
                    value = item.find('div', class_='font-mono')
                    if label and value:
                        key = label.get_text(strip=True).lower()
                        val = value.get_text(strip=True)

                        if 'quantization' in key:
                            quantization = val.upper()
                            quantization_info = f"{quantization} 量化"
                            break
            # 获取 size label

            name_div = soup.find('div', class_='font-mono break-all')
            if name_div:
                raw_name = name_div.get_text(strip=True)
                if raw_name.strip().lower() == "latest":
                    size_label = "7B"  # 根据示例，latest 映射为 7B
                else:
                    size_match = re.match(r'([\d\.]+)[bB]', raw_name)
                    if size_match:
                        size_label = size_match.group(1) + "B"
                    else:
                        size_label = raw_name.upper()
            return quantization, quantization_info, size_label

        except Exception as e:
            print(f"Error fetching quantization details from {model_url}: {e}")
            return "Q4_K_M", "Q4_K_M 量化", "7B" #返回默认值

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

    # 新增辅助方法：剥离模型名称中的量化信息后缀
    def strip_quant_info(self, model_name):
        """
        去除模型名称末尾的量化参数信息，
        例如将 "1.5b-qwen-distill-q4_K_M" 转换为 "1.5b-qwen-distill"
        """
        pattern = re.compile(r'-(fp16|q\d+(?:_[A-Za-z0-9]+)*)$', re.IGNORECASE)
        return pattern.sub('', model_name)

    def parse_model_details(self, raw_name):
        """
        根据原始模型名称解析出：
          - base_name: 去除量化后缀的基础名称
          - quant: 量化值（如 FP16, Q4_K_M, Q8_0），如果无则默认 Q4_K_M
          - quantization_info: 对应的量化描述信息
          - size_label: 模型尺寸标签（例如 "1.5B"），以名称中的数字为依据，
                        如果名称为 latest，则固定映射为 "7B"
        """
        # 匹配量化后缀（支持 fp16、q8_0、q4_k_m、q4_k_s 等格式，不区分大小写）
        quant_pattern = re.compile(r'-(fp16|q\d+_k(?:_m|_s)?|q\d+_0)$', re.IGNORECASE)
        match = quant_pattern.search(raw_name)
        if match:
            quant = match.group(1).upper()
            quantization_info = f"{quant} 量化"
            base_name = raw_name[:match.start()]
        else:
            quant = "Q4_K_M"
            quantization_info = "默认版本 (Q4_K_M)"
            base_name = raw_name

        # 计算尺寸标签
        if base_name.strip().lower() == "latest":
            size_label = "7B"  # 根据示例，latest 映射为 7B
        else:
            size_match = re.match(r'([\d\.]+)[bB]', base_name)
            if size_match:
                size_label = size_match.group(1) + "B"
            else:
                size_label = base_name.upper()

        return base_name, quant, quantization_info, size_label

    def fetch_and_parse_models(self, tags_url, max_models=None):
        """
        从指定 URL 获取并解析模型数据，保留页面原始信息，
        并在获取 tag 页面信息后调用 fetch_model_parameters 获取更多附加信息。
        每个模型信息中都会包含 "url" 字段，存储完整的模型详情页地址，
        例如 "r1:7b" 对应 https://ollama.com/library/deepseek-r1:7b
        """
        models = []
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        try:
            print(f"\n获取页面 {tags_url} 的响应状态: ", end='')
            response = requests.get(tags_url, headers=headers, verify=False)
            response.raise_for_status()
            print(response.status_code)
            
            soup = BeautifulSoup(response.text, 'html.parser')
            model_divs = soup.find_all("div", class_="flex px-4 py-3")
            print(f"\n找到 {len(model_divs)} 个模型div\n")
            
            for div in model_divs:
                a_tag = div.find("a", class_="group")
                if not a_tag:
                    continue
                    
                # 获取模型原始名称
                raw_model_name = a_tag.find("div", class_="break-all").get_text(strip=True)
                print(f"处理模型: {raw_model_name}")

                # 获取详情页面的相对地址
                relative_url = a_tag.get("href")
                # 构造完整链接，用于数据抓取和最终存储，例如 "/library/deepseek-r1:7b" -> "https://ollama.com/library/deepseek-r1:7b"
                fetch_url = f"https://ollama.com{relative_url}" if relative_url.startswith("/") else relative_url
                    
                info_div = div.find("div", class_="flex items-baseline space-x-1")
                if not info_div:
                    continue
                    
                info_text = info_div.get_text(" ", strip=True)
                # 提取文件大小信息
                size_match = re.search(r'(\d+(?:\.\d+)?[KMGT]B)', info_text)
                file_size = size_match.group(1) if size_match else ""

                # 根据原始名称解析量化信息及尺寸标签
                base_name, quant, quant_info, size_label = self.parse_model_details(raw_model_name)

                # 直接在输出中存储完整的 URL
                model_info = {
                    "model": f"deepseek-r1:{raw_model_name}",
                    "file_size": file_size,
                    "size_label": size_label,
                    "quantization": quant,
                    "quantization_info": quant_info,
                    "url": fetch_url
                }

                # 调用详情页获取更多附加信息（使用完整 URL）
                additional_params = self.fetch_model_parameters(fetch_url)
                if additional_params:
                    model_info.update(additional_params)

                print(f"添加数据: {model_info}\n")
                models.append(model_info)

                if max_models and len(models) >= max_models:
                    break

            return models

        except Exception as e:
            print(f"Error fetching models from {tags_url}: {e}")
            import traceback
            print(f"堆栈跟踪:\n{traceback.format_exc()}")
            return []

    def get_size_label(self, model_name):
        """
        根据模型名称解析出：
          - size_label: 模型尺寸标签（例如 "1.5B"），以名称中的数字为依据，
                        如果名称为 latest，则固定映射为 "7B"
        """
        # 匹配量化后缀（支持 fp16、q8_0、q4_k_m、q4_k_s 等格式，不区分大小写）
        quant_pattern = re.compile(r'-(fp16|q\d+_k(?:_m|_s)?|q\d+_0)$', re.IGNORECASE)
        match = quant_pattern.search(model_name)
        if match:
            quant = match.group(1).upper()
            base_name = model_name[:match.start()]
        else:
            base_name = model_name

        # 计算尺寸标签
        if base_name.strip().lower() == "latest":
            size_label = "7B"  # 根据示例，latest 映射为 7B
        else:
            size_match = re.match(r'([\d\.]+)[bB]', base_name)
            if size_match:
                size_label = size_match.group(1) + "B"
            else:
                size_label = base_name.upper()

        return size_label

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
