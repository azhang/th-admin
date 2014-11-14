import React from 'react'
import Router from 'react-router'

import Overview from './components/overview'
import Accounts from './components/accounts'
import Projects from './components/projects'
import Groups from './components/groups'

var {Route, Routes, Link, DefaultRoute} = Router;

import App from './components/App'

React.render(
  <Routes>
    <Route path="/" handler={App} url="http://localhost:3000/dashboard_api">
      <DefaultRoute name="overview" handler={Overview} />
      <Route name="accounts" handler={Accounts} />
      <Route name="issues" handler={Projects} projectType="Issues" />
      <Route name="ideas" handler={Projects} projectType="Ideas" />
      <Route name="groups" handler={Groups} />
    </Route>
  </Routes>,
  document.getElementById('content')
);
