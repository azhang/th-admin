import React from 'react'
import moment from 'moment'

export default React.createClass({
  render: function() {
    var {user} = this.props.data;
    return (
      <div>
        <h2>Users</h2>
        <p>Total: {user.total}</p>
        <p>Today: {user.today}</p>
        <ul>
          {user.recent.map(function(account) {
            var created = new Date(parseInt(account._id.substring(0,8),16)*1000);
            return (
              <li key={account._id}>
                {moment(created).fromNow()}&nbsp;
                {/* TODO: don't use `app` */}
                <a href={"/"+"app"+"/user/"+account._id}>
                  <b>{account.displayName}</b>
                </a> 
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
});