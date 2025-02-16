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
      <Helmet>
        <title>Copyright © 2025 JammyFu. All rights reserved.</title>
        <meta
          name="description"
          content="LLM VRAM Calculator 的版权信息和开源声明。由 JammyFu 开发的大语言模型显存计算工具。"
        />
        <meta
          name="keywords"
          content="版权信息,开源项目,MIT许可证,LLM工具,AI开发者工具"
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
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
