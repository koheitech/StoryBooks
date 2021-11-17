'use strict';

const moment = require('moment');

module.exports = {
  formatDate: function (data, format) {
    return moment(data).format(format);
  }
};