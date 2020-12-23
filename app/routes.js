var express = require('express');
var router = express.Router();

module.exports = function(){
  router.get('/forum', function(req, res) {
    res.redirect('https://forum.beammp.com/');
  });

  router.get('/servers', function(req, res) {
    res.render('servers.ejs');
  });

  router.get('/stats', function(req, res) {
    res.render('stats.ejs');
  });

  router.get('/keymaster', function(req, res) {
    res.redirect('https://forum.beammp.com/');
  });

  return router;
}
