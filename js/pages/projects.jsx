import React from 'react'
import moment from 'moment'

export default React.createClass({
  render: function() {
    var type = (this.props.projectType === "Issues") ? 'issue':'idea';
    var projects = this.props.data[type];

    return (
      <div>
        <h2>{this.props.projectType}</h2>
        <p>Total: {projects.total}</p>
        <p>Today: {projects.today}</p>
        <ul>
          {projects.recent.map(function(project) {
            var created = new Date(parseInt(project._id.substring(0,8),16)*1000);
            return (
              <li key={project._id}>
                {moment(created).fromNow()}&nbsp;
                <a href={"https://www.thinkero.us/"+project._group+"/projects/"+project._id}>
                  <b>{project.title}
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