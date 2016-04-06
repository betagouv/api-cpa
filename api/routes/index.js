const nir = require('./../nir')
const fc = require('./../franceConnect')
const idp = require('./../idPivot')


exports.configure = function (app, options) {

  app.use('/api/cpa', nir(options));
  app.use('/api/fc', fc(options));
  app.use('/api/identitepivot', idp(options));
};
