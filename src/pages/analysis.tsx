import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getAnalysis } from '../services/services';
import { Skeleton, Card, Tag, Progress } from 'antd';
import {
  getPriorityTagColor,
  getStatusTagColor,
  getTypeTagColor,
} from '../components/styleHelpers';
import { formatDate, isAuthenticated } from '../services/helpers';

const AnalysisComponent = () => {
  const { Meta } = Card;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>({});
  const analysisId = useLocation().pathname;
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated() === true) {
      getAnalysis(analysisId)
        .then((response) => {
          setAnalysis(response);
        })
        .then(() => setIsLoaded(true));
    } else {
      const timer = setTimeout(() => {
        if (isAuthenticated()) {
          getAnalysis(analysisId)
            .then((response) => {
              setAnalysis(response);
            })
            .then(() => setIsLoaded(true));
        } else {
          history.push('/unauthorized');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [analysisId, history]);

  return (
    <Card style={{ width: '100%', marginTop: 16 }}>
      <Skeleton loading={!isLoaded} active>
        <Meta title={analysis.family} />
      </Skeleton>
      <p></p>
      <p>id {analysis.id}</p>
      <p>{analysis.version}</p>
      <p>{formatDate(analysis.started_at)}</p>
      <p>{analysis.user?.name}</p>
      {analysis.type && (
        <Tag color={getTypeTagColor(analysis.type)} key={analysis.type}>
          {analysis?.type?.toUpperCase()}
        </Tag>
      )}
      {analysis.priority && (
        <Tag
          color={getPriorityTagColor(analysis.priority)}
          key={analysis.priority}
        >
          {analysis.priority.toUpperCase()}
        </Tag>
      )}
      {analysis.status && (
        <Tag color={getStatusTagColor(analysis.status)} key={analysis.status}>
          {analysis?.status?.toUpperCase()}
        </Tag>
      )}
      {analysis.status === 'running' && (
        <Progress percent={Math.floor(analysis.progress * 100)} />
      )}
      <p>{analysis.comment}</p>
      {analysis.failed_jobs?.length > 0 &&
        analysis.failed_jobs.map((job) => (
          <p key={job.analysis_id + job.name + job.context}>
            {job.name}
            {' ('}
            {job.context}
            {') - '}
            {job.elapsed}
            {' min '}
            <Tag key={job}>{job.status.toUpperCase()}</Tag>
          </p>
        ))}
    </Card>
  );
};

export const Analysis = React.memo(AnalysisComponent);
