'use strict';

const request = require('request')
const StandardError = require('standard-error');
const _ = require('lodash')

module.exports = IdpController;


function IdpController(options) {
  options = options || {};
  const logger = options.logger;

  this.getChomage = get("chomage")

  this.getRetraite = get("retraite")

  this.getFormation = get("formation")

  this.getPenibilite = get("penibilite")

  function get(name, scope) {
    return function(req, res, next) {
      if( !req.query.given_name ||
          !req.query.family_name ||
          !req.query.birthdate ||
          !req.query.gender ||
          !req.query.birthplace ||
          !req.query.birthdepartment ) {
        return next(new StandardError("One parameters is missing", {code: 400}))
      }
      request
        .get({
          url: options.dataHost + '/' + name,
          qs: {
            'identity.given_name': req.query.given_name,
            'identity.family_name': req.query.family_name,
            'identity.birthdate': req.query.birthdate,
            'identity.gender': req.query.gender,
            'identity.birthplace': req.query.birthplace,
            'identity.birthdepartment': req.query.birthdepartment,
            'identity.birthcountry': req.query.birthcountry
          }
        }, (err, response, body) => {
          if(err) {
            logger.error(err);
            next(new StandardError("An error as occured", { code: 500 }))
          }
          let data = JSON.parse(body)
          data = _.filter(data, function(item)  {
            return item.identification.given_name === req.query.given_name &&
            item.identification.family_name === req.query.family_name &&
            item.identification.birthdate === req.query.birthdate &&
            item.identification.gender === req.query.gender &&
            item.identification.birthplace === req.query.birthplace &&
            item.identification.birthdepartment === req.query.birthdepartment &&
            item.identification.birthcountry === req.query.birthcountry
          })
          if(data.length === 0) {
            return next(new StandardError( name + "not found ", { code: 404 }))
          }
          if(data.length > 1) {
            return next(new StandardError("join failed", { code: 500 }))
          }
          return res.json(data[0])
        })

    }
  }
}
