import React, { useState } from 'react';
import { DatePicker, TimePicker, Card, Typography, Space, ConfigProvider, Switch, DatePickerProps, TimePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';  // 导入中文语言包
import { Solar, Lunar, HolidayUtil } from 'lunar-typescript';
import styled from 'styled-components';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { Helmet } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin: 20px;
  max-width: 800px;
  margin: 20px auto;
`;

const ResultCard = styled(Card)<{ isDark?: boolean }>`
  margin-top: 20px;
  background: ${props => props.isDark ? '#1f1f1f' : '#f5f5f5'};
`;

const DateTimeWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const StyledDatePicker = styled(DatePicker)`
  &.ant-picker {
    width: 320px;  // 增加到原来的2倍
  }
  .ant-picker-cell-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const StyledTimePicker = styled(TimePicker)`
  &.ant-picker {
    width: 120px;
  }
`;

interface LunarInfo {
  lunarDate: string;
  solarDate: string;
  solarTerm: string;
  zodiac: string;
  festival: string;
  bazi: string;
  baZiWuXing: string;
  monthInGanZhiExact: string;
  zheng: string;
  animal: string;
  yearInGanZhi: string;
  monthInGanZhi: string;
  dayInGanZhi: string;
  timeGanZhi: string;
  isLeap: number;
  fullString: string;
  eightChar: string;
}

// 农历日期渲染函数
const dateRender = (current: Dayjs) => {
  const solar = Solar.fromYmd(current.year(), current.month() + 1, current.date());
  const lunar = solar.getLunar();
  const lunarDay = lunar.getDayInChinese();
  const festivals = [
    ...lunar.getFestivals(),
    ...solar.getFestivals(),
    ...lunar.getOtherFestivals()
  ];
  
  return (
    <div className="ant-picker-cell-inner">
      <div>{current.date()}</div>
      <div style={{ 
        fontSize: '12px', 
        color: festivals.length > 0 ? '#f50' : 'inherit',
        lineHeight: 1
      }}>
        {festivals.length > 0 ? festivals[0] : lunarDay}
      </div>
    </div>
  );
};

// 禁用范围外的日期
const disabledDate = (current: Dayjs) => {
  const year = current.year();
  return year < 1900 || year > 2100;
};

// 设置 dayjs 默认语言为中文
dayjs.locale('zh-cn');

const LunarConverterPage: React.FC<{ language?: 'zh' | 'en' }> = ({ language = 'zh' }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 设置默认日期为今天
  React.useEffect(() => {
    setSelectedDate(dayjs());
    // 根据语言设置更新 dayjs 语言
    dayjs.locale(language === 'zh' ? 'zh-cn' : 'en');
  }, [language]);

  // 处理日期变化
  const handleDateChange = (date: any, dateString: any) => {
    setSelectedDate(date);
  };

  // 处理时间变化
  const handleTimeChange = (time: any, dateString: any) => {
    setSelectedTime(time);
  };

  const getLunarInfo = (): LunarInfo | null => {
    if (!selectedDate) return null;

    const solar = Solar.fromYmd(
      selectedDate.year(),
      selectedDate.month() + 1,
      selectedDate.date()
    );
    const lunar = solar.getLunar();
    const hour = selectedTime?.hour() ?? 0;

    // 计算时辰
    const getTimeZhi = (hour: number): string => {
      const timeMap = [
        { start: 23, end: 1, zhi: '子' },
        { start: 1, end: 3, zhi: '丑' },
        { start: 3, end: 5, zhi: '寅' },
        { start: 5, end: 7, zhi: '卯' },
        { start: 7, end: 9, zhi: '辰' },
        { start: 9, end: 11, zhi: '巳' },
        { start: 11, end: 13, zhi: '午' },
        { start: 13, end: 15, zhi: '未' },
        { start: 15, end: 17, zhi: '申' },
        { start: 17, end: 19, zhi: '酉' },
        { start: 19, end: 21, zhi: '戌' },
        { start: 21, end: 23, zhi: '亥' }
      ];
      
      const time = timeMap.find(t => 
        (t.start <= hour && hour < t.end) || 
        (t.start === 23 && (hour >= 23 || hour < 1))
      );
      
      return time?.zhi || '子';
    };

    return {
      solarDate: solar.toFullString(),
      lunarDate: language === 'zh' 
        ? `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
        : `Lunar Year ${lunar.getYear()}, Month ${lunar.getMonth()}, Day ${lunar.getDay()}`,
      solarTerm: lunar.getJieQi() || '-',
      zodiac: lunar.getYearShengXiao(),
      festival: [
        lunar.getFestivals().join('、'),
        solar.getFestivals().join('、'),
        lunar.getOtherFestivals().join('、')
      ].filter(Boolean).join('、') || '-',
      monthInGanZhiExact: lunar.getMonthInGanZhiExact(),
      zheng: lunar.getMonthZhi(),
      bazi: lunar.getBaZi().join(','),
      baZiWuXing: lunar.getBaZiWuXing().join(','),
      animal: lunar.getDayShengXiao(),
      yearInGanZhi: lunar.getYearInGanZhi(),
      monthInGanZhi: lunar.getMonthInGanZhi(),
      dayInGanZhi: lunar.getDayInGanZhi(),
      timeGanZhi: getTimeZhi(hour),
      isLeap: lunar.getMonth() < 0 ? 1 : 0,
      fullString: lunar.toFullString(),
      eightChar:lunar.getEightChar().toString()
    };
  };

  const lunarInfo = getLunarInfo();

  return (
    <ThemeProvider theme={{ isDark: isDarkMode }}>
      <ConfigProvider 
        locale={language === 'zh' ? zhCN : enUS}
        theme={{
          components: {
            DatePicker: {
              cellHeight: 40,  // 增加单元格高度以适应农历显示
            }
          }
        }}
      >
        <Helmet>
          <title>{language === 'zh' ? '公历农历转换器' : 'Solar-Lunar Calendar Converter'}</title>
        </Helmet>
        <StyledCard 
          title={language === 'zh' ? '公历农历转换' : 'Solar-Lunar Conversion'}
          extra={
            <Switch
              checkedChildren="🌞"
              unCheckedChildren="🌙"
              checked={!isDarkMode}
              onChange={(checked) => {
                setIsDarkMode(!checked);
                localStorage.setItem("theme", !checked ? "dark" : "light");
              }}
            />
          }
        >
          <DateTimeWrapper>
            <StyledDatePicker 
              value={selectedDate}
              onChange={handleDateChange}
              placeholder={language === 'zh' ? '选择日期' : 'Select date'}
              format="YYYY-MM-DD"
              dateRender={dateRender}
              disabledDate={disabledDate}
              showToday
              allowClear={false}
              popupStyle={{ fontSize: '14px' }}
            />
            <StyledTimePicker
              value={selectedTime}
              onChange={handleTimeChange}
              placeholder={language === 'zh' ? '选择时间' : 'Select time'}
              format="HH:mm"
              popupStyle={{ fontSize: '14px' }}
            />
          </DateTimeWrapper>

          {lunarInfo && (
            <ResultCard isDark={isDarkMode}>
              <Space direction="vertical" size="middle">
                <div>
                  <Text strong>{language === 'zh' ? '公历日期：' : 'Solar Date: '}</Text>
                  <Text>{lunarInfo.solarDate}</Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '农历日期：' : 'Lunar Date: '}</Text>
                  <Text>
                    {lunarInfo.lunarDate}
                    {lunarInfo.isLeap === 1 && (language === 'zh' ? '（闰月）' : ' (Leap Month)')}
                  </Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '八字：' : 'Bazi: '}</Text>
                  <Text>
                    {lunarInfo.eightChar}
                  </Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '八字五行：' : 'Bazi WuXing: '}</Text>
                  <Text>
                    {lunarInfo.baZiWuXing}
                  </Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '农历完整：' : 'Full Lunar Info: '}</Text>
                  <Text>{lunarInfo.fullString}</Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '节日：' : 'Festivals: '}</Text>
                  <Text>{lunarInfo.festival}</Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '节气：' : 'Solar Term: '}</Text>
                  <Text>{lunarInfo.solarTerm}</Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '生肖：' : 'Zodiac: '}</Text>
                  <Text>{lunarInfo.zodiac}</Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '精确月干支：' : 'Exact Month GanZhi: '}</Text>
                  <Text>{lunarInfo.monthInGanZhiExact}</Text>
                </div>
                <div>
                  <Text strong>当月节气：</Text>
                  <Text>{lunarInfo.zheng}</Text>
                </div>
                <div>
                  <Text strong>本日生肖：</Text>
                  <Text>{lunarInfo.animal}</Text>
                </div>
                <div>
                  <Text strong>{language === 'zh' ? '干支：' : 'Heavenly Stems and Earthly Branches: '}</Text>
                  <Text>
                    {language === 'zh' 
                      ? `年：${lunarInfo.yearInGanZhi}，月：${lunarInfo.monthInGanZhi}，日：${lunarInfo.dayInGanZhi}，时：${lunarInfo.timeGanZhi}`
                      : `Year: ${lunarInfo.yearInGanZhi}, Month: ${lunarInfo.monthInGanZhi}, Day: ${lunarInfo.dayInGanZhi}, Hour: ${lunarInfo.timeGanZhi}`
                    }
                  </Text>
                </div>
              </Space>
            </ResultCard>
          )}
        </StyledCard>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default LunarConverterPage; 