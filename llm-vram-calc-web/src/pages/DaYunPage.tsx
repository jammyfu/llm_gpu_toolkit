import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';

interface DaYunDataType {
  period: number;
  ganZhi: string;
  startAge: number;
  startYear: number;
  naYin?: string;
  tenGod?: string;
  hiddenGan?: string;
  xunKong?: string;
  analysis?: string;
}

// 使用泛型来定义 StyledTable
const StyledTable = styled(Table<DaYunDataType>)`
  .ant-table-cell {
    vertical-align: middle;
    padding: 12px 8px;
  }
`;

const DaYunPage = () => {
  const location = useLocation();
  const { daYunData } = location.state || {};

  const columns: ColumnsType<DaYunDataType> = [
    { 
      title: '大运', 
      dataIndex: 'period',
      width: 80,
      fixed: 'left' as const
    },
    { 
      title: '干支', 
      dataIndex: 'ganZhi',
      width: 100
    },
    { 
      title: '起运年龄', 
      dataIndex: 'startAge',
      width: 100
    },
    { 
      title: '起运年份', 
      dataIndex: 'startYear',
      width: 100
    },
    { 
      title: '纳音', 
      dataIndex: 'naYin',
      width: 120
    },
    { 
      title: '十神', 
      dataIndex: 'tenGod',
      width: 100
    },
    { 
      title: '藏干', 
      dataIndex: 'hiddenGan',
      width: 120
    },
    { 
      title: '旬空', 
      dataIndex: 'xunKong',
      width: 100
    },
    { 
      title: '运势分析', 
      dataIndex: 'analysis',
      ellipsis: true
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="详细大运信息">
        <StyledTable
          columns={columns}
          dataSource={daYunData}
          rowKey="period"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          bordered
        />
      </Card>
    </div>
  );
};

export default DaYunPage; 