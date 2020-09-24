import React from 'react';
import { Spin, Space } from 'antd';

export const Loading = () => {
  return (
    <Space size="middle">
      <Spin size="large" />
    </Space>
  );
};
