import EventEmitter from 'events'
import assign from 'object-assign'
import request from 'superagent'

var _data = {
  auth: false,
  accounts: [],
  selectedAccountIndex: 0,
  webproperties: [],
  selectedWebPropertyIndex: 0,
  profiles: [],
  selectedProfileIndex: 0
}

export default assign({}, EventEmitter.prototype, {

  setAll(data) {
    _data = data
    this.emit('change', _data)
  },

  getAll() {
    return _data
  },

  set(key, val) {
    _data[key] = val;
    this.emit('change', _data);
  },

  get(key) {
    return _data[key];
  }
});