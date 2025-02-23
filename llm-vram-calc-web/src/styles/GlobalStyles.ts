import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 16px;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${(props: { theme: { isDark: boolean } }) =>
      props.theme.isDark ? "#141414" : "#ffffff"};
    transition: background-color 0.3s ease;
  }

  .ant-table-row:hover td {
    background-color: inherit !important;
  }

  /*
  .ant-table {
    background: ${(props: { theme: { isDark: boolean } }) =>
      props.theme.isDark ? "#1f1f1f" : "#ffffff"};
  }
  */

  /* 移除日期组件的全局样式 */
  /* .ant-picker {
    background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'} !important;
    border-color: ${(props) => props.theme.isDark ? '#434343' : '#d9d9d9'} !important;
    
    .ant-picker-input > input {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
    }

    .ant-picker-suffix {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
    }

    .ant-picker-clear {
      background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'} !important;
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
    }
  }

  .ant-picker-dropdown {
    background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'} !important;
    border-color: ${(props) => props.theme.isDark ? '#434343' : '#f0f0f0'} !important;

    .ant-picker-panel {
      background: inherit !important;
      border-color: inherit !important;

      .ant-picker-header {
        color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
        border-bottom-color: ${(props) => props.theme.isDark ? '#434343' : '#f0f0f0'} !important;
      }

      .ant-picker-cell {
        color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;

        &-inner:hover {
          background: ${(props) => props.theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'} !important;
        }

        &-selected .ant-picker-cell-inner {
          background: ${(props) => props.theme.isDark ? '#1890ff' : '#e6f7ff'} !important;
        }
      }
    }

    .ant-picker-footer {
      border-top-color: ${(props) => props.theme.isDark ? '#434343' : '#f0f0f0'} !important;
    }
  } */
`; 