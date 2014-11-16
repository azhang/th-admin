import React from 'react'
import Router from 'react-router'

import App from './components/App'
import Overview from './pages/overview'
import Accounts from './pages/accounts'
import Projects from './pages/projects'
import Groups from './pages/groups'

var {Route, Routes, DefaultRoute} = Router;

React.render(
  <Routes>
    <Route path="/" handler={App} url="https://www.thinkero.us/dashboard_api">
      <DefaultRoute name="overview" handler={Overview} />
      <Route name="accounts" handler={Accounts} />
      <Route name="issues" handler={Projects} projectType="Issues" />
      <Route name="ideas" handler={Projects} projectType="Ideas" />
      <Route name="groups" handler={Groups} />
    </Route>
  </Routes>,
  document.body
);
