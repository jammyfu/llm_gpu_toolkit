import React, { useState } from 'react';
import BaZiInput from '../components/BaZiInput';
import BaZiDisplay from '../components/BaZiDisplay';
import DaYunDisplay from '../components/DaYunDisplay';
import { Dayjs } from 'dayjs';
import { BaZiData } from '../types/bazi';
import { dateTimeLocale, Locale } from '../locales/datetime';
import styled, { ThemeProvider } from 'styled-components';
import baziLogger from '../utils/BaziLogger';
import { GlobalStyle } from '../styles/GlobalStyles';
import { Switch } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';

// 主页面组件
interface BaziPageProps {
  locale?: Locale;
}

const StyledApp = styled.div<{ $isDark: boolean }>`
  margin: 0 auto;
  padding: 1.25rem;
  min-height: 100vh;
  background: ${(props) =>
    props.$isDark
      ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${process.env.PUBLIC_URL}/images/background/background02_dark.jpg)`
      : `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${process.env.PUBLIC_URL}/images/background/background01_light.jpg)`};
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  transition: background 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const TitleContainer = styled.div`
  text-align: left;
`;

const Title = styled.h1<{ theme: { isDark: boolean } }>`
  font-size: 2rem;
  margin: 0;
  color: ${(props) => (props.theme.isDark ? '#ffffff' : '#000000')};
`;

const Subtitle = styled.h2<{ theme: { isDark: boolean } }>`
  font-size: 1rem;
  margin: 0.5rem 0 0;
  color: ${(props) => (props.theme.isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)')};
`;

const ContentWrapper = styled.div`
  max-width: 2400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

  const theme = {
    isDark: isDarkMode,
    colorPrimary: "#a9d134",
  };

  const handleCalculate = (date: Dayjs, time: string, gender: number, sect: number) => {
    try {
      const data = baziLogger.displayFullBazi(
        date.toDate(), 
        time, 
        gender === 1 ? '男' : gender === 0 ? '女' : '',
        sect
      );
      setBaziData(data);
    } catch (error) {
      console.error('八字计算错误:', error);
      setBaziData(null);
    }
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={{ isDark: isDarkMode }} />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#a9d134",
          },
        }}
      >
        <StyledApp $isDark={isDarkMode}>
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
                theme={theme}
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
                  baziTitle={baziData.baziTitle}
                  theme={theme}
                />
                <DaYunDisplay 
                  daYun={baziData.daYun}
                  dayGan={baziData.dayPillar.gan}
                  theme={theme}
                />
              </ContentColumn>
            )}
          </ContentWrapper>
        </StyledApp>
      </ConfigProvider>
    </ThemeProvider>
  );
};

BaziPage.defaultProps = {
  locale: 'zh'
};

export default BaziPage;

