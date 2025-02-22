import React, { useState } from 'react';
import { Card, Table } from 'antd';
import { EightChar, Lunar } from 'lunar-typescript';

interface LiuNianDisplayProps {
  eightChar: EightChar;
  gender: '男' | '女';
}

const LiuNianDisplay: React.FC<LiuNianDisplayProps> = ({ eightChar }) => {
  const [selectedLiuNian, setSelectedLiuNian] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const data = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - 5 + i;
    const lunar = Lunar.fromYmd(year, 1, 1);
    return {
      key: i,
      ganZhi: lunar.getYearInGanZhi(),
      year,
    };
  });

  const columns = [
    { title: '流年', dataIndex: 'ganZhi', key: 'ganZhi' },
    { title: '年份', dataIndex: 'year', key: 'year' },
  ];

  return (
    <Card title="流年信息" style={{ marginBottom: '20px' }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={(record) => ({
          onClick: () => setSelectedLiuNian(record.ganZhi),
        })}
        rowClassName={(record) => (record.ganZhi === selectedLiuNian ? 'selected-row' : '')}
      />
    </Card>
  );
};

export default LiuNianDisplay;