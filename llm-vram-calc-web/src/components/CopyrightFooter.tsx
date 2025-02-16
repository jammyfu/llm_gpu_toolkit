import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Text } = Typography;

const CopyrightWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  
  a {
    color: ${props => props.theme.isDark ? '#8c8c8c' : '#595959'};
    text-decoration: none;
    
    &:hover {
      color: ${props => props.theme.isDark ? '#d9d9d9' : '#262626'};
    }
  }
`;

const CopyrightFooter: React.FC = () => {
  return (
    <CopyrightWrapper>
      <Link to="/copyright">
        <Text type="secondary">
          Copyright © {new Date().getFullYear()} JammyFu
        </Text>
      </Link>
    </CopyrightWrapper>
  );
};

export default CopyrightFooter; 