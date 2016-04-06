
const express = require('express');
const Controller = require('./fc.controller');

const router = express.Router();

module.exports = function(options){
  const fcController = new Controller(options);

  router.get('/chomage', fcController.getChomage);
  router.get('/retraite', fcController.getRetraite);
  router.get('/formation', fcController.getFormation);
  router.get('/penibilite', fcController.getPenibilite);

  return router
}
