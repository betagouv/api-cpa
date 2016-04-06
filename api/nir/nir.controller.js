const request = require('request')

module.exports = NirController;


function NirController(options) {
  options = options || {};
  const logger = options.logger;

  this.getChomage = function(req, res, next) {
    get("chomage", req.params.nir)
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }

  this.getRetraite = function(req, res, next) {
    get("retraite", req.params.nir)
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }

  this.getFormation = function(req, res, next) {
    get("formation", req.params.nir)
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }

  this.getPenibilite = function(req, res, next) {
    get("penibilite", req.params.nir)
      .on('error', function(err) {
        logger.err(err)
        next(err)
      })
      .pipe(res)
  }

   function get(name, nir, res, next) {
    return request
      .get(options.dataHost + '/' + name + '/' + nir)

  }
}
