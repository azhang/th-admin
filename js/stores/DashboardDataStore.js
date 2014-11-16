import EventEmitter from 'events'
import assign from 'object-assign'
import request from 'superagent'

var _data = {
  user: {recent: []},
  issue: {recent: []},
  idea: {recent: []},
  group: {recent: []}
}

export default assign({}, EventEmitter.prototype, {

  setAll(data) {
    _data = data
    this.emit('change')
  },

  getAll() {
    return _data
  },

  load(url) {
    request
      .get(url)
      .withCredentials()
      .end((res) => {
        if (res.error)
          this.emit('error', `${res.status} ${res.text}`);
        else
          this.setAll(res.body)
      })
  }

});