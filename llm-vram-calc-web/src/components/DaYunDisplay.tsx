import React, { useState } from 'react';
import { Card, Table, Button, Drawer, Tabs } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DaYunInfo } from '../types/bazi';
import styled from 'styled-components';
import { useContext } from 'react';
import { BaZiUtil } from '../utils/BaziUtil';

// 定义流年数据接口，修改 xunKong 类型
interface LiuNianInfo {
  year: number;
  ganZhi: string;
  shiShen: string;
  naYin: string;
  xunKong: string | number; // 允许字符串或数字类型
  hidden: any[];
}

// 定义流月数据接口，修改 xunKong 类型
interface LiuYueInfo {
  year: number;
  month: number;
  ganZhi: string;
  shiShen: string;
  naYin: string;
  xunKong: string | number; // 允许字符串或数字类型
  hidden: any[];
}

interface DaYunDisplayProps {
  daYun?: DaYunInfo[];
  theme: { isDark: boolean };
  dayGan: string;
}

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

const StyledDrawer = styled(Drawer)<{ theme: { isDark: boolean } }>`
  .ant-drawer-header {
    background-color: ${(props) => props.theme.isDark ? '#333333' : '#ffffff'};
    border-bottom: 1px solid ${(props) => props.theme.isDark ? '#555555' : '#f0f0f0'};
    
    .ant-drawer-title {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
    }
    
    .ant-drawer-close {
      color: ${(props) => props.theme.isDark ? '#ffffff' : '#000000'};
    }
  }
  
  .ant-drawer-body {
    background-color: ${(props) => props.theme.isDark ? '#1f1f1f' : '#ffffff'};
  }
`;

// 修改 StyledTable 组件，使其接受泛型参数
function createStyledTable<T extends object>() {
  return styled(Table)<{ theme: { isDark: boolean } } & TableProps<T>>`
    .ant-table-cell {
      vertical-align: middle;
      padding: 12px 8px;
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

    && {
      .ant-pagination {
        .ant-pagination-item-active {
          background-color: ${(props) => props.theme.isDark ? 
            '#8fb82e' : 
            '#7c9a2e'
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
}

const DaYunDisplay: React.FC<DaYunDisplayProps> = ({ daYun = [], theme: customTheme, dayGan }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(0);
  const [liuNianData, setLiuNianData] = useState<LiuNianInfo[]>([]);
  const [liuYueData, setLiuYueData] = useState<LiuYueInfo[]>([]);

  // 创建表格组件
  const DaYunTable = createStyledTable<DaYunInfo>();
  const LiuNianTable = createStyledTable<LiuNianInfo>();
  const LiuYueTable = createStyledTable<LiuYueInfo>();

  const baziUtil = new BaZiUtil();
  
  // 查看流年流月详情
  const handleViewDetail = (startYear: number) => {
    setSelectedYear(startYear);
    
    // 生成10年的流年数据
    const years = Array.from({ length: 10 }, (_, i) => startYear + i);
    const liuNianData = years.map(year => baziUtil.getLiuNian(year, dayGan));
    setLiuNianData(liuNianData as LiuNianInfo[]); // 使用类型断言
    
    // 获取当前年的流月数据
    const currentYear = new Date().getFullYear();
    if (years.includes(currentYear)) {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const liuYueData = months.map(month => baziUtil.getLiuYue(currentYear, month, dayGan));
      setLiuYueData(liuYueData as LiuYueInfo[]); // 使用类型断言
    } else {
      setLiuYueData([]);
    }
    
    setDrawerVisible(true);
  };

  const columns: ColumnsType<DaYunInfo> = [
    { title: '大运', dataIndex: 'period', width: 80 },
    { title: '干支', dataIndex: 'ganZhi', width: 100 },
    { title: '起运年龄', dataIndex: 'startAge', width: 100 },
    { title: '起运年份', dataIndex: 'startYear', width: 100 },
    { 
      title: '操作', 
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleViewDetail(record.startYear)}
        >
          查看流年
        </Button>
      ),
    }
  ];

  const liuNianColumns: ColumnsType<LiuNianInfo> = [
    { title: '年份', dataIndex: 'year', width: 80 },
    { title: '干支', dataIndex: 'ganZhi', width: 120 },
    { title: '十神', dataIndex: 'shiShen', width: 80 },
  ];
  
  const liuYueColumns: ColumnsType<LiuYueInfo> = [
    { title: '月份', dataIndex: 'month', width: 60 },
    { title: '干支', dataIndex: 'ganZhi', width: 120 },
    { title: '十神', dataIndex: 'shiShen', width: 80 },
  ];

  return (
    <>
      <StyledCard title="大运信息" theme={customTheme}>
        <DaYunTable 
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

      <StyledDrawer
        title={`流年流月信息 (从${selectedYear}年起)`}
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        theme={customTheme}
      >
        <Tabs defaultActiveKey="liuNian">
          <Tabs.TabPane tab="流年" key="liuNian">
            <LiuNianTable 
              columns={liuNianColumns}
              dataSource={liuNianData}
              rowKey="year"
              pagination={false}
              bordered
              theme={customTheme}
            />
          </Tabs.TabPane>
          {liuYueData.length > 0 && (
            <Tabs.TabPane tab="流月" key="liuYue">
              <LiuYueTable 
                columns={liuYueColumns}
                dataSource={liuYueData}
                rowKey="month"
                pagination={false}
                bordered
                theme={customTheme}
              />
            </Tabs.TabPane>
          )}
        </Tabs>
      </StyledDrawer>
    </>
  );
};

export default DaYunDisplay; 