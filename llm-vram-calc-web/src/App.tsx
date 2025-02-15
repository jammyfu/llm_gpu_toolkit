import React, { useEffect, useState, useMemo } from 'react';
import { Form, InputNumber, Select, Card, message, Tooltip, Switch, theme, Button, Space, QRCode } from 'antd';
import { SunOutlined, MoonOutlined, TranslationOutlined, CheckOutlined, ClearOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

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
  key: string;
  version: string;
  description: string;
  description_en?: string;
  base_url: string;
  tags_url: string;
  output_file: string;
}

interface Config {
  output_dirs: {
    dirs: string;
  };
  models: ModelData[];
}

interface ModelDetail {
  name: string;
  parameters: number;
  file_size: string;
  quantization: string;
  is_default: boolean;
  quantization_info: string;
}

interface ModelConfig {
  name: string;
  output_file: string;
  description: string;
  description_en?: string;
}

// 更新下拉选项类型定义
interface DropdownOption {
  label?: React.ReactNode;
  value?: string;
  type?: 'divider';
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
    
    // 获取所有选中模型的详细信息
    const fetchModelDetails = async () => {
      try {
        const allDetails: ModelDetail[] = [];
        
        for (const modelName of selectedModels) {
          const model = config.models.find(m => m.name === modelName);
          if (!model) continue;

          const modelDataPath = `${process.env.PUBLIC_URL}/${config.output_dirs.dirs}/${model.output_file}`;
          const response = await fetch(modelDataPath);
          const data: ModelDetail[] = await response.json();
          allDetails.push(...data);
        }

        setModelDetails(allDetails);
        
        // 提取所有模型的量化选项并去重
        const uniqueQuants = Array.from(new Set(allDetails.map(detail => detail.quantization)));
        const options = uniqueQuants.map(quant => ({
          label: quant,
          value: quant
        }));
        
        setQuantOptions(options);
        
        // 设置默认选项
        const defaultQuant = allDetails.find(detail => detail.is_default)?.quantization;
        setSelectedQuant(defaultQuant || options[0]?.value || '');
      } catch (err) {
        console.error('加载模型详情失败', err);
      }
    };

    fetchModelDetails();
  }, [config, selectedModels]);

  useEffect(() => {
    if (!config || selectedModels.length === 0) return;
    
    // 获取所有选中模型的描述
    const descriptions = selectedModels.map(modelName => {
      const model = config.models.find(m => m.name === modelName);
      if (!model) return '';

      const description = language === 'zh' ? model.description : model.description_en || model.description;
      const modelDetail = modelDetails.find(
        detail => detail.name === model.name && detail.quantization === selectedQuant
      );

      if (modelDetail) {
        return `【${model.name}】\n${description}\n${language === 'zh' ? '量化信息：' : 'Quantization Info: '}${modelDetail.quantization_info}`;
      } else {
        return `【${model.name}】\n${description}`;
      }
    }).filter(Boolean);

    setCalcResult(descriptions.join('\n\n'));
  }, [config, selectedModels, selectedQuant, language, modelDetails]);

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

  // 更新下拉菜单选项
  const dropdownOptions = useMemo((): DropdownOption[] => {
    if (!config) return [];

    return [
      {
        label: (
          <div style={{ 
            padding: '0.25rem 0.75rem',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            height: '2rem'
          }}>
            <CheckOutlined /> {language === 'zh' ? "全选" : "Select All"}
          </div>
        ),
        value: '__select_all__'
      },
      {
        label: (
          <div style={{ 
            padding: '0.25rem 0.75rem',
            color: isDarkMode ? '#ffffff' : '#000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            height: '2rem'
          }}>
            <ClearOutlined /> {language === 'zh' ? "清除" : "Clear"}
          </div>
        ),
        value: '__clear_all__'
      },
      ...config.models.map(model => ({
        label: (
          <div style={{ 
            padding: '0.25rem 0.75rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            {model.name}
          </div>
        ),
        value: model.name,
      }))
    ];
  }, [config, language, isDarkMode]);

  return (
    <ThemeProvider theme={{ isDark: isDarkMode }}>
      <GlobalStyle theme={{ isDark: isDarkMode }} />
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
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
                    onChange={(values) => {
                      if (values.includes('__select_all__')) {
                        handleSelectAll();
                      } else if (values.includes('__clear_all__')) {
                        handleClearAll();
                      } else {
                        setSelectedModels(values);
                        if (values.length === 0) {
                          setSelectedQuant('');
                          setQuantOptions([]);
                          setCalcResult('');
                        }
                      }
                    }}
                    showSearch
                    filterOption={filterOption}
                    optionFilterProp="children"
                    placeholder={language === 'zh' ? "输入关键字搜索模型" : "Search models"}
                    options={dropdownOptions as any} // 临时类型断言
                    style={{ width: '100%' }}
                    menuItemSelectedIcon={null}
                    dropdownRender={(menu) => (
                      <div
                        style={{
                          backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
                          borderRadius: '0.25rem'
                        }}
                      >
                        {menu}
                      </div>
                    )}
                  />
                </Form.Item>
                <Form.Item 
                  label={language === 'zh' ? "GPU 显存 (GB)" : "GPU Memory (GB)"}
                  style={{ marginBottom: '1.25rem' }}
                >
                  <StyledInputNumber
                    min={1}
                    value={gpuMemory}
                    onChange={(value) => setGpuMemory(value as number)}
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
            {calcResult && (
              <div style={{ 
                marginTop: '1.25rem',
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
