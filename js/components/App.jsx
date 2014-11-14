import React from 'react'
import Router from 'react-router'
import EventEmitter from 'events'
import assign from 'object-assign'
import request from 'superagent'

import Overview from './overview'
import Accounts from './accounts'
import Projects from './projects'
import Groups from './groups'

var {Link} = Router

var DashboardDataStore = assign({}, EventEmitter.prototype, {
  _data: {
    user: {recent: []},
    issue: {recent: []},
    idea: {recent: []},
    group: {recent: []}
  },

  setAll(data) {
    this._data = data
    this.emit('change')
  },

  getAll() {
    return this._data
  }
});

export default React.createClass({
  getInitialState() {
    return DashboardDataStore.getAll()
  },
  
  componentDidMount() {
    request
      .get(this.props.url)
      .withCredentials()
      .end((res) => {
        if (res.clientError) 
          console.error(res.text)
        else
          DashboardDataStore.setAll(res.body)
      })

    DashboardDataStore.on('change', this._onChange)
  },

  componentWillUnmount() {
    DashboardDataStore.removeListener('change', this._onChange)
  },

  render() {
    return (
      <div>
        <ul>
          <li><Link to="overview">Overview</Link></li>
          <li><Link to="accounts">Accounts</Link></li>
          <li><Link to="issues">Issues</Link></li>
          <li><Link to="ideas">Ideas</Link></li>
          <li><Link to="groups">Groups</Link></li>
        </ul>
        <this.props.activeRouteHandler data={this.state}/>
      </div>
    );
  },

  /**
    * Event handler for 'change' events coming from the TodoStore
    */
  _onChange() {
    this.setState(DashboardDataStore.getAll())
  }
});