const nir = require('./../nir')
const formations = require('./../formations')
const fc = require('./../franceConnect')
const idp = require('./../idPivot')
const db = require('./../db')


exports.configure = function (app, options) {

  app.use('/api/formations', formations(options));
  app.use('/api/cpa', nir(options));
  app.use('/api/fc', fc(options));
  app.use('/', db(options));
  app.use('/api/identitepivot', idp(options));
};
