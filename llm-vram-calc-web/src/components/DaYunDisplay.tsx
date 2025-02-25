import React, { useState, useEffect, useMemo } from 'react';
import { Card, Tabs, Typography, Table, Descriptions, Button, Radio, Space, DatePicker } from 'antd';
import { DaYunInfo, LiuNianInfo, LiuYueInfo, XiaoYunInfo } from '../types/BaziTypes';
// 移除有问题的导入
// import type { LiuNianInfo, LiuYueInfo, XiaoYunInfo } from '../types/bazi';
import styled from 'styled-components';
import { Solar } from 'lunar-typescript';
import BaziLogger from '../utils/BaziLogger';
import dayjs from 'dayjs';

// 为所有表格、卡片和描述组件添加主题支持
const StyledTable = styled(Table)`
  margin-top: 12px;
  
  .ant-table {
    background-color: ${props => props.theme.isDark ? '#303030' : '#ffffff'};
    color: ${props => props.theme.isDark ? '#e0e0e0' : '#000000'};
  }

  .ant-table-thead > tr > th {
    background-color: ${props => props.theme.isDark ? '#424242' : '#f0f0f0'};
    color: ${props => props.theme.isDark ? '#e0e0e0' : '#262626'};
    border-bottom: 1px solid ${props => props.theme.isDark ? '#555' : '#e8e8e8'};
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${props => props.theme.isDark ? '#424242' : '#f0f0f0'};
    background-color: ${props => props.theme.isDark ? '#303030' : '#ffffff'};
    color: ${props => props.theme.isDark ? '#e0e0e0' : '#000000'};
  }

  .ant-table-tbody > tr:hover > td {
    background-color: ${props => props.theme.isDark ? '#3a3a3a' : '#f5f5f5'} !important;
  }

  // 为分页器添加样式
  .ant-pagination-item {
    background-color: ${props => props.theme.isDark ? '#303030' : '#ffffff'};
    border-color: ${props => props.theme.isDark ? '#555' : '#d9d9d9'};
    
    a {
      color: ${props => props.theme.isDark ? '#e0e0e0' : '#000000'};
    }
  }

  .ant-pagination-item-active {
    border-color: ${props => props.theme.isDark ? '#1890ff' : '#1890ff'};
    
    a {
      color: ${props => props.theme.isDark ? '#1890ff' : '#1890ff'};
    }
  }
`;

// 为大运标题和内容区域添加主题支持
const ContentHeader = styled.div<{ theme: { isDark: boolean } }>`
  padding: 10px 0;
  margin-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.isDark ? '#555' : '#f0f0f0'};
  
  h2 {
    color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    margin: 0;
  }
`;

// 修改流年信息卡片的样式
const LiuNianCard = styled(Card)<{ theme: { isDark: boolean } }>`
  margin-top: 20px;
  background-color: ${props => props.theme.isDark ? '#303030' : '#ffffff'};
  color: ${props => props.theme.isDark ? '#e0e0e0' : '#000000'};
  border: 1px solid ${props => props.theme.isDark ? '#444' : '#e8e8e8'};
  
  .ant-card-head {
    background-color: ${props => props.theme.isDark ? '#424242' : '#f0f0f0'};
    border-bottom: 1px solid ${props => props.theme.isDark ? '#555' : '#e8e8e8'};
    
    .ant-card-head-title {
      color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    }
  }
  
  .ant-card-body {
    background-color: ${props => props.theme.isDark ? '#303030' : '#ffffff'};
  }
`;

// 修改视图切换按钮组的样式，使用与应用一致的主题色
const ViewTypeRadioGroup = styled(Radio.Group)<{ theme: { isDark: boolean } }>`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  
  .ant-radio-button-wrapper {
    flex: 1;
    text-align: center;
    background-color: ${props => props.theme.isDark ? '#303030' : '#ffffff'};
    color: ${props => props.theme.isDark ? '#e0e0e0' : '#000000'};
    border-color: ${props => props.theme.isDark ? '#555' : '#d9d9d9'};
    
    &:hover {
      color: ${props => props.theme.isDark ? '#a9d134' : '#8fb82e'};
    }
    
    &.ant-radio-button-wrapper-checked {
      background-color: ${props => props.theme.isDark ? '#1f1f1f' : '#e6f7ff'};
      border-color: ${props => props.theme.isDark ? '#a9d134' : '#8fb82e'};
      color: ${props => props.theme.isDark ? '#a9d134' : '#8fb82e'};
      
      &::before {
        background-color: ${props => props.theme.isDark ? '#a9d134' : '#8fb82e'};
      }
    }
    
    // 添加响应式样式
    @media (max-width: 576px) {
      padding: 0 8px;
      font-size: 12px;
    }
  }
`;

// 样式化卡片组件
const StyledCard = styled(Card)`
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.isDark ? '#424242' : '#fff'};
  color: ${(props) => props.theme.isDark ? '#fff' : '#000'};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'};
  
  .ant-card-head {
    border-bottom: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'};
  }
  
  .ant-card-head-title {
    color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
  }
`;

// 样式化标签页组件
const StyledTabs = styled(Tabs)<{ theme: { isDark: boolean } }>`
  .ant-tabs-nav {
    margin-bottom: 16px;
    
    .ant-tabs-tab {
      color: ${(props) => props.theme.isDark ? '#cccccc' : '#666666'};
      
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: ${(props) => props.theme.isDark ? '#a9d134' : '#8fb82e'};
      }
    }
  }
`;

// 样式化描述组件
const StyledDescriptions = styled(Descriptions)<{ theme: { isDark: boolean } }>`
  margin-bottom: 24px;
  
  .ant-descriptions-header {
    margin-bottom: 16px;
  }
  
  .ant-descriptions-item-label {
    background-color: ${(props) => props.theme.isDark ? '#333333' : '#fafafa'};
    color: ${(props) => props.theme.isDark ? '#cccccc' : '#666666'};
  }
  
  .ant-descriptions-item-content {
    background-color: ${(props) => props.theme.isDark ? '#3a3a3a' : '#ffffff'};
    color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
  }
`;

// 修改组件接口
interface DaYunDisplayProps {
  daYun?: DaYunInfo[];
  theme: { isDark: boolean };
  dayGan: string;
  // 修改类型，允许字符串或数字类型的年份
  birthYear?: number | string;
  // 修改类型，适配实际的数据结构
  birthLunar?: {
    year: number | string;
    month: number | string;
    day: number | string;
    time?: string;
    ganZhi?: string; // 设为可选
  };
  gender?: string;
  sect?: number;
}

// 使用本地类型定义替代导入

// 简化的大运显示组件
const DaYunDisplay: React.FC<DaYunDisplayProps> = ({ 
  daYun = [], 
  theme: customTheme, 
  dayGan,
  birthYear,
  birthLunar,
  gender,
  sect
}) => {
  // 状态
  const [activeTabKey, setActiveTabKey] = useState<string>("0");
  const [loggerDaYun, setLoggerDaYun] = useState<DaYunInfo[]>([]);
  const [viewType, setViewType] = useState<string>("basic"); // 新增：视图类型 - basic, liuNian, xiaoYun, liuYue, liuRi
  const [selectedYear, setSelectedYear] = useState<number | null>(null); // 新增：选中的年份
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // 新增：选中的月份
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null); // 新增：选中的日期
  
  // 新增：流年、小运、流月、流日数据
  const [liuNianData, setLiuNianData] = useState<LiuNianInfo[]>([]);
  const [xiaoYunData, setXiaoYunData] = useState<XiaoYunInfo[]>([]);
  const [liuYueData, setLiuYueData] = useState<LiuYueInfo[]>([]);
  const [liuRiData, setLiuRiData] = useState<any[]>([]);
  
  // 组件初始化时输出传入的 props
  useEffect(() => {
    console.log("DaYunDisplay - 初始化props:", { 
      daYun, 
      dayGan,
      birthYear,
      birthLunar,
      gender,
      sect,
      isDarkTheme: customTheme.isDark 
    });
  }, [daYun, dayGan, birthYear, birthLunar, gender, sect, customTheme.isDark]);
  
  // 转换年份为数字
  const parsedBirthYear = useMemo(() => {
    if (typeof birthYear === 'string') {
      return parseInt(birthYear, 10);
    }
    return birthYear;
  }, [birthYear]);
  
  // 从 BaziLogger 获取数据 - 添加所有依赖项
  useEffect(() => {
    try {
      console.log("DaYunDisplay - 正在从 BaziLogger 获取数据...");
      console.log("DaYunDisplay - 输入参数:", { 
        birthYear: parsedBirthYear, 
        birthLunar, 
        dayGan, 
        gender, 
        sect 
      });
      
      const baziData = BaziLogger.getBaziData();
      console.log("DaYunDisplay - BaziLogger 完整数据:", baziData);
      
      if (baziData && baziData.daYun) {
        setLoggerDaYun(baziData.daYun);
        console.log("DaYunDisplay - 成功获取到的大运数据:", baziData.daYun);
      } else {
        console.warn("DaYunDisplay - BaziLogger 中没有大运数据");
        setLoggerDaYun([]);
      }
    } catch (error) {
      console.error("DaYunDisplay - 获取大运数据时出错:", error);
      setLoggerDaYun([]);
    }
  }, [parsedBirthYear, birthLunar, dayGan, gender, sect]); 
  
  // 合并数据源
  const mergedDaYun = useMemo(() => {
    const useLoggerData = loggerDaYun.length > 0;
    const result = useLoggerData ? loggerDaYun : daYun;
    
    console.log("DaYunDisplay - 数据来源:", useLoggerData ? "BaziLogger" : "Props");
    console.log("DaYunDisplay - 合并后的大运数据:", result);
    
    return result;
  }, [loggerDaYun, daYun]);
  
  // 处理标签页变化
  const handleTabChange = (key: string) => {
    console.log("DaYunDisplay - 切换到大运标签:", key);
    setActiveTabKey(key);
    setViewType("basic"); // 重置视图类型
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDate(null);
  };
  
  // 处理视图类型变化
  const handleViewTypeChange = (e: any) => {
    const newViewType = e.target.value;
    setViewType(newViewType);
    
    // 重置选中的年月日
    if (newViewType !== "liuYue") setSelectedMonth(null);
    if (newViewType !== "liuRi") setSelectedDate(null);
    
    // 如果切换到流年视图，自动加载流年数据
    if (newViewType === "liuNian" && selectedYear) {
      loadLiuNianData(selectedYear);
    }
    // 如果切换到小运视图，自动加载小运数据
    else if (newViewType === "xiaoYun" && selectedYear) {
      loadXiaoYunData(selectedYear);
    }
  };
  
  // 处理年份选择
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    
    if (viewType === "liuNian") {
      loadLiuNianData(year);
    } else if (viewType === "xiaoYun") {
      loadXiaoYunData(year);
    }
  };
  
  // 处理月份选择
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    
    if (viewType === "liuYue" && selectedYear) {
      loadLiuYueData(selectedYear, month);
    }
  };
  
  // 处理日期选择
  const handleDateSelect = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    
    if (viewType === "liuRi" && date) {
      loadLiuRiData(date.toDate());
    }
  };
  
  // 加载流年数据
  const loadLiuNianData = (year: number) => {
    try {
      const data = BaziLogger.getLiuNian(year, dayGan);
      setLiuNianData(data);
      console.log(`DaYunDisplay - 加载 ${year} 年流年数据:`, data);
    } catch (error) {
      console.error(`DaYunDisplay - 加载 ${year} 年流年数据出错:`, error);
      setLiuNianData([]);
    }
  };
  
  // 加载小运数据
  const loadXiaoYunData = (year: number) => {
    try {
      const data = BaziLogger.getXiaoYun(year, dayGan);
      setXiaoYunData(data);
      console.log(`DaYunDisplay - 加载 ${year} 年小运数据:`, data);
    } catch (error) {
      console.error(`DaYunDisplay - 加载 ${year} 年小运数据出错:`, error);
      setXiaoYunData([]);
    }
  };
  
  // 加载流月数据
  const loadLiuYueData = (year: number, month: number) => {
    try {
      const data = BaziLogger.getLiuYue(year, month, dayGan);
      setLiuYueData(data);
      console.log(`DaYunDisplay - 加载 ${year}年${month}月流月数据:`, data);
    } catch (error) {
      console.error(`DaYunDisplay - 加载 ${year}年${month}月流月数据出错:`, error);
      setLiuYueData([]);
    }
  };
  
  // 加载流日数据
  const loadLiuRiData = (date: Date) => {
    try {
      const data = BaziLogger.getLiuRi(date, dayGan);
      setLiuRiData(Array.isArray(data) ? data : [data]);
      console.log(`DaYunDisplay - 加载 ${date.toLocaleDateString()} 流日数据:`, data);
    } catch (error) {
      console.error(`DaYunDisplay - 加载 ${date.toLocaleDateString()} 流日数据出错:`, error);
      setLiuRiData([]);
    }
  };
  
  // 获取农历年
  const getSolarToLunar = (year: number) => {
    try {
      const solar = Solar.fromYmd(year, 1, 1);
      const lunar = solar.getLunar();
      return {
        lunarYear: lunar.getYear(),
        ganZhi: lunar.getYearInGanZhi()
      };
    } catch (error) {
      console.error("DaYunDisplay - 转换农历年出错:", error);
      return { lunarYear: 0, ganZhi: "" };
    }
  };
  
  // 扩展大运数据
  const extendedDaYun = useMemo(() => {
    const result = mergedDaYun.map((dyn) => ({
      ...dyn,
      endYear: dyn.startYear + 9,
      lunarYearStart: dyn.startYear ? getSolarToLunar(dyn.startYear).lunarYear : 0,
      lunarYearEnd: (dyn.startYear + 9) ? getSolarToLunar(dyn.startYear + 9).lunarYear : 0
    }));
    
    console.log("DaYunDisplay - 扩展后的大运数据:", result);
    return result;
  }, [mergedDaYun]);
  
  // 生成年份按钮
  const renderYearButtons = (startYear: number, endYear: number) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    
    return (
      <Space wrap>
        {years.map(year => (
          <Button 
            key={year}
            type={selectedYear === year ? "primary" : "default"}
            onClick={() => handleYearSelect(year)}
          >
            {year}年 ({getSolarToLunar(year).ganZhi})
          </Button>
        ))}
      </Space>
    );
  };
  
  // 生成月份按钮
  const renderMonthButtons = () => {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      months.push(month);
    }
    
    return (
      <Space wrap>
        {months.map(month => (
          <Button 
            key={month}
            type={selectedMonth === month ? "primary" : "default"}
            onClick={() => handleMonthSelect(month)}
          >
            {month}月
          </Button>
        ))}
      </Space>
    );
  };
  
  // 生成流年数据表格
  const renderLiuNianTable = () => {
    type TableType = LiuNianInfo & { key: number };
    
    const columns = [
      { title: '年份', dataIndex: 'year', key: 'year' },
      { title: '干支', dataIndex: 'ganZhi', key: 'ganZhi' },
      { 
        title: '十神', 
        dataIndex: 'shiShen', 
        key: 'shiShen',
        render: (shiShen: string) => shiShen || '--'
      },
      { title: '纳音', dataIndex: 'naYin', key: 'naYin' },
      { title: '旬空', dataIndex: 'xunKong', key: 'xunKong' }
    ];
    
    const dataSource = liuNianData.map((item, index) => ({ ...item, key: index })) as TableType[];
    
    return (
      <StyledTable 
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        theme={customTheme}
      />
    );
  };
  
  // 生成小运数据表格
  const renderXiaoYunTable = () => {
    type TableType = XiaoYunInfo & { key: number };
    
    const columns = [
      { title: '序号', dataIndex: 'index', key: 'index' },
      { title: '干支', dataIndex: 'ganZhi', key: 'ganZhi' },
      { title: '年龄', dataIndex: 'age', key: 'age' },
      { title: '公历年', dataIndex: 'year', key: 'year' },
      { title: '农历年', dataIndex: 'lunarYear', key: 'lunarYear' }
    ];
    
    const dataSource = xiaoYunData.map((item, index) => ({ ...item, key: index })) as TableType[];
    
    return (
      <StyledTable 
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        theme={customTheme}
      />
    );
  };
  
  // 生成流月数据表格
  const renderLiuYueTable = () => {
    type TableType = LiuYueInfo & { key: number };
    
    // 使用 as any 来绕过类型检查
    const columns: any = [
      { 
        title: '年月', 
        dataIndex: 'yearMonth', 
        key: 'yearMonth', 
        // 修改 render 函数的类型
        render: (value: any, record: any) => `${record.year}年${record.month}月` 
      },
      { title: '干支', dataIndex: 'ganZhi', key: 'ganZhi' },
      { title: '十神', dataIndex: 'shiShen', key: 'shiShen' },
      { title: '纳音', dataIndex: 'naYin', key: 'naYin' },
      { title: '旬空', dataIndex: 'xunKong', key: 'xunKong' }
    ];
    
    const dataSource = liuYueData.map((item, index) => ({ ...item, key: index })) as TableType[];
    
    return (
      <StyledTable 
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        theme={customTheme}
      />
    );
  };
  
  // 生成流日数据表格
  const renderLiuRiTable = () => {
    const columns: any = [
      { 
        title: '日期', 
        dataIndex: 'date', 
        key: 'date', 
        render: (date: any) => date.toLocaleDateString() 
      },
      { title: '干支', dataIndex: 'ganZhi', key: 'ganZhi' },
      { title: '十神', dataIndex: 'shiShen', key: 'shiShen' },
      { title: '纳音', dataIndex: 'naYin', key: 'naYin' },
      { title: '旬空', dataIndex: 'xunKong', key: 'xunKong' }
    ];
    
    return (
      <StyledTable 
        columns={columns}
        dataSource={liuRiData.map((item, index) => ({ ...item, key: index }))} 
        pagination={false}
        theme={customTheme}
      />
    );
  };
  
  // 修改渲染流程，将导航菜单放在顶部
  const renderTabContent = (key: string) => {
    const index = parseInt(key, 10);
    const daYunItem = extendedDaYun[index];
    
    console.log(`DaYunDisplay - 正在渲染大运标签 ${key} 的内容:`, daYunItem);
    
    if (!daYunItem) {
      console.warn(`DaYunDisplay - 找不到索引 ${index} 的大运数据`);
      return <Typography.Text>没有大运信息</Typography.Text>;
    }
    
    // 输出当前大运项的完整属性
    console.log("DaYunDisplay - 当前大运项详细属性:", {
      干支: daYunItem.ganZhi,
      起运年龄: daYunItem.startAge,
      起运年份: daYunItem.startYear,
      结束年份: daYunItem.endYear,
      农历起运年: daYunItem.lunarYearStart,
      农历结束年: daYunItem.lunarYearEnd,
      十神: daYunItem.tenGod
    });
    
    return (
      <>
        {/* 将视图选择导航移到顶部 */}
        <div style={{ marginBottom: 20 }}>
          <ViewTypeRadioGroup 
            value={viewType} 
            onChange={handleViewTypeChange}
            theme={customTheme}
          >
            <Radio.Button value="basic">基本信息</Radio.Button>
            <Radio.Button value="liuNian">流年</Radio.Button>
            <Radio.Button value="xiaoYun">小运</Radio.Button>
            <Radio.Button value="liuYue">流月</Radio.Button>
            <Radio.Button value="liuRi">流日</Radio.Button>
          </ViewTypeRadioGroup>
        </div>
        
        {/* 根据选择的视图类型渲染不同内容 */}
        {viewType === "basic" && (
          <StyledDescriptions 
            title="大运基本信息" 
            bordered 
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            theme={customTheme}
          >
            <Descriptions.Item label="干支">{daYunItem.ganZhi}</Descriptions.Item>
            <Descriptions.Item label="起运年龄">{daYunItem.startAge}岁</Descriptions.Item>
            <Descriptions.Item label="起运年份">公历{daYunItem.startYear}年</Descriptions.Item>
            <Descriptions.Item label="结束年份">公历{daYunItem.endYear}年</Descriptions.Item>
            <Descriptions.Item label="农历起运年">农历{daYunItem.lunarYearStart || '--'}年</Descriptions.Item>
            <Descriptions.Item label="农历结束年">农历{daYunItem.lunarYearEnd || '--'}年</Descriptions.Item>
            <Descriptions.Item label="十神">{daYunItem.tenGod || daYunItem.shiShen || '--'}</Descriptions.Item>
            <Descriptions.Item label="纳音">{daYunItem.naYin}</Descriptions.Item>
            <Descriptions.Item label="旬空">{daYunItem.xunKong}</Descriptions.Item>
          </StyledDescriptions>
        )}
        
        {/* 年份选择 - 流年、小运、流月视图 */}
        {(viewType === "liuNian" || viewType === "xiaoYun" || viewType === "liuYue") && (
          <div style={{ marginBottom: 20 }}>
            <Typography.Title level={5}>选择年份</Typography.Title>
            {renderYearButtons(daYunItem.startYear, daYunItem.endYear)}
          </div>
        )}
        
        {/* 月份选择 - 流月视图 */}
        {viewType === "liuYue" && selectedYear && (
          <div style={{ marginBottom: 20 }}>
            <Typography.Title level={5}>选择月份</Typography.Title>
            {renderMonthButtons()}
          </div>
        )}
        
        {/* 日期选择 - 流日视图 */}
        {viewType === "liuRi" && (
          <div style={{ marginBottom: 20 }}>
            <Typography.Title level={5}>选择日期</Typography.Title>
            <DatePicker 
              value={selectedDate}
              onChange={handleDateSelect}
              style={{ width: 200 }}
            />
          </div>
        )}
        
        {/* 流年数据 */}
        {viewType === "liuNian" && selectedYear && (
          <div>
            <Typography.Title level={5}>{selectedYear}年流年信息</Typography.Title>
            {liuNianData.length > 0 ? renderLiuNianTable() : <Typography.Text>无流年数据</Typography.Text>}
          </div>
        )}
        
        {/* 小运数据 */}
        {viewType === "xiaoYun" && selectedYear && (
          <div>
            <Typography.Title level={5}>{selectedYear}年小运信息</Typography.Title>
            {xiaoYunData.length > 0 ? renderXiaoYunTable() : <Typography.Text>无小运数据</Typography.Text>}
          </div>
        )}
        
        {/* 流月数据 */}
        {viewType === "liuYue" && selectedYear && selectedMonth && (
          <div>
            <Typography.Title level={5}>{selectedYear}年{selectedMonth}月流月信息</Typography.Title>
            {liuYueData.length > 0 ? renderLiuYueTable() : <Typography.Text>无流月数据</Typography.Text>}
          </div>
        )}
        
        {/* 流日数据 */}
        {viewType === "liuRi" && selectedDate && (
          <div>
            <Typography.Title level={5}>{selectedDate.format('YYYY年MM月DD日')}流日信息</Typography.Title>
            {liuRiData.length > 0 ? renderLiuRiTable() : <Typography.Text>无流日数据</Typography.Text>}
          </div>
        )}
      </>
    );
  };
  
  // 生成标签页数据
  const generateTabItems = () => {
    console.log("DaYunDisplay - 正在生成标签页项目, 大运数量:", extendedDaYun.length);
    
    return extendedDaYun.map((item, index) => {
      const key = String(index);
      return {
        key,
        label: (
          <div style={{ lineHeight: '1.2', padding: '4px 0' }}>
            <div>{item.ganZhi} 大运</div>
            <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
              {item.startYear}年({item.startAge}岁) - {item.endYear}年({item.startAge + 9}岁)
            </div>
          </div>
        ),
        children: renderTabContent(key)
      };
    });
  };
  
  // 如果没有数据，显示加载信息
  if (extendedDaYun.length === 0) {
    console.warn("DaYunDisplay - 没有大运数据可显示");
    return (
      <StyledCard title="大运信息" theme={customTheme}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          正在加载大运数据...如果长时间未显示，请先计算八字
        </div>
      </StyledCard>
    );
  }

  // 渲染组件
  console.log("DaYunDisplay - 渲染完整组件，标签页数量:", extendedDaYun.length);
  return (
    <StyledCard title="大运信息" theme={customTheme}>
      <StyledTabs
        activeKey={activeTabKey}
        onChange={handleTabChange}
        items={generateTabItems() as any}
        type="card"
        theme={customTheme}
      />
    </StyledCard>
  );
};

export default DaYunDisplay; 