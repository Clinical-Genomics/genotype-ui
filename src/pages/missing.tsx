import React, { useEffect, useState } from 'react';
import { getJobs } from '../services/services';
import { Table } from 'antd';
import { Loading } from '../components/Loading';

export const Missing = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Failed',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  useEffect(() => {
    getJobs()
      .then((response) => {
        setDataSource(response.jobs);
      })
      .then(() => {
        setIsLoaded(true);
      });
  }, []);
  return (
    <div>
      {!isLoaded && <Loading></Loading>}
      {isLoaded && (
        <Table dataSource={dataSource} columns={columns} rowKey="name" />
      )}
    </div>
  );
};
