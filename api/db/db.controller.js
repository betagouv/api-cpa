const request = require('request')

module.exports = DbController;


function DbController(options) {
  options = options || {};
  const logger = options.logger;

  this.get = function(req, res, next) {
    request
      .get(options.dataHost + '/db')
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }
}
