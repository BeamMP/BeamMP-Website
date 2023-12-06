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