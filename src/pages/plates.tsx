import React, { useState } from 'react';
import { getPlates } from '../services/services';
import { Loading } from '../components/Loading';
import { EditableTable } from '../components/EditableTable';
import { Input } from 'antd';

const FamilyAnalysesComponent = () => {
  const [baseSource, setBaseSource] = useState<any[]>();
  const [isLoaded, setIsLoaded] = useState<boolean>();

  const searchFamily = (value) => {
    setIsLoaded(false);
    getPlates(value)
      .then((response) => {
        setBaseSource(
          response.analyses.map((analysis) => {
            return {
              family: analysis.family,
              priority: analysis.priority,
              id: analysis.id,
              started: analysis.started_at,
              type: analysis.type,
              user: analysis.user?.name,
              status: analysis.status,
              comment: analysis.comment,
              visible: analysis.is_visible,
              progress: analysis.progress,
            };
          })
        );
      })
      .then(() => {
        setIsLoaded(true);
      });
  };

  return (
    <div>
      <Input.Search
        style={{ margin: '0 0 10px 0' }}
        placeholder="Search..."
        enterButton
        onSearch={searchFamily}
      />
      {isLoaded === false && baseSource && <Loading></Loading>}
      {baseSource && isLoaded && (
        <EditableTable
          dataSource={baseSource}
          rowKey="id"
          hideSearch={true}
          isVisible={false}
        />
      )}
    </div>
  );
};

export const Plates = React.memo(FamilyAnalysesComponent);
