
const express = require('express');
const Controller = require('./db.controller');

const router = express.Router();

module.exports = function(options){
  const dbController = new Controller(options);

  router.get('/db', dbController.get);

  return router
}
