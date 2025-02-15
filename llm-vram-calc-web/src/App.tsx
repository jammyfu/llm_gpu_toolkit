import React, { useEffect, useState, useMemo } from 'react';
import { Form, InputNumber, Select, Card, message, Tooltip, Switch, theme, Button, Space, QRCode, Table } from 'antd';
import { SunOutlined, MoonOutlined, TranslationOutlined, CheckOutlined, ClearOutlined, CopyOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import type { ColumnsType } from 'antd/es/table';
import type { DefaultOptionType } from 'antd/es/select';

// 定义主题接口
interface ThemeInterface {
  isDark: boolean;
}

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }
  
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props: { theme: ThemeInterface }) => props.theme.isDark ? '#141414' : '#ffffff'};
    transition: background-color 0.3s ease;
  }
`;

const StyledApp = styled.div<{ $isDark: boolean }>`
  margin: 0 auto;
  padding: 1.25rem; // 20px
  background-color: ${props => props.$isDark ? '#141414' : '#ffffff'};
  color: ${props => props.$isDark ? '#ffffff' : '#000000'};
  min-height: 100vh;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 135rem; // 2160px
  
  @media (max-width: 48rem) { // 768px
    padding: 0.625rem; // 10px
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    margin: 0;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon-button {
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 0.25rem;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background-color: ${props => props.theme.isDark ? '#1f1f1f' : '#f5f5f5'};
      }
    }
  }

  @media (max-width: 48rem) {
    .title {
      font-size: 1.25rem;
    }
    
    .controls {
      gap: 0.75rem;
    }
  }
`;

const ContentCard = styled(Card)`
  .ant-card-body {
    padding: 1.5rem;
  }

  @media (max-width: 48rem) {
    .ant-card-body {
      padding: 1rem;
    }
  }
`;

const StyledCard = styled(Card)`
  .ant-card-head-title {
    font-size: 1.25rem;
    padding: 1rem 0;
    font-weight: 600;
  }
  
  .ant-form-item {
    margin-bottom: 1.25rem;
    
    .ant-form-item-label > label {
      font-size: 1rem;
      height: 2.25rem;
    }
  }

  .ant-form-item-explain-error {
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-selection-overflow {
    @media (min-width: 62.5rem) { // 1000px
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: thin;
      
      &::-webkit-scrollbar {
        height: 0.25rem;
      }
      
      &::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.isDark ? '#404040' : '#d9d9d9'};
        border-radius: 0.125rem;
      }
      
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
    }
    
    @media (max-width: 62.5rem) { // 1000px
      flex-wrap: wrap;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .ant-select-selection-item {
    @media (min-width: 62.5rem) {
      flex: 0 0 auto;
    }
    
    @media (max-width: 62.5rem) {
      flex: 1 1 auto;
    }
  }
` as typeof Select;

const StyledInputNumber = styled(InputNumber)`
  .ant-input-number-input {
    font-size: 1rem;
    height: 2.25rem;
  }

  .ant-input-number-handler-wrap {
    width: 1.5rem;
  }
` as typeof InputNumber;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 62.5rem) { // 1000px
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SelectActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  .ant-btn {
    padding: 0.25rem 0.75rem;
    height: auto;
    font-size: 0.875rem;
    
    .anticon {
      font-size: 0.875rem;
    }
  }
`;

const MemoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  .ant-btn {
    padding: 0.25rem 0.75rem;
    height: auto;
    font-size: 0.875rem;
  }
`;

interface ModelData {
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

interface Config {
  output_dirs: {
    dirs: string;
  };
  models: ModelConfig[];
}

interface ModelDetail {
  model: string;           // 具体模型名称，如 "671b-q8_0"
  url: string;             // 模型链接
  is_default: boolean;     // 是否默认
  model_id: string;        // 模型ID
  file_size: string;       // 文件大小
  arch: string;            // 架构
  parameters: string;      // 参数量
  quantization: string;    // 量化方式
  quantization_info: string; // 量化信息
  configName?: string;     // 来自 config 的模型名称，用于匹配
}

interface ModelConfig {
  name: string;           // 模型名称，如 "deepseek-r1"
  output_file: string;    // JSON 文件路径，如 "model/deepseek_r1_models.json"
  description: string;    // 中文描述
  description_en?: string; // 英文描述
}

// 更新下拉选项类型定义
interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  
  .qr-title {
    margin-bottom: 1rem;
    color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    font-size: 1rem;
  }
  
  .qr-code {
    padding: 1rem;
    background-color: ${props => props.theme.isDark ? '#1f1f1f' : '#ffffff'};
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// 定义运行状态类型
type RunStatus = 'can-run' | 'barely-run' | 'cannot-run';

// 更新表格数据结构
interface TableModelInfo {
  key: string;
  fullModel: string;
  arch: string;
  parameters: string;
  file_size: string;
  quantization: string;
  quantization_info: string;
  url: string;
  runStatus: RunStatus;     // 添加运行状态
  statusText: string;       // 添加状态文本
  requiredVram: number;     // 添加所需显存
}

// 定义状态颜色类型
type StatusColors = {
  [key in RunStatus]: {
    color: string;
    bg: string;
  }
}

// 状态颜色配置
const statusColors: StatusColors = {
  'can-run': { color: '#a9d134', bg: '#f6ffed' },     // 使用主题色
  'barely-run': { color: '#faad14', bg: '#fffbe6' },  // 保持黄色
  'cannot-run': { color: '#ff4d4f', bg: '#fff2f0' }   // 保持红色
};

// 状态排序配置
const statusOrder: { [key in RunStatus]: number } = {
  'can-run': 0,
  'barely-run': 1,
  'cannot-run': 2
};

// 修复重复的 Q8_0 键
const QUANTIZATION_BITS: { [key: string]: number } = {
  'FP32': 32,
  'FP16': 16,
  'Q8_0': 8,
  'Q4_K_M': 4,
  'Q5_K_M': 5,
  'Q6_K_M': 6,
  'Q2_K': 2,
  'Q3_K_S': 3,
  'Q3_K_M': 3,
  'Q3_K_L': 3,
  'Q4_0': 4,
  'Q4_1': 4,
  'Q5_0': 5,
  'Q5_1': 5,
  'Q6_K': 6
};

// 更新显存计算函数
function calculateMemoryRequirement(fileSize: string, quantization: string): number {
    // 1. 从文件大小字符串中提取数字和单位
    const sizeMatch = fileSize.match(/(\d+\.?\d*)\s*(GB|TB)/i);
    if (!sizeMatch) return 0.5;
    
    // 2. 转换文件大小为 GB
    let size = parseFloat(sizeMatch[1]);
    if (sizeMatch[2].toUpperCase() === 'TB') {
        size *= 1024; // 转换 TB 到 GB
    }
    
    // 3. 根据量化方式计算显存倍数
    let memoryMultiplier;
    switch (quantization.toUpperCase()) {
        case 'FP16': 
            memoryMultiplier = 2.0;
            break;
        case 'Q8_0':
            memoryMultiplier = 1.5;
            break;
        case 'Q4_K_M':
        case 'Q4_0':
        case 'Q4_1':
            memoryMultiplier = 1.2;
            break;
        default:
            memoryMultiplier = 1.2; // 默认倍数
    }
    
    // 4. 计算基础显存需求
    let memoryRequired = size * memoryMultiplier;
    
    // 5. 添加额外开销（KV cache、优化器状态等）
    memoryRequired *= 1.1; // 额外 10% 用于系统开销
    
    // 6. 确保最小显存需求
    return Math.max(memoryRequired, 0.5);
}

function App() {
  const [config, setConfig] = useState<Config | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [gpuMemory, setGpuMemory] = useState<number>(24);
  const [calcResult, setCalcResult] = useState<string>('');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [modelDetails, setModelDetails] = useState<ModelDetail[]>([]);
  const [selectedQuant, setSelectedQuant] = useState<string>('');
  const [quantOptions, setQuantOptions] = useState<{ label: string; value: string }[]>([]);
  const [tableData, setTableData] = useState<TableModelInfo[]>([]);

  // 使用 message.useMessage 钩子获取动态提示 API 与 contextHolder
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<TableModelInfo> = [
    {
      title: language === 'zh' ? '模型名称' : 'Model Name',
      dataIndex: 'fullModel',
      key: 'fullModel',
      width: 200,
      fixed: 'left',
      sorter: (a, b) => a.fullModel.localeCompare(b.fullModel),
      render: (text, record: TableModelInfo) => (
        <Tooltip title={language === 'zh' ? '点击跳转到模型页面' : 'Click to view model page'}>
          <span
            style={{ 
              cursor: 'pointer',
              color: isDarkMode ? '#a9d134' : '#7c9a2e',  // 暗色模式保持原色，亮色模式使用更深的绿色
              textDecoration: 'underline' 
            }}
            onClick={() => {
              window.location.href = record.url;
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: language === 'zh' ? '架构' : 'Architecture',
      dataIndex: 'arch',
      key: 'arch',
      width: 120,
      sorter: (a, b) => a.arch.localeCompare(b.arch),
    },
    {
      title: language === 'zh' ? '参数量' : 'Parameters',
      dataIndex: 'parameters',
      key: 'parameters',
      width: 120,
      sorter: (a, b) => {
        const aValue = parseFloat(a.parameters.replace(/[^0-9.]/g, ''));
        const bValue = parseFloat(b.parameters.replace(/[^0-9.]/g, ''));
        return aValue - bValue;
      },
    },
    {
      title: language === 'zh' ? '文件大小' : 'File Size',
      dataIndex: 'file_size',
      key: 'file_size',
      width: 120,
      sorter: (a, b) => {
        const aValue = parseFloat(a.file_size.replace(/[^0-9.]/g, ''));
        const bValue = parseFloat(b.file_size.replace(/[^0-9.]/g, ''));
        return aValue - bValue;
      },
    },
    {
      title: language === 'zh' ? '量化方式' : 'Quantization',
      dataIndex: 'quantization',
      key: 'quantization',
      width: 150,
      sorter: (a, b) => a.quantization.localeCompare(b.quantization),
    },
    {
      title: language === 'zh' ? '显存估值' : 'VRAM Estimate',
      dataIndex: 'requiredVram',
      key: 'requiredVram',
      width: 120,
      render: (vram: number) => `${vram.toFixed(1)} GB`,
      sorter: (a, b) => a.requiredVram - b.requiredVram,
    },
    {
      title: language === 'zh' ? '运行状态' : 'Run Status',
      key: 'runStatus',
      width: 120,
      render: (_, record: TableModelInfo) => {
        const style = statusColors[record.runStatus];
        
        const requiredGPUs = Math.ceil(record.requiredVram / gpuMemory);
        
        const tooltipText = language === 'zh' 
          ? `需要显存: ${record.requiredVram.toFixed(1)}GB${requiredGPUs > 1 ? `\n需要 ${requiredGPUs} 张显卡` : ''}`
          : `Required VRAM: ${record.requiredVram.toFixed(1)}GB${requiredGPUs > 1 ? `\nNeeds ${requiredGPUs} GPUs` : ''}`;
        
        return (
          <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{tooltipText}</span>}>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: isDarkMode ? 'transparent' : style.bg,
              color: style.color,
              border: `1px solid ${style.color}`
            }}>
              {record.statusText}
            </span>
          </Tooltip>
        );
      },
      sorter: (a: TableModelInfo, b: TableModelInfo) => {
        return statusOrder[a.runStatus] - statusOrder[b.runStatus];
      }
    },
    {
      title: language === 'zh' ? '复制命令' : 'Copy Command',
      key: 'copy',
      width: 120,
      render: (_, record) => {
        const style = statusColors[record.runStatus];
        return (
          <Button
            icon={<CopyOutlined />}
            type="primary"
            style={{
              backgroundColor: isDarkMode ? style.color : (record.runStatus === 'can-run' ? '#7c9a2e' : style.color),
              borderColor: isDarkMode ? style.color : (record.runStatus === 'can-run' ? '#7c9a2e' : style.color),
              opacity: record.runStatus === 'cannot-run' ? 0.7 : 1,
            }}
            onClick={() => {
              const parts = record.url.split('/').filter(item => item);
              const modelNameFromUrl = parts[parts.length - 1];
              const command = `ollama pull ${modelNameFromUrl}`;
              navigator.clipboard.writeText(command)
                .then(() => {
                  messageApi.success(
                    language === 'zh'
                      ? `命令复制成功：${modelNameFromUrl}`
                      : `Command Copied Successfully: ${modelNameFromUrl}`
                  );
                })
                .catch(() => {
                  messageApi.error(language === 'zh' ? '复制失败' : 'Copy failed');
                });
            }}
          >
            {language === 'zh' ? '复制命令' : 'Copy Command'}
          </Button>
        );
      }
    }
  ];

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/modeldata/config.json`)
      .then(response => response.json())
      .then((data: Config) => {
        setConfig(data);
        if (data.models.length > 0) {
          setSelectedModels([data.models[0].name]);
        }
      })
      .catch(err => {
        console.error('加载配置失败', err);
      });
  }, []);

  useEffect(() => {
    if (!config || selectedModels.length === 0) return;
    
    const fetchModelDetails = async () => {
      try {
        const allDetails: ModelDetail[] = [];
        
        for (const modelName of selectedModels) {
          const model = config.models.find(m => m.name === modelName);
          if (!model) continue;
          
          const modelDataPath = `${process.env.PUBLIC_URL}/${config.output_dirs.dirs}/${model.output_file}`;
          const response = await fetch(modelDataPath);
          const data: ModelDetail[] = await response.json();
          const annotatedDetails = data.map(detail => ({ ...detail, configName: modelName }));
          allDetails.push(...annotatedDetails);
        }
        
        setModelDetails(allDetails);
        
        // 检查是否存在默认模型
        const defaultExists = allDetails.some(detail => detail.is_default);
        // 获取所有量化值并去重
        const uniqueQuants = Array.from(new Set(allDetails.map(detail => detail.quantization)));
        // 按量化值从小到大排序（假设量化值中包含数值，比如 "8-bit"、"16-bit"）
        const sortedUniqueQuants = uniqueQuants.sort((a, b) => parseFloat(a) - parseFloat(b));
        
        let options = [];
        if (defaultExists) {
          options.push({
            label: language === 'zh' ? "默认" : "Default",
            value: "default"
          });
        }
        options = options.concat(sortedUniqueQuants.map(quant => ({
          label: quant,
          value: quant
        })));
        
        setQuantOptions(options);
        
        // 设置默认选中项，如果存在默认模型，则选中 "default"，否则选第一个选项
        setSelectedQuant(defaultExists ? "default" : options[0]?.value || '');
        
        console.log('Model Details:', allDetails);
        console.log('Quant Options:', options);
      } catch (err) {
        console.error('加载模型详情失败', err);
      }
    };

    fetchModelDetails();
  }, [config, selectedModels, language]);

  useEffect(() => {
    if (!config || selectedModels.length === 0) return;
    
    // 获取所有选中模型的描述
    const descriptions = selectedModels.map(modelName => {
      const model = config.models.find(m => m.name === modelName);
      if (!model) return '';

      const description = language === 'zh' ? model.description : model.description_en || model.description;
      const modelDetail = modelDetails.find(
        detail => detail.model === model.name && detail.quantization === selectedQuant
      );

      if (modelDetail) {
        return `【${model.name}】\n${description}\n${language === 'zh' ? '量化信息：' : 'Quantization Info: '}${modelDetail.quantization_info}`;
      } else {
        return `${description}`;
      }
    }).filter(Boolean);

    setCalcResult(descriptions.join('\n\n'));
  }, [config, selectedModels, selectedQuant, language, modelDetails]);

  // 更新表格数据
  useEffect(() => {
    if (!modelDetails.length || !selectedQuant) return;
    
    const newTableData = modelDetails
      .filter(detail => {
        if (!selectedModels.includes(detail.configName!)) return false;
        
        if (selectedQuant === "default") {
          return detail.is_default;
        } else {
          return detail.quantization === selectedQuant;
        }
      })
      .map(detail => {
        // 使用修正后的显存计算函数
        const totalRequiredVram = calculateMemoryRequirement(
          detail.file_size,
          detail.quantization
        );
        
        let runStatus: RunStatus;
        let statusText: string;
        
        if (totalRequiredVram <= gpuMemory) {
          runStatus = 'can-run';
          statusText = language === 'zh' ? '完美运行' : 'Perfect Run';
        } else if (totalRequiredVram <= gpuMemory * 1.2) {
          runStatus = 'barely-run';
          statusText = language === 'zh' ? '满载运行' : 'Full Load';
        } else {
          runStatus = 'cannot-run';
          statusText = language === 'zh' ? '不能运行' : 'Cannot Run';
        }

        return {
          key: `${detail.configName}-${detail.model}-${detail.quantization}`,
          fullModel: `${detail.configName}:${detail.model}`,
          arch: detail.arch,
          parameters: detail.parameters,
          file_size: detail.file_size,
          quantization: detail.quantization,
          quantization_info: detail.quantization_info,
          url: detail.url,
          runStatus,
          statusText,
          requiredVram: totalRequiredVram
        };
      });

    // 获取所有量化值并去重
    const uniqueQuants = Array.from(new Set(modelDetails.map(detail => detail.quantization)));
    
    const sortedUniqueQuants = uniqueQuants.sort((a, b) => {
      const getNumber = (str: string) => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getNumber(a) - getNumber(b);
    });
    
    let options = [];
    const defaultExists = modelDetails.some(detail => detail.is_default);
    
    if (defaultExists) {
      options.push({
        label: language === 'zh' ? "默认" : "Default",
        value: "default"
      });
    }
    
    options = options.concat(sortedUniqueQuants.map(quant => ({
      label: quant,
      value: quant
    })));
    
    setQuantOptions(options);
    setTableData(newTableData);
  }, [modelDetails, selectedQuant, selectedModels, language, gpuMemory]);

  // 添加标题更新效果
  useEffect(() => {
    document.title = language === 'zh' ? 'LLM 模型显存计算器' : 'LLM Model VRAM Calculator';
  }, [language]);

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const filterOption = (input: string, option?: { label: string; value: string }) => {
    if (!option) return false;
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  const { defaultAlgorithm, darkAlgorithm } = theme;

  const handleSelectAll = () => {
    if (config) {
      setSelectedModels(config.models.map(model => model.name));
    }
  };

  const handleClearAll = () => {
    setSelectedModels([]);
    setSelectedQuant('');
    setQuantOptions([]);
    setCalcResult('');
  };

  const handleSetMemory24 = () => {
    setGpuMemory(24);
  };

  const handleSetMemory48 = () => {
    setGpuMemory(48);
  };

  // 更新自定义选项渲染函数，修复类型错误
  const customOptionRender = (
    oriOption: DefaultOptionType,
    info: { index: number }
  ): React.ReactNode => {
    // 将 DefaultOptionType 转换为 DropdownOption，并确保 label 存在
    const option = oriOption as DropdownOption;
    return (
      <div style={{ 
        padding: '0.25rem 0.75rem',
        color: isDarkMode ? '#ffffff' : '#000000',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        height: '2rem'
      }}>
        {option.icon}
        {option.label || option.value}
      </div>
    );
  };

  // 更新下拉菜单选项
  const dropdownOptions = useMemo((): DropdownOption[] => {
    if (!config) return [];

    return [
      {
        label: language === 'zh' ? "全选" : "Select All",
        value: '__select_all__',
        icon: <CheckOutlined />
      },
      {
        label: language === 'zh' ? "清除" : "Clear",
        value: '__clear_all__',
        icon: <ClearOutlined />
      },
      ...config.models.map(model => ({
        label: model.name,
        value: model.name
      }))
    ];
  }, [config, language]);

  // 更新选择处理函数
  const handleModelSelect = (values: string[]) => {
    if (values.includes('__select_all__')) {
      handleSelectAll();
    } else if (values.includes('__clear_all__')) {
      handleClearAll();
    } else {
      setSelectedModels(values);
      if (values.length === 0) {
        // 当没有选择模型时，清除所有相关状态
        setSelectedQuant('');
        setQuantOptions([]);
        setModelDetails([]);
        setTableData([]);
        setCalcResult('');
      }
    }
  };

  return (
    <ThemeProvider theme={{ isDark: isDarkMode }}>
      {contextHolder}
      <GlobalStyle theme={{ isDark: isDarkMode }} />
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: '#a9d134',
            fontSize: 16,
          },
        }}
      >
        <StyledApp $isDark={isDarkMode}>
          <TopBar>
            <h1 className="title">
              {language === 'zh' ? "LLM 模型显存计算器" : "LLM Model VRAM Calculator"}
            </h1>
            <div className="controls">
              <Switch
                checked={isDarkMode}
                onChange={handleThemeChange}
                checkedChildren={<MoonOutlined style={{ fontSize: '1rem' }} />}
                unCheckedChildren={<SunOutlined style={{ fontSize: '1rem' }} />}
              />
              <Tooltip title={language === 'zh' ? 'Switch to English' : '切换到中文'}>
                <div 
                  className="icon-button"
                  onClick={toggleLanguage}
                  style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                >
                  <TranslationOutlined style={{ fontSize: '1.125rem' }} />
                </div>
              </Tooltip>
            </div>
          </TopBar>

          <ContentCard>
            <Form layout="vertical" size="large">
              <FormRow>
                <Form.Item 
                  label={language === 'zh' ? "选择模型" : "Select Models"}
                  style={{ marginBottom: '1.25rem' }}
                >
                  <StyledSelect
                    mode="multiple"
                    value={selectedModels}
                    onChange={handleModelSelect}
                    showSearch
                    filterOption={filterOption}
                    optionFilterProp="children"
                    placeholder={language === 'zh' ? "输入关键字搜索模型" : "Search models"}
                    options={dropdownOptions}
                    optionRender={customOptionRender}
                    style={{ width: '100%' }}
                    menuItemSelectedIcon={null}
                  />
                </Form.Item>
                <Form.Item 
                  label={language === 'zh' ? "GPU 显存 (GB)" : "GPU Memory (GB)"}
                  style={{ marginBottom: '1.25rem' }}
                >
                  <StyledInputNumber
                    min={1}
                    value={gpuMemory}
                    onChange={(value:any) => setGpuMemory(value as number)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item 
                  label={language === 'zh' ? "量化方式" : "Quantization"}
                  style={{ marginBottom: '1.25rem' }}
                >
                  <StyledSelect
                    value={selectedQuant}
                    onChange={setSelectedQuant}
                    placeholder={language === 'zh' ? "选择量化方式" : "Select quantization"}
                    options={quantOptions}
                    style={{ width: '100%' }}
                    disabled={!selectedModels.length || quantOptions.length === 0}
                  />
                </Form.Item>
              </FormRow>
            </Form>
            
            {tableData.length > 0 && selectedModels.length > 0 && selectedQuant && (
              <div style={{ marginTop: '1.5rem' }}>
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  bordered
                  scroll={{ x: 'max-content' }}
                  style={{
                    backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
                    borderRadius: '0.5rem',
                  }}
                />
              </div>
            )}

            {calcResult && (
              <div style={{ 
                marginTop: '1.5rem',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: isDarkMode ? '#ffffff' : '#000000',
                backgroundColor: isDarkMode ? '#1f1f1f' : '#f5f5f5',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: `1px solid ${isDarkMode ? '#303030' : '#e8e8e8'}`
              }}>
                {calcResult.split('\n\n').map((paragraph, index) => (
                  <p key={index} style={{ 
                    marginBottom: index < calcResult.split('\n\n').length - 1 ? '1rem' : 0,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </ContentCard>

          <QRCodeContainer>
            <div className="qr-title">
              {language === 'zh' ? '扫描二维码访问' : 'Scan QR Code to Visit'}
            </div>
            <div className="qr-code">
              <QRCode
                value="http://192.168.50.240:3000"
                size={128}
                errorLevel="H"
                bordered={false}
                style={{ 
                  backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}
              />
            </div>
          </QRCodeContainer>
        </StyledApp>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
