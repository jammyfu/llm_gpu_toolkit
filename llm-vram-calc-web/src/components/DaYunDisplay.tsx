import React from 'react';
import { Card, Table, theme } from 'antd';
import { DaYunInfo } from '../types/bazi';
import styled from 'styled-components';

interface DaYunDisplayProps {
  daYun?: DaYunInfo[];
  theme: { isDark: boolean };
}

// 简化样式，移除所有主题相关的代码
const StyledCard = styled(Card)`
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.isDark ? '#333' : '#fff'};
  color: ${(props) => props.theme.isDark ? '#fff' : '#000'};
  padding: 20px;
  border-radius: 8px;
  .ant-card-head-title {
    color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
  }
`;

const DaYunDisplay: React.FC<DaYunDisplayProps> = ({ daYun = [], theme: customTheme }) => {
  const { token } = theme.useToken();

  const columns = [
    { title: '大运', dataIndex: 'period', width: 80 },
    { title: '干支', dataIndex: 'ganZhi', width: 100 },
    { title: '起运年龄', dataIndex: 'startAge', width: 100 },
    { title: '起运年份', dataIndex: 'startYear', width: 100 },
    { title: '纳音', dataIndex: 'naYin', width: 120 },
    { title: '十神', dataIndex: 'tenGod', width: 100 },
    { title: '藏干', dataIndex: 'hiddenGan', width: 120 },
    { title: '旬空', dataIndex: 'xunKong', width: 100 },
    { 
      title: '运势分析', 
      dataIndex: 'analysis',
      ellipsis: true
    }
  ];

  const StyledTable = styled(Table)<{ theme: { isDark: boolean } }>`
    .ant-table-cell {
      vertical-align: middle;
      padding: 12px 8px;
      background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'};
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
    }

    .ant-table-thead > tr > th {
      background-color: ${(props) => props.theme.isDark ? '#303030' : '#f0f0f0'};
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
    }

    && {
      .ant-table-tbody > tr:hover > td {
        background-color: ${(props) => 
          props.theme.isDark 
            ? 'rgba(3, 31, 54, 0.8)'   // 深色模式：深蓝色，透明度0.8
            : 'rgba(145, 213, 255, 0.2)'} !important; // 浅色模式：浅蓝色，透明度0.2
      }
    }

    && {
      .ant-pagination {
        .ant-pagination-item-active {
          background-color: ${(props) => props.theme.isDark ? 
            '#8fb82e' : // 深色模式下使用更深的绿色
            '#7c9a2e' // 浅色模式下使用更深的绿色
          } !important;
          border-color: ${(props) => props.theme.isDark ? 
            '#8fb82e' : 
            '#7c9a2e'
          } !important;

          a {
            color: #ffffff !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
        }

        .ant-pagination-item:not(.ant-pagination-item-active):hover {
          border-color: ${(props) => props.theme.isDark ? 
            '#a9d134' : 
            '#8fb82e'
          } !important;
          
          a {
            color: ${(props) => props.theme.isDark ? 
              '#a9d134' : 
              '#8fb82e'
            } !important;
          }
        }

        .ant-pagination-prev, 
        .ant-pagination-next {
          &:hover .ant-pagination-item-link {
            border-color: ${(props) => props.theme.isDark ? 
              '#a9d134' : 
              '#8fb82e'
            } !important;
            color: ${(props) => props.theme.isDark ? 
              '#a9d134' : 
              '#8fb82e'
            } !important;
          }
        }

        // 添加总数文字的样式
        .ant-pagination-total-text {
          color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
        }

        // 添加每页条数选择器的样式
        .ant-select {
          .ant-select-selector {
            color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
            background-color: ${(props) => props.theme.isDark ? '#333333' : '#ffffff'} !important;
            border-color: ${(props) => props.theme.isDark ? '#555555' : '#d9d9d9'} !important;
          }
          
          .ant-select-arrow {
            color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
          }
        }

        // 修改箭头按钮的样式
        .ant-pagination-prev, 
        .ant-pagination-next {
          .ant-pagination-item-link {
            color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'} !important;
            background-color: ${(props) => props.theme.isDark ? '#333333' : '#ffffff'} !important;
            border-color: ${(props) => props.theme.isDark ? '#555555' : '#d9d9d9'} !important;
          }

          &:hover .ant-pagination-item-link {
            border-color: ${(props) => props.theme.isDark ? '#a9d134' : '#8fb82e'} !important;
            color: ${(props) => props.theme.isDark ? '#a9d134' : '#8fb82e'} !important;
          }
        }
      }
    }
  `;

  return (
    <StyledCard title="大运信息" theme={customTheme}>
      <StyledTable 
        columns={columns}
        dataSource={daYun}
        rowKey="period"
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        bordered
        theme={customTheme}
      />
    </StyledCard>
  );
};

export default DaYunDisplay; 