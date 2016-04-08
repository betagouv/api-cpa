'use strict';

const request = require('request')
const StandardError = require('standard-error');
const _ = require('lodash')

module.exports = FormationsController;


function FormationsController(options) {
  options = options || {};
  const logger = options.logger;

  this.getFormations = function(req, res, next) {
    var public_vise = req.query.public_vise
    request
      .get({
        url: options.dataHost + '/liste_formations',
        qs: {}
      }, (err, response, body) => {
      if(err) {
        logger.error(err);
        next(new StandardError("An error as occured", {code: 500}))
      }
      let data = JSON.parse(body)
      data = _.filter(data, function (item) {
        return public_vise === null ||
          (public_vise === item.public_vise)
      })
      return res.json(data)
    })
  }
}
