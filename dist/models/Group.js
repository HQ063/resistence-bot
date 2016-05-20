'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
  _id: Number,
  name: String,
  host: Object,
  users: Array
}, {
  timestamps: true
});

exports.default = mongoose.model('Group', groupSchema);