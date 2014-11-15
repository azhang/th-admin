import React from 'react'
import request from 'superagent'
import mui from 'material-ui'

import DashboardDataStore from '../stores/DashboardDataStore'

import PageWithNav from './page-with-nav'

var {Menu, PaperButton} = mui

export default React.createClass({
  getInitialState() {
    return {
      data: DashboardDataStore.getAll(),
      error: ""
    };
  },
  
  componentDidMount() {
    request
      .get(this.props.url)
      .withCredentials()
      .end((res) => {
        if (res.error)
          this.setState({
            error: `${res.status} ${res.text}`
          })
        else
          DashboardDataStore.setAll(res.body)
      })

    DashboardDataStore.on('change', this._onChange)
  },

  componentWillUnmount() {
    DashboardDataStore.removeListener('change', this._onChange)
  },

  render() {
    var error = ''
    if (this.state.error) error = (
      <div className="error">{this.state.error}</div>
    )

    var menuItems = [
      { route: 'overview', text: 'Overview'},
      { route: 'accounts', text: 'Accounts'},
      { route: 'issues', text: 'Issues'},
      { route: 'ideas', text: 'Ideas'},
      { route: 'groups', text: 'Groups'}
    ]

    return (
      <div>
        <PageWithNav 
          menuItems={menuItems}
          activeRouteHandler={this.props.activeRouteHandler}
          data={this.state.data} />
        {error}
      </div>
    );
  },

  /**
    * Event handler for 'change' events coming from the TodoStore
    */
  _onChange() {
    this.setState({
      data: DashboardDataStore.getAll(),
      error: ""
    })
  }
});