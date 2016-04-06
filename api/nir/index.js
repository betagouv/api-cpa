
const express = require('express');
const Controller = require('./nir.controller');

const router = express.Router();

module.exports = function(options){
  const nirController = new Controller(options);

  router.get('/:nir/chomage', nirController.getChomage);
  router.get('/:nir/retraite', nirController.getRetraite);
  router.get('/:nir/formation', nirController.getFormation);
  router.get('/:nir/penibilite', nirController.getPenibilite);

  return router
}
