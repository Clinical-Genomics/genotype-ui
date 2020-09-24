import React, { useEffect, useState } from 'react';
import { getAnalyses } from '../services/services';
import { Loading } from '../components/Loading';
import { EditableTable } from '../components/EditableTable';
import { isAuthenticated } from '../services/helpers';
import { useHistory } from 'react-router-dom';

const AnalysesComponent = () => {
  const history = useHistory();

  const [baseSource, setBaseSource] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const getData = () => {
    getAnalyses(true)
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

  useEffect(() => {
    if (isAuthenticated() === true) getData();
    else {
      const timer = setTimeout(() => {
        if (isAuthenticated()) {
          getData();
        } else {
          history.push('/unauthorized');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [history]);

  return (
    <div>
      {!isLoaded && <Loading></Loading>}
      {isLoaded && (
        <EditableTable
          dataSource={baseSource}
          rowKey="id"
          isVisible={true}
          hideSearch={false}
        />
      )}
    </div>
  );
};

export const Samples = React.memo(AnalysesComponent);
