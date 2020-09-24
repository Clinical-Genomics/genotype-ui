import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home } from '../pages/home';
import { Unauthorized } from '../pages/unauthorized';
import PrivateRoute from './PrivateRoute';
import { Samples } from '../pages/samples';
import { Plates } from '../pages/plates';
import { Missing } from '../pages/missing';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Home></Home>
      </Route>
      <Route path="/unauthorized" exact>
        <Unauthorized></Unauthorized>
      </Route>
      <PrivateRoute path="/plates" component={Plates}></PrivateRoute>
      <Route path="/samples">
        <Samples></Samples>
      </Route>
      <Route path="/missing">
        <Missing></Missing>
      </Route>
    </Switch>
  );
};
