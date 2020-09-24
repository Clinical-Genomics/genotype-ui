import { GetAnalysesResponse, GetJobsResponse } from './interfaces';
import { getAuthHeaders, getToken, OpenNotification } from './helpers';
const { REACT_APP_BACKEND_URL } = process.env;

export const getJobs = async (
  token: string = getToken()
): Promise<GetJobsResponse> => {
  let response = { jobs: [] };
  try {
    const request = await fetch(`${REACT_APP_BACKEND_URL}/aggregate/jobs`, {
      mode: 'cors',
      headers: getAuthHeaders(token),
    });
    response = await request.json();
  } catch (error) {
    OpenNotification({
      type: 'error',
      message: 'Something went wrong',
      description: 'Could not fetch data from backend',
    });
  }
  return response;
};

export const getAnalyses = async (
  isVisible?: boolean,
  token: string = getToken()
): Promise<GetAnalysesResponse> => {
  let response = { analyses: [] };

  const endPoint = isVisible
    ? '/analyses?is_visible=true'
    : '/analyses?is_visible=false';
  try {
    const request = await fetch(
      `${REACT_APP_BACKEND_URL}${endPoint}&per_page=200`,
      {
        mode: 'cors',
        headers: getAuthHeaders(token),
      }
    );
    response = await request.json();
  } catch (error) {
    OpenNotification({
      type: 'error',
      message: 'Something went wrong',
      description: 'Could not fetch data from backend',
    });
  }
  return response;
};

export const getAnalysesByFamily = async (
  family = '',
  token: string = getToken()
): Promise<GetAnalysesResponse> => {
  let response = { analyses: [] };

  try {
    const request = await fetch(
      `${REACT_APP_BACKEND_URL}/analyses?query=${family}&per_page=50`,
      {
        mode: 'cors',
        headers: getAuthHeaders(token),
      }
    );
    response = await request.json();
  } catch (error) {
    OpenNotification({
      type: 'error',
      message: 'Something went wrong',
      description: 'Could not fetch data from backend',
    });
  }
  return response;
};

export const getAnalysis = async (
  analysisId: string,
  token: string = getToken()
): Promise<any> => {
  let response = {};

  try {
    const request = await fetch(
      `${REACT_APP_BACKEND_URL}/analyses${analysisId}`,
      {
        mode: 'cors',
        headers: getAuthHeaders(token),
      }
    );
    response = await request.json();
  } catch (error) {
    OpenNotification({
      type: 'error',
      message: 'Something went wrong',
      description: 'Could not fetch data from backend',
    });
  }
  return response;
};

export const editAnalysis = async (
  analysisId: string,
  type: string,
  isVisible?: boolean,
  comment?: string,
  token: string = getToken()
): Promise<any> => {
  let response = {};

  const body =
    type === 'comment' ? { comment: comment } : { is_visible: isVisible };

  try {
    const request = await fetch(
      `${REACT_APP_BACKEND_URL}/analyses/${analysisId}`,
      {
        method: 'PUT',
        mode: 'cors',
        headers: getAuthHeaders(token),
        body: JSON.stringify(body),
      }
    );
    response = await request.json();
  } catch (error) {
    OpenNotification({
      type: 'error',
      message: 'Something went wrong',
      description: 'Could not fetch data from backend',
    });
  }
  return response;
};
