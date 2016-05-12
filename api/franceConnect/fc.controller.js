'use strict';

const request = require('request')
const StandardError = require('standard-error');
const _ = require('lodash')
const apirService = require('../services/apirService');
const idpToNirService = require('../services/idpToNirService');
module.exports = FcController;

function FcController(options) {
  options = options || {};
  const logger = options.logger;

  this.getChomage = get("chomage", "CPA_chomage")

  this.getRetraite = get("retraite", "CPA_retraite")

  this.getFormation = get("formation", "CPA_formation")

  this.getPenibilite = get("penibilite", "CPA_penibilite")

  this.putEndOfNir = putEndOfNir()

  function fcCheckToken(token, scope, next, callback) {
    request
      .post({
        url :'https://fcp.integ01.dev-franceconnect.fr/api/v1/checktoken',
        body: { token: token },
        json: true
      },
      function (error, response, body) {
        if(error) {
          return next(new StandardError("An error has occured when connecting to FC", {code: 500}));
        }
        if(response.statusCode === 401) {
          return next(new StandardError(body.error.message, {code: 401}));
        }
        if(response.statusCode === 400) {
          return next(new StandardError(body.error.message, {code: 400}));
        }
        if(scope && body.scope.indexOf(scope) < 0) {
          const msg = "needed scope (" + scope + ") is not in"  + JSON.stringify(body.scope)
          return next(new StandardError(msg, {code: 403}));
        }
        return callback(body.identity);
      });
  }

  function putEndOfNir() {
    return function(req, res, next) {
      logger.error(new StandardError("in FcController\n"));
      fcCheckToken(req.query.token, null, next, function (identity) {
        const startOfNir = idpToNirService(identity);
        if (!startOfNir) {
          return next(new StandardError("invalid identité pivot" , {code: 401}));
        }
        apirService.putEndOfNir(identity, req.query.endOfNir)
          .catch(function(err) {
            return next(err);
          })
          .then(function(statusCode) {
            return res.status(statusCode).json({message: statusCode});
          });
      })
    }
  }

  function get(name, scope) {
    return function(req, res, next) {
      logger.error(new StandardError("in FcController\n"));
      request
        .post({
          url :'https://fcp.integ01.dev-franceconnect.fr/api/v1/checktoken',
          body: { token: req.query.token },
          json: true
        }, function (error, response, body) {
          if(error) {
            return next(new StandardError("An error has occured when connecting to FC", {code: 500}));
          }
          if(response.statusCode === 401) {
            return next(new StandardError(body.error.message, {code: 401}));
          }
          if(response.statusCode === 400) {
            return next(new StandardError(body.error.message, {code: 400}));
          }
          if(body.scope.indexOf(scope) < 0) {
            const msg = "needed scope (" + scope + ") is not in"  + JSON.stringify(body.scope)
            return next(new StandardError(msg, {code: 403}));
          }
          const identity = body.identity

          const startOfNir = idpToNirService(identity);
          if (!startOfNir) {
            return next(new StandardError("invalid identité pivot" , {code: 401}));
          }
          apirService.getEndOfNir(identity)
            .catch(function(err) {
              return next(err);
            })
            .then(function(endOfNir) {
              var nir = startOfNir + endOfNir;
              return res.json({nir: nir});

              request
                .get({
                  url: options.dataHost + '/' + name,
                  qs: {
                    'identity.given_name': identity.given_name,
                    'identity.family_name': identity.family_name,
                    'identity.birthdate': identity.birthdate,
                    'identity.gender': identity.gender,
                    'identity.birthplace': identity.birthplace,
                    'identity.birthdepartment': identity.birthdepartment,
                    'identity.birthcountry': identity.birthcountry
                  }
                }, (err, response, body) => {
                  if(err) {
                    logger.error(err);
                    next(new StandardError("An error as occured", { code: 500 }))
                  }
                  let data = JSON.parse(body)
                  //console.log('identity', identity)
                  data = _.filter(data, function(item)  {
                    return item.identification.given_name === identity.given_name &&
                    item.identification.family_name === identity.family_name &&
                    item.identification.birthdate === identity.birthdate &&
                    item.identification.gender === identity.gender &&
                    item.identification.birthplace === identity.birthplace &&
                    item.identification.birthdepartment === identity.birthdepartment &&
                    item.identification.birthcountry === identity.birthcountry
                  })
                  if(data.length === 0) {
                    return next(new StandardError( name + " not found (" + JSON.stringify(identity) + ")", { code: 404 }))
                  }
                  if(data.length > 1) {
                    return next(new StandardError("join failed", { code: 500 }))
                  }


                  //return res.json({startofnir: idpToNir(data[0].identification)})
                })
            })
        })
    }
  }
}
