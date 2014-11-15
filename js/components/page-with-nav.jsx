import React from 'react'
import Router from 'react-router'
import mui from 'material-ui'

var {Menu} = mui

export default React.createClass({

  mixins: [Router.Navigation, Router.ActiveState],

  propTypes: {
    menuItems: React.PropTypes.array
  },

  render: function() {
    return (
      <div className="mui-app-content-canvas page-with-nav">
        <div className="page-with-nav-content">
          <this.props.activeRouteHandler data={this.props.data} />
        </div>
        <div className="page-with-nav-secondary-nav">
          <Menu 
            ref="menuItems" 
            zDepth={0} 
            menuItems={this.props.menuItems} 
            selectedIndex={this._getSelectedIndex()} 
            onItemClick={this._onMenuItemClick} />
        </div>
      </div>
    );
  },

  _getSelectedIndex: function() {
    var menuItems = this.props.menuItems,
      currentItem;

    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      if (currentItem.route && this.isActive(currentItem.route)) return i;
    };
  },

  _onMenuItemClick: function(e, index, item) {
    this.transitionTo(item.route);
  }
  
});