import React from 'react'
import moment from 'moment'


export default React.createClass({
  render: function() {
    var data = this.props.data;
    return (
      <div>
        <h2>Overview</h2>
        <ul>
          {Object.keys(data).map(function(key) {
            var created = "Never";
            if (data[key] && data[key].recent && data[key].recent.length > 0) {
              created = new Date(parseInt(data[key].recent[0]._id.substring(0,8),16)*1000);
              created = moment(created).fromNow();
            } 

            return (
              <li key={key}>
                <h4>{key}</h4>
                <p>Total: {data[key].total}</p>
                <p>Today: {data[key].today}</p>
                <p>Last updated: {created}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});