import React, { useEffect, useState, useMemo } from "react";
import {
  Form,
  InputNumber,
  Select,
  Card,
  message,
  Tooltip,
  Switch,
  theme,
  Button,
  QRCode,
  Table,
  Typography,
  Space,
} from "antd";
import {
  SunOutlined,
  MoonOutlined,
  TranslationOutlined,
  CheckOutlined,
  ClearOutlined,
  CopyOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { DefaultOptionType } from "antd/es/select";
import type { ColumnsType } from "antd/es/table";
import { ThemeProvider } from "styled-components";
import { Helmet } from "react-helmet";

// 从正确的文件导入类型
import type { 
  Config, 
  TableModelInfo, 
  ModelDetail, 
  ModelConfig,
  RunStatus 
} from "../types/modelTypes";
import type { ThemeInterface } from "../types/themeTypes";

// 导入常量和工具
import { 
  statusColors, 
  statusOrder, 
  QUANTIZATION_BITS, 
  GPU_MEMORY_KEY 
} from "../constants/statusConfig";
import { calculateMemoryRequirement } from "../utils/memoryCalculator";
import { copyToClipboard } from "../utils/clipboard";
import { ModelSelection } from "../model/ModelSelection";

// 导入样式组件
import * as S from "../styles/StyledComponents";

const { Title, Paragraph } = Typography;

// 定义下拉选项类型
interface DropdownOption extends DefaultOptionType {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const LLMCalculatorPage: React.FC = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [gpuMemory, setGpuMemory] = useState<number | null>(() => {
    const savedMemory = localStorage.getItem(GPU_MEMORY_KEY);
    return savedMemory ? Number(savedMemory) : 24;
  });
  const [calcResult, setCalcResult] = useState<string>("");
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [modelDetails, setModelDetails] = useState<ModelDetail[]>([]);
  const [selectedQuant, setSelectedQuant] = useState<string>("default");
  const [quantOptions, setQuantOptions] = useState<DefaultOptionType[]>([]);
  const [tableData, setTableData] = useState<TableModelInfo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 表格列定义
  const columns: ColumnsType<TableModelInfo> = [
    {
      title: language === "zh" ? "模型名称" : "Model Name",
      dataIndex: "fullModel",
      key: "fullModel",
      width: 200,
      fixed: "left",
      sorter: (a, b) => a.fullModel.localeCompare(b.fullModel),
      render: (text, record) => (
        <Tooltip
          title={
            language === "zh"
              ? "点击跳转到模型页面"
              : "Click to view model page"
          }
        >
          <span
            style={{
              cursor: "pointer",
              color: isDarkMode ? "#a9d134" : "#7c9a2e",
              textDecoration: "underline",
            }}
            onClick={() => window.location.href = record.url}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    // ... 其他列定义
  ];

  // 处理全选功能
  const handleSelectAll = () => {
    if (config) {
      setSelectedModels(config.models.map(model => model.name));
    }
  };

  // 下拉选项
  const dropdownOptions = useMemo((): DropdownOption[] => {
    if (!config) return [];
    
    return config.models.map(model => ({
      label: model.name,
      value: model.name,
    }));
  }, [config]);

  // ... 其他组件逻辑

  return (
    <ThemeProvider theme={{ isDark: isDarkMode }}>
      {contextHolder}
      <S.GlobalStyle theme={{ isDark: isDarkMode }} />
      <S.StyledApp $isDark={isDarkMode}>
        <Helmet>
          <title>大语言模型显存计算器 | AI 工具 | LLM 相关工具</title>
          <meta
            name="description"
            content="本工具为开发者提供大语言模型（LLM）显存计算器，帮助 AI 开发者和研究者评估运行大语言模型所需的 GPU 显存。"
          />
        </Helmet>

        {/* 顶部栏 */}
        <S.TopBar>
          <Title level={1} className="title">
            {language === "zh" ? "大语言模型显存计算器" : "LLM VRAM Calculator"}
          </Title>
          <div className="controls">
            <Switch
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
              checked={!isDarkMode}
              onChange={(checked) => setIsDarkMode(!checked)}
            />
            <Switch
              checkedChildren="中"
              unCheckedChildren="En"
              checked={language === "zh"}
              onChange={(checked) => setLanguage(checked ? "zh" : "en")}
            />
          </div>
        </S.TopBar>

        {/* 主要内容 */}
        <S.ContentCard>
          <Form layout="vertical">
            {/* GPU 显存设置 */}
            <Form.Item
              label={language === "zh" ? "GPU 显存大小" : "GPU VRAM Size"}
              required
            >
              <Space>
                <S.StyledInputNumber
                  value={gpuMemory}
                  onChange={(value) => setGpuMemory(value)}
                  min={1}
                  max={256}
                  precision={0}
                  addonAfter="GB"
                />
              </Space>
            </Form.Item>

            {/* 模型选择 */}
            <Form.Item
              label={language === "zh" ? "选择模型" : "Select Models"}
              required
            >
              <S.SelectActions>
                <Button
                  type="default"
                  icon={<CheckOutlined />}
                  onClick={handleSelectAll}
                >
                  {language === "zh" ? "全选" : "Select All"}
                </Button>
                <Button
                  type="default"
                  icon={<ClearOutlined />}
                  onClick={() => setSelectedModels([])}
                >
                  {language === "zh" ? "清空" : "Clear"}
                </Button>
              </S.SelectActions>
              <S.StyledSelect
                mode="multiple"
                placeholder={
                  language === "zh"
                    ? "请选择要计算的模型"
                    : "Please select models"
                }
                value={selectedModels}
                onChange={setSelectedModels}
                options={dropdownOptions}
                maxTagCount="responsive"
              />
            </Form.Item>
          </Form>

          {/* 模型列表 */}
          {tableData.length > 0 && (
            <Table
              columns={columns}
              dataSource={tableData}
              scroll={{ x: 1200 }}
              pagination={false}
              size="middle"
            />
          )}

          {/* 二维码 */}
          <S.QRCodeContainer>
            <div className="qr-title">
              {language === "zh" ? "扫码分享" : "Scan to share"}
            </div>
            <div className="qr-code">
              <QRCode value={window.location.href} />
            </div>
          </S.QRCodeContainer>
        </S.ContentCard>
      </S.StyledApp>
    </ThemeProvider>
  );
};

export default LLMCalculatorPage;
