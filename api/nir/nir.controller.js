const request = require('request')

module.exports = NirController;


function NirController(options) {
  options = options || {};
  const logger = options.logger;

  this.getChomage = function(req, res, next) {
    request
      .get(options.dataHost + '/chomage/' + req.params.nir)
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }

  this.getRetraite = function(req, res, next) {
    request
      .get(options.dataHost + '/retraite/' + req.params.nir)
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }

  this.getFormation = function(req, res, next) {
    request
      .get(options.dataHost + '/formation/' + req.params.nir)
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }
}
