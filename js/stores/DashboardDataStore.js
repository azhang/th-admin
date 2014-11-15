import React from 'react'
import EventEmitter from 'events'
import assign from 'object-assign'

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
  }
});