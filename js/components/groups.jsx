import React from 'react'
import moment from 'moment'

export default React.createClass({
  render: function() {
    var {group} = this.props.data;

    return (
      <div>
        <h2>Groups</h2>
        <p>Total: {group.total}</p>
        <p>Today: {group.today}</p>
        <ul>
          {group.recent.map(function(group) {
            var created = new Date(parseInt(group._id.substring(0,8),16)*1000);
            return (
              <li key={group._id}>
                {moment(created).fromNow()}&nbsp;
                <a href={"/"+group.subdomain}>
                  <b>{group.name}
                  </b>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
});