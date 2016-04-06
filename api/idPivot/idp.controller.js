const request = require('request')
const StandardError = require('standard-error');

module.exports = IdpController;


function IdpController(options) {
  options = options || {};
  const logger = options.logger;

  this.getChomage = get("chomage")

  this.getRetraite = get("retraite")

  this.getFormation = get("formation")

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
        })
        .on('error', function(err) {
          logger.err(err)
          next(err)
        })
        .pipe(res)

    }
  }
}
