const request = require('request')
const StandardError = require('standard-error');

module.exports = FcController;


function FcController(options) {
  options = options || {};
  const logger = options.logger;

  this.getChomage = get("chomage", "CPA_chomage")

  this.getRetraite = get("retraite", "CPA_retraite")

  this.getFormation = get("formation", "CPA_formation")

  function get(name, scope) {
    return function(req, res, next) {
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
            })
            .on('error', function(err) {
              logger.err(err)
              next(err)
            })
            .pipe(res)
        })
    }
  }
}
