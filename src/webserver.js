/*
 * oooooooooo.                                        ooo        ooooo ooooooooo.   
 * `888'   `Y8b                                       `88.       .888' `888   `Y88. 
 *  888     888  .ooooo.   .oooo.   ooo. .oo.  .oo.    888b     d'888   888   .d88' 
 *  888oooo888' d88' `88b `P  )88b  `888P"Y88bP"Y88b   8 Y88. .P  888   888ooo88P'  
 *  888    `88b 888ooo888  .oP"888   888   888   888   8  `888'   888   888         
 *  888    .88P 888    .o d8(  888   888   888   888   8    Y     888   888         
 * o888bood8P'  `Y8bod8P' `Y888""8o o888o o888o o888o o8o        o888o o888o                                                                                     
 *  ========================================================================
 *  Updated:    2/11/22 22:17
 *  Copyright (c) 2019-2022 BeamMP Ltd. All rights reserved.
 */

require('dotenv').config()
const helmet         = require("helmet");
var morgan           = require('morgan');
const express       = require('express')
const WebServer     = express()
const routes        = require('./routes')
const server        = require('http').createServer(WebServer)


//////////////////////////////////////////////////////////////////////
// Cluster Handling
//////////////////////////////////////////////////////////////////////

const cluster = require('cluster');
if (!cluster.isMaster) {
  cluster.worker.on('disconnect', function() {
    console.log('Worker disconnected, closing server');
    server.close(() => {
      console.log('HTTP server closed')
    })
  });
}

//////////////////////////////////////////////////////////////////////
// Main Webserver
//////////////////////////////////////////////////////////////////////

;(app => {
  'use strict'

  module.exports.server = server
  module.exports.app = app
  module.exports.init = async (callback) => {
    app.disable('x-powered-by')

    if (process.env.DEBUG == "true") {
      console.log('Request Logging Enabled.')
      app.use(morgan('dev', {
        /*skip: function (req, res) { 
          return res.statusCode == 200 || res.statusCode == 401
        }*/
      }))
    }
  
    app.use(helmet());

    // CORS
    app.use(allowCrossDomain)

    // PROXY HANDLING
    app.set('trust proxy', true);

    // set the view engine to ejs
    app.set('view engine', 'ejs');

    app.use(express.static(require('path').join(__dirname, 'static')))

    app.set("views", "./src/views")

    routes(app) 

    if (typeof callback === 'function') callback()
  }

  module.exports.listen = (callback) => {
    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        console.error('Address in use, exiting...')
        server.close()
      } else {
        console.error(err.message)
        throw err
      }
    })

    server.listen(process.env.PORT, '0.0.0.0', () => {
      console.log('Backend is now listening on port: ' + process.env.PORT)

      if (typeof callback === 'function') return callback()
    })
  }
})(WebServer)

function allowCrossDomain (req, res, next) {
  const allowedOrigins = ['http://127.0.0.1:3599', 'http://localhost:3599', 'https://beammp.com', 'https://backend.beammp.com'];
  const origin = req.headers['origin'];
  console.log(origin)
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000') // TODO: Update this to the keymaster domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,authorization,X-RToken,X-Token,Origin'
  )
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none';")

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
}