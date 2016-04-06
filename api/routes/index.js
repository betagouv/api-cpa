const nir = require('./../nir')
const fc = require('./../franceConnect')


exports.configure = function (app, options) {

  app.use('/api/cpa', nir(options));
  app.use('/api/fc', fc(options));
};
