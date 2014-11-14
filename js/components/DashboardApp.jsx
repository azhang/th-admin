//var Footer = require('./Footer.react');
import Header from './Header'
//var MainSection = require('./MainSection.react');
var React = require('react');
var DataStore = require('../stores/DataStore');

/**
 * Retrieve the current DATA data from the DataStore
 */
function getDataState() {
  return {
    allDatas: DataStore.getAll()
  };
}

var DataApp = React.createClass({

  getInitialState: function() {
    return getDataState();
  },

  componentDidMount: function() {
    DataStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DataStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>
        <Header 
          addDatas={this.state.allDatas}
        />
        {/*<MainSection
          allDatas={this.state.allDatas}
        />*/}
        {/*<Footer allDatas={this.state.allDatas} />*/}
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the DataStore
   */
  _onChange: function() {
    this.setState(getDataState());
  }

});

module.exports = DataApp;