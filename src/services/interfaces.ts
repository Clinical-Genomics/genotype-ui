export interface GetJobsResponse {
  jobs: Array<any>;
}

export interface GetAnalysesResponse {
  analyses: Array<any>;
}

export interface ErrorNotification {
  type: 'error';
  message: string;
  description: string;
}
