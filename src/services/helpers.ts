import { ErrorNotification } from './interfaces';
import { notification } from 'antd';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

let authToken = '';
let name = '';
let imageURL = '';

export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  Accept: 'application/json, text/plain, */*',
  Authorization: `Bearer ${token}`,
});

export const OpenNotification = ({
  type,
  message,
  description,
}: ErrorNotification) => {
  const key = `open${Date.now()}`;
  notification[type]({
    message,
    description,
    btn: null,
    key,
    closeIcon: null,
  });
};

export const formatDate = (date: string) => moment(date).format('DD-MM-YYYY');

export const sortDate = (dateA: string, dateB: string) => {
  return new Date(dateA).getTime() - new Date(dateB).getTime();
};

export const sortComments = (commentA: string, commentB: string) => {
  commentA = commentA ? commentA : '';
  commentB = commentB ? commentB : '';
  return commentA.localeCompare(commentB);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (token.length > 10) {
    const isExpired = Date.now() >= (jwt_decode(token) as any).exp * 1000;
    return !isExpired;
  }
  return false;
};

export const getToken = () => {
  return authToken;
};

export const setToken = (token: string) => {
  authToken = token;
};

export const getName = () => {
  return name;
};

export const setName = (token_name: string) => {
  name = token_name;
};

export const getImageURL = () => {
  return imageURL;
};

export const setImageURL = (token_image: string) => {
  imageURL = token_image;
};
