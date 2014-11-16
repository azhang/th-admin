import React from 'react'
import mui from 'material-ui'

import DashboardDataStore from '../stores/DashboardDataStore'
import GADataStore from '../stores/GADataStore'

import PageWithNav from './page-with-nav'
import {handleAuthClick} from '../google-analytics'

var {AppCanvas, AppBar, Menu, Paper, PaperButton} = mui

export default React.createClass({
  getInitialState() {
    return {
      data: DashboardDataStore.getAll(),
      ga_data: GADataStore.getAll(),
      error: ''
    };
  },
  
  componentDidMount() {
    DashboardDataStore.load(this.props.url);

    DashboardDataStore.on('change', this._onChange)
    DashboardDataStore.on('error', this._onError);

    GADataStore.on('change', this._onChange)
    GADataStore.on('error', this._onError)
  },

  componentWillUnmount() {
    DashboardDataStore.removeListener('change', this._onChange)
    DashboardDataStore.removeListener('error', this._onChange)
    GADataStore.removeListener('change', this._onChange)
    GADataStore.removeListener('error', this._onChange)
  },

  render() {
    var menuItems = [
      { route: 'overview', text: 'Overview'},
      { route: 'accounts', text: 'Accounts', number: this.state.data.user.total },
      { route: 'issues', text: 'Issues', number: this.state.data.issue.total },
      { route: 'ideas', text: 'Ideas', number: this.state.data.idea.total },
      { route: 'groups', text: 'Groups', number: this.state.data.group.total }
    ]

    // GA unauthorized
    var ga = (
      <span style={{float:"right", lineHeight:"64px", color:"white"}}>
        <PaperButton 
          type="RAISED" 
          label="Authorize GA" 
          onClick={handleAuthClick} />
      </span>
    );
    if (this.state.ga_data.auth)
      ga = (
        <span style={{float:"right", lineHeight:"64px", color:"white"}}>
          <Paper zDepth={0}>
            Active Users: {this.state.ga_data.activeUsers}
          </Paper>
        </span>
      )


    return (
      <AppCanvas predefinedLayout={1}>
        <AppBar 
          title="Thinkerous • Dashboard" 
          zDepth={1}>
          {ga}
        </AppBar>
        <PageWithNav 
          menuItems={menuItems}
          activeRouteHandler={this.props.activeRouteHandler}
          data={this.state.data}
          error={this.state.error} />
      </AppCanvas>
    );
  },

  /**
    * Event handler for 'change' events coming from the DashboardDataStore
    * and GADataStore
    */
  _onChange() {
    this.setState({
      data: DashboardDataStore.getAll(),
      ga_data: GADataStore.getAll(),
      error: ""
    })
  },

  /**
    * Event handler for 'error' events coming from the DashboardDataStore
    * and GADataStore
    */
  _onError(error) {
    this.setState({
      error: error
    })
  }
});