import React from 'react';
import PacmanLoader from '@bit/davidhu2000.react-spinners.pacman-loader';
import { primaryColor } from '../styles/style-constants';

export const Loading = () => {
  return <PacmanLoader size={60} color={primaryColor} />;
};
