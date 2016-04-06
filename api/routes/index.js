const nir = require('./../nir')


exports.configure = function (app, options) {

  app.use('/api/cpa', nir(options));
};
