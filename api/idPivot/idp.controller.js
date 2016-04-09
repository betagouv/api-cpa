'use strict';

const request = require('request')
const StandardError = require('standard-error');
const _ = require('lodash')
const ChomageService = require('../allocations/chomage.service')

module.exports = IdpController;


function IdpController(options) {
  options = options || {};
  const chomageService = new ChomageService();
  const logger = options.logger;

  this.getChomage = get("chomage")

  this.getRetraite = get("retraite")

  this.getFormation = get("formation")

  this.calculateChomage= function(req, res, next) {
    getData('chomage', req.query, (err, data) => {
      if(err) return next(err)
      const alloc = chomageService.getAllocations(data.emplois, data.debitprestation)
      res.json(alloc)
    })
  }

  this.getPenibilite = get("penibilite")

  function get(name) {
    return function(req, res, next) {
      if( !req.query.given_name ||
          !req.query.family_name ||
          !req.query.birthdate ||
          !req.query.gender ||
          !req.query.birthplace ||
          !req.query.birthdepartment ) {
        return next(new StandardError("One parameters is missing", {code: 400}))
      }
      getData(name, req.query, (err, data) => {
        if(err) return next(err)
        res.json(data)
      })
    }
  }

  function getData(name, query, callback) {
    request
      .get({
        url: options.dataHost + '/' + name
      }, (err, response, body) => {
        if(err) {
          logger.error(err);
          callback(new StandardError("An error as occured", { code: 500 }))
        }
        let data = JSON.parse(body)
        data = _.filter(data, function(item)  {
          return item.identification.given_name === query.given_name &&
          item.identification.family_name === query.family_name &&
          item.identification.birthdate === query.birthdate &&
          item.identification.gender === query.gender &&
          item.identification.birthplace === query.birthplace &&
          item.identification.birthdepartment === query.birthdepartment &&
          item.identification.birthcountry === query.birthcountry
        })
        if(data.length === 0) {
          return callback(new StandardError( name + "not found ", { code: 404 }))
        }
        if(data.length > 1) {
          return callback(new StandardError("join failed", { code: 500 }))
        }
        callback(null, data[0])
      })
  }
}
