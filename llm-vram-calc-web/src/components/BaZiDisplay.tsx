import React from "react";
import { Card, Table, Tag, theme } from "antd";
import { EightChar } from "lunar-typescript";
import styled from "styled-components";
import { PillarInfo } from '../types/BaziTypes';
import { HiddenGanInfo } from '../types/bazi';

// 定义组件props接口
interface BaZiDisplayProps {
  yearPillar: PillarInfo;
  monthPillar: PillarInfo;
  dayPillar: PillarInfo;
  hourPillar: PillarInfo;
  solarDate?: {
    year: string;
    month: string;
    day: string;
    time: string;
  };
  lunarDate?: {
    year: string;
    month: string;
    day: string;
    time: string;
  };
  baziTitle?: string;
  theme: { isDark: boolean };
}

// 五行底色映射
const wuxingBgColors: { [key: string]: string } = {
  木: "rgba(80, 200, 120, 0.15)", // 浅绿色
  火: "rgba(255, 77, 77, 0.15)", // 浅红色
  土: "rgba(184, 134, 11, 0.15)", // 浅暗金黄
  金: "rgba(255, 215, 0, 0.15)", // 浅亮金黄
  水: "rgba(30, 144, 255, 0.15)", // 浅蓝色
};

// 五行颜色映射
const wuxingColors: { [key: string]: string } = {
  木: "#50C878", // 绿色
  火: "#FF4D4D", // 红色
  土: "#B8860B", // 暗金黄色
  金: "#FFD700", // 亮金黄色
  水: "#1E90FF", // 蓝色
};

// 天干五行对应
const tianGanWuxing: { [key: string]: string } = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

// 地支五行对应
const diZhiWuxing: { [key: string]: string } = {
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  辰: "土",
  戌: "土",
  丑: "土",
  未: "土",
  申: "金",
  酉: "金",
  亥: "水",
  子: "水",
};

// 获取字符的五行颜色
const getCharacterColor = (char: string): string => {
  if (tianGanWuxing[char]) return wuxingColors[tianGanWuxing[char]];
  if (diZhiWuxing[char]) return wuxingColors[diZhiWuxing[char]];
  return "inherit";
};

// 样式化的文字组件
const StyledChar = styled.span<{ $wuxing: string }>`
  color: ${props => wuxingColors[props.$wuxing] || 'inherit'};
  margin: 0 2px;
`;

// 样式化的Tag组件
const StyledTag = styled(Tag)<{
  $wuxing: string;
  $isFirst?: boolean;
  $isLast?: boolean;
}>`
  margin: 0;
  padding: 2px 8px;
  font-size: 1.2em;
  border: 1px solid ${(props) => wuxingColors[props.$wuxing] || "#000000"};
  background-color: ${(props) =>
    wuxingBgColors[props.$wuxing] || "rgba(0, 0, 0, 0.1)"};
  color: ${(props) => wuxingColors[props.$wuxing] || "#000000"};
  font-weight: 600;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  margin-right: 0;
  border-radius: 0;
  position: relative;

  ${(props) =>
    props.$isFirst &&
    `
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  `}

  ${(props) =>
    props.$isLast &&
    `
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  `}
  
  &:not(:last-child) {
    border-right: none;
  }
  &:hover {
    opacity: 0.8;
  }
`;

// 五行角标样式
const WuXingSubscript = styled.sub<{ $wuxing: string }>`
  position: absolute;
  font-size: 0.9em;
  width: 1.5em;
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  color: black;
  font-weight: 500;
  z-index: 1;
`;

// 天干五行角标（左上角）
const TianGanWuXing = styled(WuXingSubscript)`
  top: -10px;
  left: -10px;
`;

// 地支五行角标（右上角）
const DiZhiWuXing = styled(WuXingSubscript)`
  top: -10px;
  right: -10px;
`;

// 样式化的干支字符容器
const GanZhiContainer = styled.div<{ $isCangGan?: boolean }>`
  display: inline-flex;
  align-items: center;
  font-size: ${props => props.$isCangGan ? '1em' : '2em'}; // 根据是否是藏干来设置不同的字体大小
  font-weight: bold;
`;

// 五行对应的表情符号
const wuxingEmoji: { [key: string]: string } = {
  金: "🪙",
  木: "🌳",
  水: "💧",
  火: "🔥",
  土: "🟤",
};

// 修改藏干相关的样式组件
const HiddenGanContainer = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const HiddenGanItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const HiddenGanMain = styled.span<{ $wuxing: string }>`
  font-size: 1.2em;
  font-weight: bold;
  color: ${props => wuxingColors[props.$wuxing] || 'inherit'};
  text-align: center;
`;

const HiddenGanDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.85em;
  line-height: 1.6;
`;

const GanType = styled.div`
  color: inherit;
  opacity: 0.65;
  text-align: center;
`;

const ShiShen = styled.div`
  font-weight: bold;
  color: inherit;
  text-align: center;
`;

// 修改DateText组件
const DateText = styled.div`
  font-size: 0.9em;
`;

// 修改组件实现
const BaZiDisplay: React.FC<BaZiDisplayProps> = ({ 
  yearPillar,
  monthPillar,
  dayPillar,
  hourPillar,
  solarDate,
  lunarDate,
  baziTitle = "八字",
  theme: customTheme
}) => {
  const { token } = theme.useToken();
  
  // 定义每个属性的标题
  const rowTitles = {
    solarDate: "公历日期",
    lunarDate: "农历日期",
    ganZhi: "天干地支",
    wuxing: "五行",
    shiShen: "十神",
    cangGan: "藏干",
    naYin: "纳音",
    xunKong: "旬空（空亡）"
  };

  const columns = [
    { 
      title: "四柱：", 
      dataIndex: "attribute", 
      key: "attribute",
      align: 'right' as const, // 右对齐
      minwidth: '128px',
    },
    { 
      title: "年柱", 
      dataIndex: "year", 
      key: "year",
      width: '21%', 
      align: 'center' as const,
    },
    { 
      title: "月柱", 
      dataIndex: "month", 
      key: "month",
      width: '21%',
      align: 'center' as const,
    },
    { 
      title: "日柱", 
      dataIndex: "day", 
      key: "day",
      width: '21%',
      align: 'center' as const,
    },
    { 
      title: "时柱", 
      dataIndex: "time", 
      key: "time",
      width: '21%',
      align: 'center' as const,
    },
  ];

  // 修改渲染干支的函数
  const renderGanZhi = (gan: string, zhi: string) => (
    <GanZhiContainer>
      <StyledChar $wuxing={tianGanWuxing[gan]}>
        {gan}
      </StyledChar>
      <StyledChar $wuxing={diZhiWuxing[zhi]}>
        {zhi}
      </StyledChar>
    </GanZhiContainer>
  );

  // 渲染带颜色的五行文字
  const renderWuXing = (text: string) => (
    <StyledTag $wuxing={text}>
      {wuxingEmoji[text]}
    </StyledTag>
  );

  // 修改渲染藏干的函数
  const renderHiddenGan = (hidden: HiddenGanInfo[]) => {
    return (
      <HiddenGanContainer>
        {hidden.map((h, index) => (
          <HiddenGanItem key={index}>
            <HiddenGanMain $wuxing={tianGanWuxing[h.gan]}>
              {h.gan}
            </HiddenGanMain>
            <HiddenGanDetails>
              <GanType>{h.type}</GanType>
              <ShiShen>{h.shiShen}</ShiShen>
            </HiddenGanDetails>
          </HiddenGanItem>
        ))}
      </HiddenGanContainer>
    );
  };

  // 修改表格数据渲染
  const data = [
    {
      key: 'solarDate',
      attribute: rowTitles.solarDate,
      year: <DateText>{solarDate?.year || ''}</DateText>,
      month: <DateText>{solarDate?.month || ''}</DateText>,
      day: <DateText>{solarDate?.day || ''}</DateText>,
      time: <DateText>{solarDate?.time || ''}</DateText>
    },
    {
      key: 'lunarDate',
      attribute: rowTitles.lunarDate,
      year: <DateText>{lunarDate?.year || ''}</DateText>,
      month: <DateText>{lunarDate?.month || ''}</DateText>,
      day: <DateText>{lunarDate?.day || ''}</DateText>,
      time: <DateText>{lunarDate?.time || ''}</DateText>
    },
    {
      key: 'ganZhi',
      attribute: rowTitles.ganZhi,
      year: renderGanZhi(yearPillar.gan, yearPillar.zhi),
      month: renderGanZhi(monthPillar.gan, monthPillar.zhi),
      day: renderGanZhi(dayPillar.gan, dayPillar.zhi),
      time: renderGanZhi(hourPillar.gan, hourPillar.zhi)
    },
    {
      key: 'shiShen',  // 添加唯一的 key
      attribute: rowTitles.shiShen,
      year: yearPillar.tenGod,
      month: monthPillar.tenGod,
      day: dayPillar.tenGod,
      time: hourPillar.tenGod
    },
    {
      key: 'cangGan',
      attribute: rowTitles.cangGan,
      year: renderHiddenGan(yearPillar.hidden),
      month: renderHiddenGan(monthPillar.hidden),
      day: renderHiddenGan(dayPillar.hidden),
      time: renderHiddenGan(hourPillar.hidden)
    },
    {
      key: 'naYin',  // 添加唯一的 key
      attribute: rowTitles.naYin,
      year: yearPillar.naYin || '',
      month: monthPillar.naYin || '',
      day: dayPillar.naYin || '',
      time: hourPillar.naYin || ''
    },
    {
      key: 'xunKong',  // 添加唯一的 key
      attribute: rowTitles.xunKong,
      year: yearPillar.xunKong || '',
      month: monthPillar.xunKong || '',
      day: dayPillar.xunKong || '',
      time: hourPillar.xunKong || ''
    }
  ];

  function getCangGan(diZhi: string): string {
    const cangGanMap: { [key: string]: string } = {
      子: "癸",
      丑: "己癸辛",
      寅: "甲丙戊",
      卯: "乙",
      辰: "戊乙癸",
      巳: "丙戊庚",
      午: "丁己",
      未: "己丁乙",
      申: "庚壬戊",
      酉: "辛",
      戌: "戊辛丁",
      亥: "壬甲",
    };
    return cangGanMap[diZhi] || "";
  }

  // 修改表格样式组件
  const StyledTable = styled(Table)<{ theme: { isDark: boolean } }>`
    .ant-table-cell {
      vertical-align: middle;
      padding: 16px 8px;
      text-align: center;
      background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'};
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
    }

    .ant-table-thead > tr > th {
      background-color: ${(props) => props.theme.isDark ? '#303030' : '#f0f0f0'};
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
      border-bottom: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'} !important;
    }

    // 表格边框颜色
    .ant-table-bordered .ant-table-container {
      border: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'} !important;
      border-right: 0 !important;
      border-bottom: 0 !important;
    }

    .ant-table-bordered .ant-table-thead > tr > th,
    .ant-table-bordered .ant-table-tbody > tr > td {
      border-right: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'} !important;
      border-bottom: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'} !important;
    }

    && {
      .ant-table-tbody > tr:hover > td {
        background-color: ${(props) => 
          props.theme.isDark 
            ? 'rgba(3, 31, 54, 0.8)'
            : 'rgba(145, 213, 255, 0.2)'} !important;
      }
    }
  `;

  // 修改卡片样式
  const StyledCard = styled(Card)`
    margin-bottom: 20px;
    background-color: ${(props) => props.theme.isDark ? '#424242' : '#fff'};
    color: ${(props) => props.theme.isDark ? '#fff' : '#000'};
    padding: 20px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'};
    
    .ant-card-head {
      border-bottom: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'};
    }
    
    .ant-card-head-title {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
    }
  `;

  return (
    <StyledCard title={`八字信息 - ${baziTitle}`} theme={customTheme}>
      <StyledTable
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        rowKey="key"
        theme={customTheme}
      />
    </StyledCard>
  );
};

export default BaZiDisplay;
