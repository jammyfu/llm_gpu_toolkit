import React from "react";
import { Typography} from "antd";

const { Paragraph, Text } = Typography;

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
