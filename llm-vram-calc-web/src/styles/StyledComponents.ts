import styled, { createGlobalStyle } from 'styled-components';
import { Card, InputNumber, Select, Typography } from 'antd';
import type { ThemeInterface } from '../types/themeTypes';

const { Title, Paragraph } = Typography;

export const GlobalStyle = createGlobalStyle<{ theme: ThemeInterface }>`
  html {
    font-size: 16px;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.isDark ? "#141414" : "#ffffff"};
    transition: background-color 0.3s ease;
  }
`;

export const StyledApp = styled.div<{ $isDark: boolean }>`
  margin: 0 auto;
  padding: 1.25rem;
  min-height: 100vh;
  background: ${(props) =>
    props.$isDark
      ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${process.env.PUBLIC_URL}/images/background/background01_dark.png)`
      : `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${process.env.PUBLIC_URL}/images/background/background02_light.png)`};
  background-size: cover;
  background-position: right;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: ${(props) => (props.$isDark ? "#ffffff" : "#000000")};
  font-size: 1rem;
  line-height: 1.6;

  @media (max-width: 48rem) {
    padding: 0.625rem;
  }
`;

// ... 其他样式组件的定义
export const StyledTitle = styled(Title)`
  &.ant-typography {
    color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }
`;

export const StyledParagraph = styled(Paragraph)`
  &.ant-typography {
    color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
    margin-bottom: 0;
    white-space: pre-wrap;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

// ... 继续导出其他样式组件 

// TopBar 相关样式
export const TopBar = styled.div`
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

// 内容卡片样式
export const ContentCard = styled.div`
  margin: 1rem;
  padding: 1.5rem;
  max-width: 2160px;
  margin-left: auto;
  margin-right: auto;
  background: ${props => props.theme.isDark ? 'rgba(0, 0, 0, 0.6)' : '#ffffff'};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

// Card 样式
export const StyledCard = styled(Card)`
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

// Select 样式
export const StyledSelect = styled(Select)`
  .ant-select-selection-overflow {
    @media (min-width: 62.5rem) {
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

    @media (max-width: 62.5rem) {
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

// InputNumber 样式
export const StyledInputNumber = styled(InputNumber)`
  .ant-input-number-input {
    font-size: 1rem;
    height: 2.25rem;
  }

  .ant-input-number-handler-wrap {
    width: 1.5rem;
  }
` as typeof InputNumber;

// 表单行样式
export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 62.5rem) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// 选择操作样式
export const SelectActions = styled.div`
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

// 内存操作样式
export const MemoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  .ant-btn {
    padding: 0.25rem 0.75rem;
    height: auto;
    font-size: 0.875rem;
  }
`;

// 模型描述样式
export const ModelDescription = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.isDark ? '#303030' : '#e8e8e8'};
  position: relative;
  &:last-child {
    border-bottom: none;
  }
`;

// 二维码容器样式
export const QRCodeContainer = styled.div`
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

// 语言切换样式
export const LanguageSwitch = styled.div`
  @media (max-width: 768px) {
    .desktop-switch {
      display: none;
    }
    .mobile-switch {
      display: block;
    }
  }

  @media (min-width: 769px) {
    .desktop-switch {
      display: block;
    }
    .mobile-switch {
      display: none;
    }
  }
`;

// 关闭按钮样式
export const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
  transition: color 0.3s;
  &:hover {
    color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  }
`;

// 章节标题样式
export const SectionTitle = styled(Title)`
  &.ant-typography {
    color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
`; 