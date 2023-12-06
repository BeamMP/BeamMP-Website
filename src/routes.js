var express = require('express');
var router = express.Router();

function mainRoutes(router) {
  router.get('/', function (req, res) {
    res.render('index.ejs');
  });

  router.get('/servers', function (req, res) {
    res.render('servers.ejs');
  });

  router.get('/stats', function (req, res) {
    res.render('stats.ejs');
  });

  router.get('/ping', function (req, res) {
    res.send('OK');
  });

  /**
   * Backwards Compat for OLD launcher versions
   */
  router.get('/builds/launcher', function(req, res) {
    if (req.query.download == 'true') {
      //res.download('https://backend.beammp.com/builds/launcher?download=true')
      const file = `${__dirname}/builds/launcher/launcher.exe`;
		  res.download(file); // Set disposition and send it.
    } else if (req.query.version == 'true') {
      //res.redirect('https://backend.beammp.com/builds/launcher?version=true')
      const file = `${__dirname}/builds/launcher/version.json`;
		  res.download(file); // Set disposition and send it.
    } else {
      //res.sendStatus(403)
      res.send("Not Found!")
    }
  });

  /**
   * Redirects
   */

  router.get('/keymaster', function (req, res) {
    res.redirect('https://keymaster.beammp.com/');
  });
  router.get('/k/keys', function (req, res) {
    res.redirect('https://keymaster.beammp.com/');
  });
  router.get('/k/dashboard', function (req, res) {
    res.redirect('https://keymaster.beammp.com/');
  });
}

module.exports = function (app) {
  try {
    mainRoutes(router)
  } catch (e) {
    console.error(e)
  }

  app.use('/', router)
  app.use(handle404)
  app.use(handleErrors)
  app.use(clientErrorHandler)
}

function handleErrors(err, req, res) {
  const status = err.status || 500
  res.status(err.status)

  if (status === 429) {
    res.render('429', { layout: false })
    return
  }

  if (status === 500) {
    res.render('500', { layout: false })
    return
  }

  if (status === 503) {
    res.render('503', { layout: false })
    return
  }

  winston.warn(err.stack)

  res.json({
    message: err.message,
    error: err,
  })
}

function handle404(req, res) {
  return res.status(404).send('404')
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}