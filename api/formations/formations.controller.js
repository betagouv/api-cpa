'use strict';

const request = require('request')
const StandardError = require('standard-error');
const _ = require('lodash')

module.exports = FormationsController;


function FormationsController(options) {
  options = options || {};
  const logger = options.logger;

  this.getFormations = function(req, res, next) {
    var search_type = req.query.search_type;
    var search_term = req.query.search_term;

    request
      .get({
        url: options.dataHost + '/formations',
        qs: {}
      }, (err, response, body) => {
      if(err) {
        logger.error(err);
        next(new StandardError("An error as occured", {code: 500}))
      }
      let data = JSON.parse(body)
      //console.log('identity', identity)
      data = _.filter(data, function (item) {
        return (search_type === 'code_cpf' && item.code_cpf === search_term) ||
          (search_type === 'public_vise' && item.public_vise === search_value)
      })
      if (data.length === 0) {
        return next(new StandardError(name + " not found", {code: 404}))
      }
      if (search_type === 'code_cpf' && data.length > 1) {
        return next(new StandardError("join failed", {code: 500}))
      }
      return res.json(data[0])
    })
  }
}
