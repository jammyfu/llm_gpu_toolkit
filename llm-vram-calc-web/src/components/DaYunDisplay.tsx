import React from 'react';
import { Card, Table } from 'antd';
import { DaYunInfo } from '../types/bazi';
import styled from 'styled-components';

interface DaYunDisplayProps {
  daYun?: DaYunInfo[];
}

// 简化样式，移除所有主题相关的代码
const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const StyledTable = styled(Table)`
  .ant-table-cell {
    vertical-align: middle;
    padding: 12px 8px;
  }
`;

const DaYunDisplay: React.FC<DaYunDisplayProps> = ({ daYun = [] }) => {
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

  return (
    <StyledCard title="大运信息">
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
      />
    </StyledCard>
  );
};

export default DaYunDisplay; 