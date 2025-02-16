import { Config } from "../types/modelTypes";

export const config: Config = {
  output_dirs: {
    dirs: "/default/output" // 可根据需要修改默认路径
  },
  models: [
    {
      name: "DeepSeek R1",
      description:
        "作为一个由 DeepSeek 公司开发的模型，在代码生成、理解和数学推理方面拥有显著优势。",
      description_en:
        "Developed by DeepSeek, DeepSeek R1 excels in code generation, comprehension, and mathematical reasoning.",
      output_file: "deepseek_r1.bin" // 添加 output_file 属性
    },
    {
      name: "LLM X2",
      description:
        "LLM X2 是一个高效能的通用大语言模型，适用于各类型任务。",
      description_en:
        "LLM X2 is a versatile large-language model designed for diverse tasks.",
      output_file: "llm_x2.bin" // 添加 output_file 属性
    },
    // 可根据具体需求添加更多模型数据
  ],
}; 