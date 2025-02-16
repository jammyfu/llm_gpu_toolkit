export interface TableModelInfo {
  key: string;
  fullModel: string;
  arch: string;
  parameters: string;
  file_size: string;
  quantization: string;
  quantization_info: string;
  url: string;
  runStatus: "can-run" | "barely-run" | "cannot-run";
  statusText: string;
  requiredVram: number;
}

export interface ModelDetail {
  model: string;
  configName?: string;
  description: string;
  description_en?: string;
  /** 是否为默认模型 */
  is_default: boolean;
  /** 模型的量化方式，例如 "Q8_0" */
  quantization: string;
  /** 量化相关的信息 */
  quantization_info: string;
  /** 模型架构 */
  arch: string;
  /** 模型参数 */
  parameters: string;
  /** 模型文件大小，例如 "1.5 GB" */
  file_size: string;
  /** 模型的下载或详情 URL */
  url: string;
}

export interface ModelConfig {
  name: string;
  output_file: string;
  description: string;
  description_en?: string;
}

export type RunStatus = "can-run" | "barely-run" | "cannot-run";

export interface Config {
  output_dirs: {
    dirs: string;
  };
  models: ModelConfig[];
}

export interface ApiConfig extends Omit<Config, 'output_dirs'> {
  output_dirs?: {
    dirs: string;
  };
}

export interface ModelData {
  name: string;
  model: string;
  url: string;
  is_default: boolean;
  model_id: string;
  file_size: string;
  arch: string;
  parameters: string;
  quantization: string;
  quantization_info: string;
} 