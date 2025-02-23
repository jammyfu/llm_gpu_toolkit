import React, { useState } from 'react';
import { Lunar, Solar } from 'lunar-typescript';
import BaZiInput from '../components/BaZiInput';
import BaZiDisplay from '../components/BaZiDisplay';
import DaYunDisplay from '../components/DaYunDisplay';
import dayjs, { Dayjs } from 'dayjs';
import { BaZiData } from '../types/bazi';
import { dateTimeLocale, Locale } from '../locales/datetime';
import './BaziPage.css';
import styled, { ThemeProvider } from 'styled-components';
import { LunarUtil } from 'lunar-typescript';
import baziLogger from '../utils/BaziLogger';
import { GlobalStyle } from '../styles/GlobalStyles';
import { Switch } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

// 主页面组件
interface BaziPageProps {
  locale?: Locale;
}

const ContentWrapper = styled.div`
  max-width: 2400px;  // 增加最大宽度
  margin: 0 auto;
  padding: 0 20px;
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;  // 改为顶部对齐
  padding: 10px 20px;  // 增加左右内边距
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.isDark ? '#ffffff' : '#333'};
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.isDark ? 'rgba(255, 255, 255, 0.85)' : '#666'};
`;

const BaziPage: React.FC<BaziPageProps> = ({ locale = 'zh' }) => {
  const [baziData, setBaziData] = useState<BaZiData | null>(null);
  const t = dateTimeLocale[locale];
  const [defaultDate, setDefaultDate] = useState<Dayjs | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const handleCalculate = (date: Dayjs, time: string, gender: number) => {
    try {
      // 确保性别值是数字
      console.log('Gender value:', gender); // 添加日志以便调试
      const data = baziLogger.displayFullBazi(
        date.toDate(), 
        time, 
        gender === 1 ? '男' : gender === 0 ? '女' : ''
      );
      setBaziData(data);
    } catch (error) {
      console.error('八字计算错误:', error);
      // 可以添加错误提示状态
      setBaziData(null);
    }
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={{ isDark: isDarkMode }}>
      <GlobalStyle theme={{ isDark: isDarkMode }} />
      <div className="bazi-container">
        <Header>
          <div>
            <TitleContainer>
              <Title>{t.title}</Title>
              <Subtitle>{t.subtitle}</Subtitle>
            </TitleContainer>
          </div>
          <Switch
            checked={isDarkMode}
            onChange={handleThemeChange}
            checkedChildren={<MoonOutlined style={{ fontSize: "1rem" }} />}
            unCheckedChildren={<SunOutlined style={{ fontSize: "1rem" }} />}
          />
        </Header>

        <ContentWrapper>
          <div className="bazi-input-section">
            <BaZiInput 
              onCalculate={handleCalculate} 
              locale={locale}
              defaultDate={defaultDate}
              theme={{ isDark: isDarkMode }}
            />
          </div>
          
          {baziData && (
            <ContentColumn>
              <BaZiDisplay 
                yearPillar={baziData.yearPillar}
                monthPillar={baziData.monthPillar}
                dayPillar={baziData.dayPillar}
                hourPillar={baziData.hourPillar}
                solarDate={baziData.birth.solar}
                lunarDate={baziData.birth.lunar}
                theme={{ isDark: isDarkMode }}
              />
              <DaYunDisplay 
                daYun={baziData.daYun}
                theme={{ isDark: isDarkMode }}
              />
            </ContentColumn>
          )}
        </ContentWrapper>
      </div>
    </ThemeProvider>
  );
};

BaziPage.defaultProps = {
  locale: 'zh'
};

export default BaziPage;

