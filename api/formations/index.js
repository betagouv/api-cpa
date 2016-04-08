
const express = require('express');
const Controller = require('./formations.controller');

const router = express.Router();

module.exports = function(options){
  const formationsController = new Controller(options);

  router.get('/', formationsController.getFormations);

  return router
}
