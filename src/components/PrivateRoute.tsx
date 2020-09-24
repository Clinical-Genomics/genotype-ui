import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuthenticated } from '../services/helpers';

const PrivateRoute: React.FC<any> = ({
  component: Component,
  ...otherProps
}) => {
  const [hasAccess, setHasAccess] = React.useState(isAuthenticated());
  useEffect(() => {
    setHasAccess(isAuthenticated);
  }, []);
  return (
    <Route
      {...otherProps}
      render={(props) =>
        hasAccess ? <Component {...props} /> : <Redirect to={'/unauthorized'} />
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
