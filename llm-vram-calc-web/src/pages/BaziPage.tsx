import React, { useState } from 'react';
import { Lunar, Solar } from 'lunar-typescript';
import BaZiInput from '../components/BaZiInput';
import BaZiDisplay from '../components/BaZiDisplay';
import DaYunDisplay from '../components/DaYunDisplay';
import dayjs, { Dayjs } from 'dayjs';
import { BaZiData } from '../types/bazi';
import { dateTimeLocale, Locale } from '../locales/datetime';
import './BaziPage.css';
import styled from 'styled-components';
import { LunarUtil } from 'lunar-typescript';
import baziLogger from '../utils/BaziLogger';

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

const Title = styled.h1`
  color: #333;
`;

const Subtitle = styled.p`
  color: #666;
`;

const BaziPage: React.FC<BaziPageProps> = ({ locale = 'zh' }) => {
  const [baziData, setBaziData] = useState<BaZiData | null>(null);
  const t = dateTimeLocale[locale];
  const [defaultDate, setDefaultDate] = useState<Dayjs | null>(null);

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

  return (
    <div className="bazi-container">
      <div className="bazi-header">
        <Title>{t.title}</Title>
        <Subtitle>{t.subtitle}</Subtitle>
      </div>

      <ContentWrapper>
        <div className="bazi-input-section">
          <BaZiInput 
            onCalculate={handleCalculate} 
            locale={locale}
            defaultDate={defaultDate}
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
            />
            <DaYunDisplay 
              daYun={baziData.daYun}
            />
          </ContentColumn>
        )}
      </ContentWrapper>
    </div>
  );
};

BaziPage.defaultProps = {
  locale: 'zh'
};

export default BaziPage;

