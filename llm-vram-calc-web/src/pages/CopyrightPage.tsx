import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography, Card } from "antd";
import styled from "styled-components";

const { Paragraph, Text } = Typography;

const StyledCard = styled(Card)`
  max-width: 800px;
  margin: 20px auto;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CopyrightPage: React.FC = () => {
  return (
    <>
      <Paragraph style={{ textAlign: "center", marginTop: "20px" }}>
        <Text type="secondary">
          Copyright © {new Date().getFullYear()} JammyFu. All rights reserved.
        </Text>
      </Paragraph>
      {/* ... 现有的页面内容保持不变 ... */}
    </>
  );
};

export default CopyrightPage;
